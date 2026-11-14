const crypto = require("crypto");
const User = require("../models/user");
const authService = require("../services/authServices");
const {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  changePasswordSchema,
  verifyEmailSchema,
  emailOnlySchema,
} = require("../validators/authValidator");
const { setAuthCookies, clearAuthCookies } = require("../utils/cookieHelpers");
const AppError = require("../utils/appError");

/**
 * POST /api/auth/register
 * Creates a pending sign-up and emails a verification link. The response is
 * the same whether or not the email already has an account.
 */
const register = async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return next(new AppError(parsed.error.issues[0].message, 400));
    }

    await authService.registerUser(parsed.data);

    res.status(202).json({
      success: true,
      message:
        "Check your inbox. If this email can be used, we've sent a link to verify it and activate your account.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/verify-email/:token
 * Checks a verification link and returns the username it would activate.
 */
const checkVerificationToken = async (req, res, next) => {
  try {
    const data = await authService.getPendingVerification(req.params.token);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/verify-email/:token   Body: { password }
 */
const verifyEmail = async (req, res, next) => {
  try {
    const parsed = verifyEmailSchema.safeParse(req.body);

    if (!parsed.success) {
      return next(new AppError(parsed.error.issues[0].message, 400));
    }

    const { user, accessToken, refreshToken } = await authService.verifyEmail(
      req.params.token,
      parsed.data.password,
    );

    setAuthCookies(res, accessToken, refreshToken);

    res.status(201).json({
      success: true,
      message: "Email verified. Welcome to Spell Out Code!",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/resend-verification   Body: { email }
 */
const resendVerification = async (req, res, next) => {
  try {
    const parsed = emailOnlySchema.safeParse(req.body);

    if (!parsed.success) {
      return next(new AppError(parsed.error.issues[0].message, 400));
    }

    await authService.resendVerification(parsed.data.email);

    res.status(200).json({
      success: true,
      message:
        "If a sign-up is waiting for this email, we've sent a new verification link.",
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return next(new AppError(parsed.error.issues[0].message, 400));
    }

    const { user, accessToken, refreshToken } = await authService.loginUser(
      parsed.data,
    );

    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logoutUser(req.cookies?.refreshToken);

    clearAuthCookies(res);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;

    const { user, accessToken, refreshToken } =
      await authService.rotateRefreshToken(incomingRefreshToken);

    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: "Tokens refreshed",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const parsed = emailOnlySchema.safeParse(req.body);

    if (!parsed.success) {
      return next(new AppError(parsed.error.issues[0].message, 400));
    }

    await authService.forgotPassword(parsed.data.email);

    res.status(200).json({
      success: true,
      message:
        "If an account exists, a reset link has been sent. Please check your email.",
    });
  } catch (error) {
    next(error);
  }
};

const verifyResetToken = async (req, res, next) => {
  try {
    if (typeof req.params.token !== "string" || !req.params.token) {
      return next(new AppError("Reset link is invalid or has expired.", 400));
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      return next(new AppError("Reset link is invalid or has expired.", 400));
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);

    if (!parsed.success) {
      return next(new AppError(parsed.error.issues[0].message, 400));
    }

    await authService.resetPassword(req.params.token, parsed.data.password);

    // Recovery revokes every session, including any on this browser.
    clearAuthCookies(res);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const parsed = changePasswordSchema.safeParse(req.body);

    if (!parsed.success) {
      return next(new AppError(parsed.error.issues[0].message, 400));
    }

    const { accessToken, refreshToken } = await authService.changePassword(
      req.user.id,
      parsed.data,
    );

    // Every other session was revoked; keep this one signed in.
    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
