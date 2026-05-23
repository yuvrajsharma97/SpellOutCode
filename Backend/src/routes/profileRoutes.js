const { Router } = require("express");
const {
  getProfile,
  updateProfile,
  updateAvatar,
  removeAvatar,
} = require("../controllers/profileController");
const {
  getProjectsByUsername,
  getProjectBySlug,
} = require("../controllers/projectController");
const {
  getUpdatesBySlug,
  getUpdateBySlugAndId,
} = require("../controllers/updateController");
const protect  = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = Router();

// Public Route
router.get("/:username", getProfile);
router.get("/:username/projects", getProjectsByUsername);
router.get("/:username/projects/:slug", getProjectBySlug);
router.get("/:username/projects/:slug/updates", getUpdatesBySlug);
router.get("/:username/projects/:slug/updates/:updateId", getUpdateBySlugAndId);

router.use(protect);

//Protected  Routes
router.patch("/me/updateProfile", updateProfile);
router.post("/me/avatar", upload.single("avatar"), updateAvatar);
router.delete("/me/avatar", removeAvatar);

module.exports = router;
