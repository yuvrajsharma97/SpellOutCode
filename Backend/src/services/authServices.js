const User = require("../models/user");
const AppError = require("../utils/appError");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");

const {
  sendPasswordResetEmail,
  registrationSuccessEmailTemplate,
} = require("./contactServices");

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

const registerUser = async ({ name, username, email, password }) => {
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    const field = existingUser.email === email ? "Email" : "Username";
    throw new AppError(`${field} is already in use`, 409);
  }

  const user = await User.create({ name, username, email, password });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  registrationSuccessEmailTemplate(user.email, user.name).catch(console.error);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
};

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

const getMe = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return sanitizeUser(user);
};

const logoutUser = async (refreshToken) => {
  if (refreshToken) {
    await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
  }
};

const rotateRefreshToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new AppError("No refresh token provided", 401);
  }

  try {
    jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new AppError("Invalid or expired refresh token", 403);
  }

  const user = await User.findOne({
    refreshToken: incomingRefreshToken,
  }).select("+refreshToken");

  if (!user) {
    throw new AppError("Token reuse detected or session revoked", 403);
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

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) return;

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  await sendPasswordResetEmail(user.email, user.name, resetURL);
};

const resetPassword = async (resetToken, newPassword) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+password");

  if (!user) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select("+password");

  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError("Current password is incorrect", 401);
  }

  user.password = newPassword;
  await user.save();
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  rotateRefreshToken,
  forgotPassword,
  resetPassword,
  getMe,
  changePassword,
};
