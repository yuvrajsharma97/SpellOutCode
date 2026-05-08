const { Router } = require("express");
const {
  getProfile,
  updateProfile,
  updateAvatar,
} = require("../controllers/profileController");
const protect  = require("../middleware/authMiddleware");
console.log("protect TYPE:", typeof protect);
const upload = require("../middleware/uploadMiddleware");

const router = Router();

// Public Route
router.get("/getProfile/:userId", getProfile);

router.use(protect);

//Protected  Routes
router.patch("/updateProfile", updateProfile);
router.patch("/avatarUpload", upload.single("avatar"), updateAvatar);

module.exports = router;
