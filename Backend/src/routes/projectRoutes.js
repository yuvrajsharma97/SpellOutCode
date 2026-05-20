const { Router } = require("express");

const {
  createProject,
  getMyProjects,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const {
  getUpdatesByProject,
  createUpdate,
} = require("../controllers/updateController");

const protect = require("../middleware/authMiddleware");

const router = Router();

router.use(protect);

router.get("/my-projects", getMyProjects);
router.post("/create-new-project", createProject);

router.get("/:projectId/updates", getUpdatesByProject);
router.post("/:projectId/updates", createUpdate);

router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
