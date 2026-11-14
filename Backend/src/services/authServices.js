const User = require("../models/user");
const PendingUser = require("../models/pendingUser");
const AppError = require("../utils/appError");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");

const {
  sendPasswordResetEmail,
  sendVerificationEmail,
  registrationSuccessEmailTemplate,
} = require("./contactServices");

// One auth email per address per minute, at most 3 live sign-ups per address.
const EMAIL_COOLDOWN_MS = 60 * 1000;
const MAX_PENDING_PER_EMAIL = 3;
const VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;

// Compared against when no account matches, so a login for an unknown email
// costs the same bcrypt work as one for a real account.
const DUMMY_PASSWORD_HASH = bcrypt.hashSync("timing-equaliser-not-a-password", 12);

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const clientUrl = () => (process.env.CLIENT_URL || "").replace(/\/$/, "");

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  bio: user.bio,
  roleTitle: user.roleTitle,
  socialLinks: user.socialLinks,
  skills: user.skills,
});

const issueSession = async (user) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { user: sanitizeUser(user), accessToken, refreshToken };
};

// Fire-and-forget email so response time does not reveal whether an
// account exists. Failures are logged, never surfaced.
const sendInBackground = (promiseFactory, label) => {
  setImmediate(() => {
    promiseFactory().catch((err) => console.error(`[email:${label}]`, err.message));
  });
};

/**
 * Sign-up. Never reveals whether the email already has an account: the
 * response is identical either way. Usernames are public, so a taken
 * username is reported.
 */
const registerUser = async ({ name, username, email, password }) => {
  if (await User.exists({ username })) {
    throw new AppError("This username is already taken.", 409);
  }

  // Same bcrypt cost on both branches below.
  const passwordHash = await bcrypt.hash(password, 12);

  if (await User.exists({ email })) {
    // Existing verified account: send nothing (the owner can use
    // "forgot password"), return the same response.
    return;
  }

  const now = Date.now();
  const pending = await PendingUser.find({ email, expiresAt: { $gt: now } })
    .select("lastSentAt")
    .lean();

  const recentlySent = pending.some(
    (p) => now - new Date(p.lastSentAt).getTime() < EMAIL_COOLDOWN_MS,
  );
  if (recentlySent || pending.length >= MAX_PENDING_PER_EMAIL) {
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  await PendingUser.create({
    name,
    username,
    email,
    passwordHash,
    tokenHash: hashToken(token),
    lastSentAt: now,
    expiresAt: now + VERIFICATION_TTL_MS,
  });

  const verifyUrl = `${clientUrl()}/verify-email/${token}`;
  sendInBackground(() => sendVerificationEmail(email, name, verifyUrl), "verify");
};

const findPendingByToken = async (token) => {
  if (typeof token !== "string" || !token) return null;
  return PendingUser.findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: Date.now() },
  });
};

/**
 * Lets the verify page show which username the link activates.
 */
const getPendingVerification = async (token) => {
  const pending = await findPendingByToken(token);
  if (!pending) {
    throw new AppError("This verification link is invalid or has expired.", 400);
  }
  return { username: pending.username };
};

/**
 * Activate a sign-up. Requires both the emailed token (proves mailbox
 * ownership) and the password chosen at sign-up (proves this is the person
 * who created this sign-up), then logs the new user in.
 */
const verifyEmail = async (token, password) => {
  const pending = await findPendingByToken(token);
  if (!pending) {
    throw new AppError("This verification link is invalid or has expired.", 400);
  }

  if (!(await bcrypt.compare(password, pending.passwordHash))) {
    pending.failedAttempts += 1;
    if (pending.failedAttempts >= MAX_VERIFY_ATTEMPTS) {
      await pending.deleteOne();
      throw new AppError(
        "Too many incorrect attempts. Please sign up again.",
        400,
      );
    }
    await pending.save();
    throw new AppError(
      "That password doesn't match the one you chose when signing up.",
      400,
    );
  }

  if (await User.exists({ email: pending.email })) {
    await PendingUser.deleteMany({ email: pending.email });
    throw new AppError(
      "This email is already verified. Please sign in instead.",
      409,
    );
  }

  if (await User.exists({ username: pending.username })) {
    await pending.deleteOne();
    throw new AppError(
      "That username was taken while your sign-up was pending. Please sign up again with a different username.",
      409,
    );
  }

  let user;
  try {
    // Plain password: the model's pre-save hook hashes it.
    user = await User.create({
      name: pending.name,
      username: pending.username,
      email: pending.email,
      password,
    });
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError(
        "This account was just activated. Please sign in instead.",
        409,
      );
    }
    throw err;
  }

  await PendingUser.deleteMany({ email: pending.email });

  sendInBackground(
    () => registrationSuccessEmailTemplate(user.email, user.name),
    "welcome",
  );

  return issueSession(user);
};

/**
 * Resend a verification link for the newest live sign-up of this email.
 * Always answers the same way.
 */
const resendVerification = async (email) => {
  const now = Date.now();
  const pending = await PendingUser.findOne({ email, expiresAt: { $gt: now } })
    .sort({ createdAt: -1 });

  if (!pending || now - pending.lastSentAt.getTime() < EMAIL_COOLDOWN_MS) {
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  pending.tokenHash = hashToken(token);
  pending.lastSentAt = now;
  await pending.save();

  const verifyUrl = `${clientUrl()}/verify-email/${token}`;
  sendInBackground(
    () => sendVerificationEmail(pending.email, pending.name, verifyUrl),
    "verify-resend",
  );
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password +refreshToken");

  // Always run one bcrypt compare so timing does not reveal account existence.
  const passwordOk = await bcrypt.compare(
    password,
    user ? user.password : DUMMY_PASSWORD_HASH,
  );

  if (!user || !passwordOk) {
    throw new AppError("Invalid email or password", 401);
  }

  return issueSession(user);
};

const getMe = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("We couldn't find your account. Please log in again.", 404);
  }

  return sanitizeUser(user);
};

/**
 * Verify a refresh token string and return its payload, or null.
 * Rejects non-strings: cookie-parser turns "j:{...}" cookies into objects,
 * which must never reach a database filter.
 */
const decodeRefreshToken = (token) => {
  if (typeof token !== "string" || !token) return null;
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    return null;
  }
};

const logoutUser = async (refreshToken) => {
  const decoded = decodeRefreshToken(refreshToken);
  if (!decoded) return;

  await User.updateOne(
    { _id: decoded.id, refreshToken },
    { $set: { refreshToken: null } },
  );
};

const rotateRefreshToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new AppError("You're not logged in. Please log in to continue.", 401);
  }

  const decoded = decodeRefreshToken(incomingRefreshToken);
  if (!decoded) {
    throw new AppError("Your session has expired. Please log in again.", 403);
  }

  const user = await User.findOne({
    _id: decoded.id,
    refreshToken: incomingRefreshToken,
  }).select("+refreshToken +passwordChangedAt");

  // A refresh token minted before the latest password change is dead even
  // if it somehow survived in storage.
  if (!user || user.changedPasswordAfter(decoded.iat)) {
    throw new AppError("Your session has expired. Please log in again.", 403);
  }

  return issueSession(user);
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email }).select("+passwordResetRequestedAt");

  if (!user) return;

  // Per-account cooldown: at most one reset email per minute per address,
  // regardless of how many IPs ask.
  const last = user.passwordResetRequestedAt?.getTime() || 0;
  if (Date.now() - last < EMAIL_COOLDOWN_MS) return;

  const resetToken = user.createPasswordResetToken();
  user.passwordResetRequestedAt = Date.now();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${clientUrl()}/reset-password/${resetToken}`;
  const userId = user._id;

  sendInBackground(async () => {
    try {
      await sendPasswordResetEmail(user.email, user.name, resetURL);
    } catch (err) {
      // Invalidate the token that was never delivered.
      await User.updateOne(
        { _id: userId },
        { $unset: { passwordResetToken: 1, passwordResetExpires: 1 } },
      );
      throw err;
    }
  }, "reset");
};

const resetPassword = async (resetToken, newPassword) => {
  if (typeof resetToken !== "string" || !resetToken) {
    throw new AppError("This reset link is invalid or has expired.", 400);
  }

  const user = await User.findOne({
    passwordResetToken: hashToken(resetToken),
    passwordResetExpires: { $gt: Date.now() },
  }).select("+password");

  if (!user) {
    throw new AppError("This reset link is invalid or has expired.", 400);
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  // Revoke every existing session: recovery must lock out whoever had access.
  user.refreshToken = null;

  await user.save();
};

/**
 * Change password while logged in. Revokes all other sessions and returns
 * a fresh session for the caller.
 */
const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new AppError("We couldn't find your account. Please log in again.", 404);
  }

  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError("Current password is incorrect", 401);
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = null;
  await user.save();

  return issueSession(user);
};

module.exports = {
  registerUser,
  getPendingVerification,
  verifyEmail,
  resendVerification,
  loginUser,
  logoutUser,
  rotateRefreshToken,
  forgotPassword,
  resetPassword,
  getMe,
  changePassword,
};
