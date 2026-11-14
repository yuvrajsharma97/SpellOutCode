const { Router } = require("express");
const rateLimit = require("express-rate-limit");
const {
  getProfile,
  updateProfile,
  updateAvatar,
  removeAvatar,
  deleteAccount,
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

// Each avatar change uploads to or deletes from paid ImageKit storage:
// at most 10 per account per 15 minutes, whatever the IP.
const avatarLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `user:${req.user.id.toString()}`,
  message: {
    success: false,
    message: "Too many avatar changes. Please try again in a few minutes.",
  },
});

//Protected  Routes
router.patch("/me/updateProfile", updateProfile);
router.post("/me/avatar", avatarLimiter, upload.single("avatar"), updateAvatar);
router.delete("/me/avatar", avatarLimiter, removeAvatar);
router.delete("/me", deleteAccount);

module.exports = router;
