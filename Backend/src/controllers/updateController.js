const updateService = require("../services/updateServices");
const Project = require("../models/project");
const {
  createUpdateSchema,
  updateUpdateSchema,
} = require("../validators/updateValidator");
const { parsePagination } = require("../utils/pagination");
const AppError = require("../utils/appError");

/**
 * POST /api/projects/:projectId/updates
 */
const createUpdate = async (req, res, next) => {
  try {
    const parsed = createUpdateSchema.safeParse({
      ...req.body,
      project: req.params.projectId,
    });

    if (!parsed.success) {
      return next(new AppError(parsed.error.issues[0].message, 400));
    }

    const update = await updateService.createUpdate(req.user.id, parsed.data);

    res.status(201).json({
      success: true,
      message: "Update created successfully",
      data: { update },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/projects/:projectId/updates  (public, published only)
 */
const getUpdatesByProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return next(new AppError("This project could not be found.", 404));
    }

    const { updates, pagination } = await updateService.getUpdatesByProject(
      project,
      { pagination: parsePagination(req.query) },
    );

    res.status(200).json({
      success: true,
      data: { updates, pagination },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:username/projects/:slug/updates  (public, published only)
 */
const getUpdatesBySlug = async (req, res, next) => {
  try {
    const project = await updateService.findPublicProject(
      req.params.username,
      req.params.slug,
    );

    const { updates, pagination } = await updateService.getUpdatesByProject(
      project,
      { pagination: parsePagination(req.query) },
    );

    res.status(200).json({
      success: true,
      data: { updates, pagination },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/projects/:projectId/my-updates  (protected: project owner only,
 * includes drafts)
 */
const getMyUpdatesByProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    // Same response for "missing" and "not yours", so other users' project
    // ids reveal nothing.
    if (!project || project.author.toString() !== req.user.id.toString()) {
      return next(new AppError("This project could not be found.", 404));
    }

    const { updates, pagination } = await updateService.getUpdatesByProject(
      project,
      {
        publishedOnly: false,
        includeContent: true,
        pagination: parsePagination(req.query),
      },
    );

    res.status(200).json({
      success: true,
      data: { updates, pagination },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:username/projects/:slug/updates/:updateId  (public)
 */
const getUpdateBySlugAndId = async (req, res, next) => {
  try {
    const update = await updateService.getPublicUpdate(
      req.params.username,
      req.params.slug,
      req.params.updateId,
    );

    res.status(200).json({
      success: true,
      data: { update },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/updates/:id
 */
const editUpdate = async (req, res, next) => {
  try {
    const parsed = updateUpdateSchema.safeParse(req.body);

    if (!parsed.success) {
      return next(new AppError(parsed.error.issues[0].message, 400));
    }

    const update = await updateService.editUpdate(
      req.params.id,
      req.user.id,
      parsed.data,
    );

    res.status(200).json({
      success: true,
      message: "Update edited successfully",
      data: { update },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/updates/:id
 */
const deleteUpdate = async (req, res, next) => {
  try {
    await updateService.deleteUpdate(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Update deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUpdate,
  getUpdatesByProject,
  getMyUpdatesByProject,
  getUpdatesBySlug,
  getUpdateBySlugAndId,
  editUpdate,
  deleteUpdate,
};
