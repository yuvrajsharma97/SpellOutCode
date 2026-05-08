const User = require("../models/user");
const AppError = require("../utils/appError");
const imageService = require("./uploadToImageKitService");

// Get public profile by user ID
const getProfileByUserId = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("Profile not found", 404);
  }

  return user;
};

// ── Update profile text fields ────
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

// ── Upload or replace avatar ──────
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
  getProfileByUserId,
  updateProfile,
  updateAvatar,
};
