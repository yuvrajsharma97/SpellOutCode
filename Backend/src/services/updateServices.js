const Update = require("../models/update");
const Project = require("../models/project");
const AppError = require("../utils/appError");

// ── Create update ─────────────────────────────────────────────────────────────
const createUpdate = async (userId, data) => {
  const project = await Project.findById(data.project);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (project.author.toString() !== userId.toString()) {
    throw new AppError(
      "You are not authorized to add updates to this project",
      403,
    );
  }

  const update = await Update.create({
    ...data,
    author: userId,
  });

  return update;
};

// ── Get all published updates for a project ───────────────────────────────────
const getUpdatesByProject = async (projectId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const updates = await Update.find({ project: projectId, published: true })
    .populate("author", "name username avatar")
    .sort({ createdAt: -1 });

  return updates;
};

// ── Get single published update by ID ─────────────────────────────────────────
const getUpdateById = async (updateId) => {
  const update = await Update.findOne({
    _id: updateId,
    published: true,
  }).populate("author", "name username avatar");

  if (!update) {
    throw new AppError("Update not found", 404);
  }

  return update;
};

// ── Edit an update ────────────────────────────────────────────────────────────
const editUpdate = async (updateId, userId, data) => {
  const update = await Update.findById(updateId);

  if (!update) {
    throw new AppError("Update not found", 404);
  }

  if (update.author.toString() !== userId.toString()) {
    throw new AppError("You are not authorized to edit this update", 403);
  }

  const updated = await Update.findByIdAndUpdate(
    updateId,
    { $set: data },
    { new: true, runValidators: true },
  );

  return updated;
};

// ── Delete an update ──────────────────────────────────────────────────────────
const deleteUpdate = async (updateId, userId) => {
  const update = await Update.findById(updateId);

  if (!update) {
    throw new AppError("Update not found", 404);
  }

  if (update.author.toString() !== userId.toString()) {
    throw new AppError("You are not authorized to delete this update", 403);
  }

  await Update.findByIdAndDelete(updateId);
};

module.exports = {
  createUpdate,
  getUpdatesByProject,
  getUpdateById,
  editUpdate,
  deleteUpdate,
};
