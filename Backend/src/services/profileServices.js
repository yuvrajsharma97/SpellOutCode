const User = require("../models/user");
const AppError = require("../utils/appError");
const imageService = require("./uploadToImageKitService");

/**
 * get profile by username (public route) 
 */
const getProfileByUsername = async (username) => {
  const user = await User.findOne({ username }).select(
    "name username bio roleTitle socialLinks skills avatar",
  );

  if (!user) {
    throw new AppError("Profile not found", 404);
  }

  return user;
};

/**
 * update profile (protected route)
 */
const updateProfile = async (userId, data) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: data },
    { new: true, runValidators: true },
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

/**
 * update avatar (protected route)
 */
const updateAvatar = async (userId, fileBuffer, originalName) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Delete old avatar from ImageKit if one exists
  if (user.avatar && user.avatar.fileId) {
    await imageService.deleteImage(user.avatar.fileId);
  }

  // Build a clean filename: avatar-<username>.<ext>
  const ext = originalName.split(".").pop();
  const fileName = `avatar-${user.username}.${ext}`;

  const { url, fileId } = await imageService.uploadImage(
    fileBuffer,
    fileName,
    "/SpellOutCode/avatars",
  );

  user.avatar = { url, fileId };
  await user.save();

  return user;
};

module.exports = {
  getProfileByUsername,
  updateProfile,
  updateAvatar,
};
