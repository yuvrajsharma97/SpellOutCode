const { Router } = require("express");
const {
  createProject,
  getProjectsByUser,
  getProjectBySlug,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const {
  getUpdatesByProject,
  createUpdate,
} = require("../controllers/updateController");
const { sendEmailToAuthor } = require("../controllers/contactController");
const protect = require("../middleware/authMiddleware");

const router = Router();


router.get("/:projectId/updates", getUpdatesByProject);
router.post("/:username/contact", sendEmailToAuthor);

router.use(protect);
router.get("/my-projects", getMyProjects); 
router.post("/create-new-project", createProject); 
router.post("/:projectId/updates", protect, createUpdate);
router.patch("/:id", updateProject); 
router.delete("/:id", deleteProject);

module.exports = router;
