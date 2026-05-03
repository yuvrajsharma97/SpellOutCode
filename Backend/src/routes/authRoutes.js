const express = require("express");
const router = express.Router();

const {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  updateAvatar,
  updateProfile,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");


router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

// All routes below this line require authentication
router.use(protect); 

router.post("/logout", logout);
router.get("/me", getMe);
router.patch("/update-profile", updateProfile);
router.patch("/update-avatar", upload.single("avatar"), updateAvatar);

module.exports = router;
