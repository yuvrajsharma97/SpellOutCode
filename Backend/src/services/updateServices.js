const Update = require("../models/update");
const Project = require("../models/project");
const AppError = require("../utils/appError");

const createUpdate = async (userId, payload) => {
  const project = await Project.findById(payload.project);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (project.author.toString() !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  const update = await Update.create({
    ...payload,
    author: userId,
  });

  return update;
};

const getUpdatesByProject = async (projectId, publishedOnly = true) => {
  const filter = {
    project: projectId,
  };

  if (publishedOnly) {
    filter.published = true;
  }

  return await Update.find(filter)
    .populate("author", "name username avatar")
    .sort({
      createdAt: -1,
    });
};

const getUpdateById = async (id, publishedOnly = true) => {
  const filter = { _id: id };
  if (publishedOnly) filter.published = true;

  const update = await Update.findOne(filter).populate(
    "author",
    "name username avatar",
  );

  if (!update) {
    throw new AppError("Update not found", 404);
  }

  return update;
};

const editUpdate = async (id, userId, payload) => {
  const update = await Update.findById(id);

  if (!update) {
    throw new AppError("Update not found", 404);
  }

  if (update.author.toString() !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  Object.assign(update, payload);

  await update.save();

  return update;
};

const deleteUpdate = async (id, userId) => {
  const update = await Update.findById(id);

  if (!update) {
    throw new AppError("Update not found", 404);
  }

  if (update.author.toString() !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  await update.deleteOne();
};

module.exports = {
  createUpdate,
  getUpdatesByProject,
  getUpdateById,
  editUpdate,
  deleteUpdate,
};
