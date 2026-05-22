const updateService = require("../services/updateServices");
const Project = require("../models/project");
const {
  createUpdateSchema,
  updateUpdateSchema,
} = require("../validators/updateValidator");
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
 * GET /api/projects/:projectId/updates  (public — published only)
 */
const getUpdatesByProject = async (req, res, next) => {
  try {
    const updates = await updateService.getUpdatesByProject(
      req.params.projectId,
    );

    res.status(200).json({
      success: true,
      data: { updates },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET public updates by project slug
 */
const getUpdatesBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });

    if (!project) {
      return next(new AppError("Project not found", 404));
    }

    const updates = await updateService.getUpdatesByProject(project._id);

    res.status(200).json({
      success: true,
      data: { updates },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/projects/:projectId/my-updates  (protected — all updates, owner only)
 */
const getMyUpdatesByProject = async (req, res, next) => {
  try {
    const updates = await updateService.getUpdatesByProject(
      req.params.projectId,
      false,
    );

    res.status(200).json({
      success: true,
      data: { updates },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET single public update by slug + id
 */
const getUpdateBySlugAndId = async (req, res, next) => {
  try {
    const update = await updateService.getUpdateById(req.params.updateId);

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
