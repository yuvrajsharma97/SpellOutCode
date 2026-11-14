const Update = require("../models/update");
const Project = require("../models/project");
const User = require("../models/user");
const AppError = require("../utils/appError");
const { paginationMeta } = require("../utils/pagination");

// Upper bound on how many updates one project can hold.
const MAX_UPDATES_PER_PROJECT = 500;

// Fields an update edit may change. `project` and `author` are never editable.
const EDITABLE_FIELDS = ["title", "summary", "content", "tags", "published"];

const notFound = () => new AppError("This update could not be found.", 404);

const createUpdate = async (userId, payload) => {
  const project = await Project.findById(payload.project);

  if (!project) {
    throw new AppError("This project could not be found.", 404);
  }

  if (project.author.toString() !== userId.toString()) {
    throw new AppError("You don't have permission to do that.", 403);
  }

  const count = await Update.countDocuments({ project: project._id });
  if (count >= MAX_UPDATES_PER_PROJECT) {
    throw new AppError(
      `A project can have at most ${MAX_UPDATES_PER_PROJECT} updates.`,
      400,
    );
  }

  const update = await Update.create({
    ...payload,
    project: project._id,
    author: userId,
  });

  return update;
};

/**
 * List a project's updates.
 *  - Public callers get published updates only, without the full `content`
 *    (list views show title and summary).
 *  - Only updates written by the project's owner are listed, so stray
 *    records can never show up on someone else's timeline.
 */
const getUpdatesByProject = async (
  project,
  { publishedOnly = true, includeContent = false, pagination },
) => {
  const filter = { project: project._id, author: project.author };
  if (publishedOnly) filter.published = true;

  const query = Update.find(filter)
    .populate("author", "name username avatar")
    .sort({ createdAt: -1 })
    .skip(pagination.skip)
    .limit(pagination.limit);

  if (!includeContent) query.select("-content");

  const [updates, total] = await Promise.all([
    query,
    Update.countDocuments(filter),
  ]);

  return { updates, pagination: paginationMeta(pagination, total) };
};

/**
 * Resolve the project for a public URL /:username/projects/:slug. The slug
 * must belong to that username, so a URL can never show one user's project
 * under another user's name.
 */
const findPublicProject = async (username, slug) => {
  const user = await User.findOne({ username }).select("_id");
  if (!user) throw new AppError("This project could not be found.", 404);

  const project = await Project.findOne({ slug, author: user._id });
  if (!project) throw new AppError("This project could not be found.", 404);

  return project;
};

/**
 * Single published update for a public URL. The update must belong to the
 * project named by :slug, which must belong to :username.
 */
const getPublicUpdate = async (username, slug, updateId) => {
  const project = await findPublicProject(username, slug);

  const update = await Update.findOne({
    _id: updateId,
    project: project._id,
    author: project.author,
    published: true,
  }).populate("author", "name username avatar");

  if (!update) throw notFound();

  return update;
};

const editUpdate = async (id, userId, payload) => {
  const update = await Update.findById(id);

  if (!update) throw notFound();

  if (update.author.toString() !== userId.toString()) {
    throw new AppError("You don't have permission to do that.", 403);
  }

  for (const field of EDITABLE_FIELDS) {
    if (payload[field] !== undefined) update[field] = payload[field];
  }

  await update.save();

  return update;
};

const deleteUpdate = async (id, userId) => {
  const update = await Update.findById(id);

  if (!update) throw notFound();

  if (update.author.toString() !== userId.toString()) {
    throw new AppError("You don't have permission to do that.", 403);
  }

  await update.deleteOne();
};

module.exports = {
  createUpdate,
  getUpdatesByProject,
  findPublicProject,
  getPublicUpdate,
  editUpdate,
  deleteUpdate,
};
