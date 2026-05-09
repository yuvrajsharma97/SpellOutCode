const User = require("../models/user");
const AppError = require("../utils/appError");
const crypto = require("crypto");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");

const {
  sendPasswordResetEmail,
  regestrationSuccessEmailTemplate,
} = require("./contactServices");


/**
 * Register a new user.
 */

const registerUser = async ({ name, username, email, password }) => {
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    const field = existingUser.email === email ? "Email" : "Username";
    throw new AppError(`${field} is already in use`, 409);
  }

  const user = await User.create({ name, username, email, password });

  // Send registration success email
  await regestrationSuccessEmailTemplate(user.email, user.name);

  return sanitizeUser(user);
};

/**
 * Login user by validating credentials.
 */

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password +refreshToken");

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
};

/**
 * Logout user by clearing their refresh token.
 */

const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};


/** 
 * Rotate refresh token: validate incoming token and issue new tokens.
 */

const rotateRefreshToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new AppError("No refresh token provided", 401);
  }

  const user = await User.findOne({
    refreshToken: incomingRefreshToken,
  }).select("+refreshToken");

  if (!user) {
    throw new AppError("Invalid or expired refresh token", 403);
  }

  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  user.refreshToken = newRefreshToken;
  await user.save();

  return {
    user: sanitizeUser(user),
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

/**
 * Forgot Password: Generate reset token and send email with instructions.
 */

const forgotPassword = async (email) => {

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(
      "If an account exists, a reset link has been sent. Please check your email.",
      404,
    );
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendPasswordResetEmail(user.email, user.name, resetURL);

  return;
};

/**
 * Reset Password: Validate token, update password, and clear reset token fields.
*/

const resetPassword = async (resetToken, newPassword) => {
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  const user = await User.findOne({ 
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  }).select("+password");

  if (!user) {
    throw new AppError("Invalid or expired reset token, Please try again", 400);
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return;
};

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

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  rotateRefreshToken,
  forgotPassword,
  resetPassword
};
