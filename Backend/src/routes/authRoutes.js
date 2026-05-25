const express = require("express");
const router = express.Router();

const {
  register,
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


router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.post("/forgot-password", forgotPassword);
router.get("/verify-reset-token/:token", verifyResetToken);
router.post("/reset-password/:token", resetPassword);  
router.get("/me", protect, getMe);                     
router.patch("/change-password", protect, changePassword); 


module.exports = router;