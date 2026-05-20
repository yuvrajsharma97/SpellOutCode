const projectService = require("../services/projectServices");
const {
  createProjectSchema,
  updateProjectSchema,
} = require("../validators/projectValidator");
const AppError = require("../utils/appError");

/**
 * POST /api/projects/create-new-project
 */
const createProject = async (req, res, next) => {
  try {
    const parsed = createProjectSchema.safeParse(req.body);

    if (!parsed.success) {
      return next(new AppError(parsed.error.issues[0].message, 400));
    }

    const project = await projectService.createProject(
      req.user.id,
      parsed.data,
    );

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/projects/my-projects
 */
const getMyProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getProjectsByUser(req.user.id);

    res.status(200).json({
      success: true,
      data: { projects },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:username/projects
 */
const getProjectsByUsername = async (req, res, next) => {
  try {
    const projects = await projectService.getProjectsByUsername(
      req.params.username,
    );

    res.status(200).json({
      success: true,
      data: { projects },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:username/projects/:slug
 */
const getProjectBySlug = async (req, res, next) => {
  try {
    const project = await projectService.getProjectBySlug(req.params.slug);

    res.status(200).json({
      success: true,
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/projects/:id
 */
const updateProject = async (req, res, next) => {
  try {
    const parsed = updateProjectSchema.safeParse(req.body);

    if (!parsed.success) {
      return next(new AppError(parsed.error.issues[0].message, 400));
    }

    const project = await projectService.updateProject(
      req.params.id,
      req.user.id,
      parsed.data,
    );

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/projects/:id
 */
const deleteProject = async (req, res, next) => {
  try {
    await projectService.deleteProject(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getMyProjects,
  getProjectsByUsername,
  getProjectBySlug,
  updateProject,
  deleteProject,
};
