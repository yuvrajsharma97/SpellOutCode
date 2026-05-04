const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userModel = require("../models/User");
const AppError = require("../utils/appError");
const uploadToImageKit = require("../utils/uploadToImageKit");
const {
  generateAccessToken,
  generateRefreshToken,
  sendRefreshTokenCookie,
} = require("../utils/generateTokens");

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  bio: user.bio,
  followers: user.followers,
  following: user.following,
  bookmarks: user.bookmarks,
  createdAt: user.createdAt,
});

/**
 * - Register: Create user, issue tokens, set cookie
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(
        new AppError("Please provide name, email and password.", 400),
      );
    }

    const existing = await userModel.findOne({ email });
    if (existing) {
      return next(
        new AppError("An account with this email already exists.", 400),
      );
    }

    const user = await userModel.create({ name, email, password });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    sendRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      status: "success",
      accessToken,
      user: userResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * - Login: Validate credentials, issue tokens, set cookie
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password.", 400));
    }

    const user = await userModel
      .findOne({ email })
      .select("+password +refreshToken");

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Invalid email or password.", 401));
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    sendRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      status: "success",
      accessToken,
      user: userResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * - Refresh Token: Generate new access token using valid refresh token
 */

exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return next(new AppError("No refresh token. Please log in.", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await userModel.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== token) {
      return next(
        new AppError("Invalid refresh token. Please log in again.", 401),
      );
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    sendRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({
      status: "success",
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * - Logout: Clear refresh token from DB and cookie
 */
exports.logout = async (req, res, next) => {
  try {
    await userModel.findByIdAndUpdate(req.user.id, { refreshToken: "" });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res
      .status(200)
      .json({ status: "success", message: "Logged out successfully." });
  } catch (error) {
    next(error);
  }
};

/**
 * - Get Current User: Retrieve user data for the logged-in user
 */

exports.getUserDetails = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    res.status(200).json({ status: "success", user: userResponse(user) });
  } catch (error) {
    next(error);
  }
};

/**
 * - Update Avatar: Allow user to update their profile picture
 */
exports.updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError("Please upload an image.", 400));
    }

    const user = await userModel.findById(req.user.id);

    if (user.avatar.fileId) {
      const imagekit = require("../config/imagekit");
      await imagekit.deleteFile(user.avatar.fileId);
    }

    const { url, fileId } = await uploadToImageKit(
      req.file.buffer,
      `avatar-${user._id}`,
      "SpellOutCode/avatars",
    );

    user.avatar = { url, fileId };
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      avatar: user.avatar,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * - Update Profile: Allow user to update their profile information
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio } = req.body;

    if (req.body.password) {
      return next(new AppError("This route is not for password updates.", 400));
    }

    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      { name, bio },
      { new: true, runValidators: true },
    );

    res.status(200).json({ status: "success", user: userResponse(user) });
  } catch (error) {
    next(error);
  }
};
