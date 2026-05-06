const User = require("../models/user");
const AppError = require("../utils/appError");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");


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
};
