const User = require("../models/user");
const Project = require("../models/project");
const Update = require("../models/update");
const AppError = require("../utils/appError");
const imageService = require("./uploadToImageKitService");

// Best-effort ImageKit delete. A failure is logged with the fileId so it
// can be cleaned up by hand, never silently dropped.
const safeDeleteImage = async (fileId) => {
  if (!fileId) return;
  try {
    await imageService.deleteImage(fileId);
  } catch (err) {
    console.error(`[imagekit] failed to delete file ${fileId}:`, err.message);
  }
};

// Matches a stored avatar fileId, treating "" and a missing field alike.
const avatarFileIdFilter = (fileId) =>
  fileId ? fileId : { $in: ["", null] };

/**
 * get profile by username (public route) 
 */
const getProfileByUsername = async (username) => {
  const user = await User.findOne({ username }).select(
    "name username bio roleTitle socialLinks skills avatar",
  );

  if (!user) {
    throw new AppError("This profile could not be found.", 404);
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
    throw new AppError("We couldn't find your account. Please log in again.", 404);
  }

  return user;
};

/**
 * update avatar (protected route)
 */
/**
 * Replace the avatar so that exactly one ImageKit file stays referenced:
 * upload the new file, commit it only if the avatar was not changed by a
 * concurrent request (compare-and-set on the old fileId), then delete the
 * old file. A request that loses the race deletes its own upload.
 */
const updateAvatar = async (userId, fileBuffer, originalName) => {
  const user = await User.findById(userId).select("username avatar");

  if (!user) {
    throw new AppError("We couldn't find your account. Please log in again.", 404);
  }

  const oldFileId = user.avatar?.fileId || "";
  const ext = originalName.split(".").pop().toLowerCase();
  const fileName = `avatar-${user.username}.${ext}`;

  const { url, fileId } = await imageService.uploadImage(
    fileBuffer,
    fileName,
    "/SpellOutCode/avatars",
  );

  let updated;
  try {
    updated = await User.findOneAndUpdate(
      { _id: userId, "avatar.fileId": avatarFileIdFilter(oldFileId) },
      { $set: { avatar: { url, fileId } } },
      { new: true },
    );
  } catch (err) {
    await safeDeleteImage(fileId);
    throw err;
  }

  if (!updated) {
    await safeDeleteImage(fileId);
    throw new AppError(
      "Your avatar was changed by another request. Please try again.",
      409,
    );
  }

  await safeDeleteImage(oldFileId);

  return updated;
};

/**
 * remove avatar (protected route)
 */
const removeAvatar = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("We couldn't find your account. Please log in again.", 404);
  }

  const oldFileId = user.avatar?.fileId || "";

  const updated = await User.findOneAndUpdate(
    { _id: userId, "avatar.fileId": avatarFileIdFilter(oldFileId) },
    { $set: { avatar: { url: "", fileId: "" } } },
    { new: true },
  );

  if (!updated) {
    throw new AppError(
      "Your avatar was changed by another request. Please try again.",
      409,
    );
  }

  await safeDeleteImage(oldFileId);

  return updated;
};

const deleteAccount = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("We couldn't find your account. Please log in again.", 404);

  const projects = await Project.find({ author: userId }).select("_id coverImage");
  const projectIds = projects.map((p) => p._id);
  // Updates written by this user, plus anything left inside their projects.
  const updateFilter = { $or: [{ author: userId }, { project: { $in: projectIds } }] };
  const updates = await Update.find(updateFilter).select("coverImage");

  // Remove the account data first, then clean up stored images.
  await Update.deleteMany(updateFilter);
  await Project.deleteMany({ author: userId });
  await User.findByIdAndDelete(userId);

  await safeDeleteImage(user.avatar?.fileId);
  for (const update of updates) await safeDeleteImage(update.coverImage?.fileId);
  for (const project of projects) await safeDeleteImage(project.coverImage?.fileId);
};

module.exports = {
  getProfileByUsername,
  updateProfile,
  updateAvatar,
  removeAvatar,
  deleteAccount,
};
