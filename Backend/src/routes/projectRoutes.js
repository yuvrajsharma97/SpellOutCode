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

router.use(protect);
router.get("/mine", getMyProjects); 
router.post("/create-new-project", createProject); // was /create-new-project
router.patch("/:id", updateProject); // was /update/:id
router.delete("/:id", deleteProject);

module.exports = router;
