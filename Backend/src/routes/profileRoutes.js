const { Router } = require("express");
const {
  getProfile,
  updateProfile,
  updateAvatar,
} = require("../controllers/profileController");
const protect  = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = Router();

// Public Route
router.get("/:username", getProfile);

router.use(protect);

//Protected  Routes
router.patch("/me/updateProfile", updateProfile);  
router.post("/me/avatar", upload.single("avatar"), updateAvatar);

module.exports = router;
