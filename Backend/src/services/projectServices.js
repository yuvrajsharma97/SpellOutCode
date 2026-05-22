const Update = require("../models/update");
const slugify = require("slugify");
const Project = require("../models/project");
const User = require("../models/user");
const AppError = require("../utils/appError");

// Generate a unique slug.
const generateUniqueSlug = async (title) => {
  const base = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = base;
  let exists = await Project.findOne({ slug });

  while (exists) {
    const suffix = Math.random().toString(36).slice(2, 7);
    slug = `${base}-${suffix}`;
    exists = await Project.findOne({ slug });
  }

  return slug;
};

/**
 * Create a new project with a unique slug and associate it with the author.
 */
const createProject = async (authorId, data) => {
  const slug = await generateUniqueSlug(data.title);

  const project = await Project.create({
    ...data,
    slug,
    author: authorId,
  });

  return project;
};

/**
 * Get all projects for a given user ID.
 */

const getProjectsByUser = async (userId) => {
  const user = await User.findOne({ _id: userId });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const projects = await Project.find({ author: user._id })
    .populate("author", "name username avatar roleTitle")
    .sort({ createdAt: -1 });

  return projects;
};

/**
 * Get all projects for a given username.
 */
const getProjectsByUsername = async (username) => {
  const user = await User.findOne({ username });
  if (!user) throw new AppError("User not found", 404);
  const projects = await Project.find({ author: user._id })
    .populate("author", "name username avatar roleTitle")
    .sort({ createdAt: -1 });
  return projects;
};

/**
 * Get single project by slug
 */
const getProjectBySlug = async (slug) => {
  const project = await Project.findOne({ slug }).populate(
    "author",
    "name username avatar roleTitle",
  );

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return project;
};

/**
 * Update a project with ownership check and slug regeneration if title changes.
 */
const updateProject = async (projectId, userId, data) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  // Ownership check — compare as strings since ObjectId !== ObjectId by reference
  if (project.author.toString() !== userId.toString()) {
    throw new AppError("You are not authorized to update this project", 403);
  }

  // Regenerate slug if title changed
  if (data.title && data.title !== project.title) {
    data.slug = await generateUniqueSlug(data.title);
  }

  const updated = await Project.findByIdAndUpdate(
    projectId,
    { $set: data },
    { new: true, runValidators: true },
  );

  return updated;
};

/**
 * Delete a project with ownership check.
 */
const deleteProject = async (projectId, userId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (project.author.toString() !== userId.toString()) {
    throw new AppError("You are not authorized to delete this project", 403);
  }

  await Update.deleteMany({ project: projectId });
  await Project.findByIdAndDelete(projectId);
};

module.exports = {
  createProject,
  getProjectsByUser,
  getProjectsByUsername,
  getProjectBySlug,
  updateProject,
  deleteProject,
};
