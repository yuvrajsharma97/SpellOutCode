const { Router } = require("express");
const {
  createProject,
  getProjectsByUser,
  getProjectBySlug,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const protect = require("../middleware/authMiddleware");

const router = Router();

// Non-protected routes 
router.get("/user/:userId", getProjectsByUser);
router.get("/slug/:slug", getProjectBySlug);

router.use(protect);

// Protected routes 
router.post("/create-new-project", createProject);
router.patch("/update/:id", updateProject);
router.delete("/delete/:id", deleteProject);

module.exports = router;
