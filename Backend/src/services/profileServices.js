const User = require("../models/user");
const Project = require("../models/project");
const Update = require("../models/update");
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

  // Attempt to delete old avatar — failure is non-blocking (stale/missing fileId)
  if (user.avatar?.fileId) {
    try {
      await imageService.deleteImage(user.avatar.fileId);
    } catch {
      // continue with upload regardless
    }
  }

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

/**
 * remove avatar (protected route)
 */
const removeAvatar = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.avatar?.fileId) {
    try {
      await imageService.deleteImage(user.avatar.fileId);
    } catch {
      // continue regardless
    }
  }

  user.avatar = { url: "", fileId: "" };
  await user.save();

  return user;
};

const deleteAccount = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  // Delete avatar from ImageKit
  if (user.avatar?.fileId) {
    try { await imageService.deleteImage(user.avatar.fileId); } catch {}
  }

  // Delete all update cover images
  const updates = await Update.find({ author: userId }).select("coverImage");
  for (const update of updates) {
    if (update.coverImage?.fileId) {
      try { await imageService.deleteImage(update.coverImage.fileId); } catch {}
    }
  }

  // Delete all project cover images
  const projects = await Project.find({ author: userId }).select("coverImage");
  for (const project of projects) {
    if (project.coverImage?.fileId) {
      try { await imageService.deleteImage(project.coverImage.fileId); } catch {}
    }
  }

  await Update.deleteMany({ author: userId });
  await Project.deleteMany({ author: userId });
  await User.findByIdAndDelete(userId);
};

module.exports = {
  getProfileByUsername,
  updateProfile,
  updateAvatar,
  removeAvatar,
  deleteAccount,
};
