const updateService = require("../services/updateServices");
const {
  createUpdateSchema,
  updateUpdateSchema,
} = require("../validators/updateValidator");
const AppError = require("../utils/appError");

/**
 * POST /api/updates
 * Body: { project, title, content, published }
 */
const createUpdate = async (req, res, next) => {
  try {
    const parsed = createUpdateSchema.safeParse({
      ...req.body,
      projectId: req.body.projectId,
    });
    if (!parsed.success) {
      return next(new AppError(parsed.error.errors[0].message, 400));
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
 * GET /api/updates/project/:projectId
 * Body: porjectId in URL params
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
 * GET /api/updates/:id
 * Body: updateId in URL params
 */
const getUpdateById = async (req, res, next) => {
  try {
    const update = await updateService.getUpdateById(req.params.id);

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
 * Body: updateId in URL params and update data in request body
 */
const editUpdate = async (req, res, next) => {
  try {
    const parsed = updateUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(parsed.error.errors[0].message, 400));
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
 * Body: updateId in URL params
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
  getUpdateById,
  editUpdate,
  deleteUpdate,
};
