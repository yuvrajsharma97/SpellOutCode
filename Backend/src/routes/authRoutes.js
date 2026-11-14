const express = require("express");
const router = express.Router();

const {
  register,
  checkVerificationToken,
  verifyEmail,
  resendVerification,
  login,
  logout,
  refresh,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  getMe,
  changePassword,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const { loginAccountLimiter } = require("../middleware/accountLimiter");

router.post("/register", register);
router.get("/verify-email/:token", checkVerificationToken);
router.post("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/login", loginAccountLimiter, login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.post("/forgot-password", forgotPassword);
router.get("/verify-reset-token/:token", verifyResetToken);
router.post("/reset-password/:token", resetPassword);
router.get("/me", protect, getMe);
router.patch("/change-password", protect, changePassword);

module.exports = router;
