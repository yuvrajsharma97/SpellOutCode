const authService = require("../services/authServices");
const { registerSchema, loginSchema } = require("../validators/authValidator");
const { forgotPasswordSchema } = require("../validators/contactValidator");
const { setAuthCookies, clearAuthCookies } = require("../utils/cookieHelpers");
const AppError = require("../utils/appError");

const register = async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return next(new AppError(parsed.error.issues[0].message, 400));
    }

    const { user, accessToken, refreshToken } = await authService.registerUser(
      parsed.data,
    );

    await setAuthCookies(res, accessToken, refreshToken);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: { user },
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

    await setAuthCookies(res, accessToken, refreshToken);

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
    await authService.logoutUser(req.user.id);
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

    const { user, accessToken, refreshToken } = await authService.rotateRefreshToken(incomingRefreshToken);

    await setAuthCookies(res, accessToken, refreshToken);

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
    const parsed = forgotPasswordSchema.safeParse(req.body);

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

const resetPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    const { password } = req.body;

    await authService.resetPassword(token, password);

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
    await authService.changePassword(req.user.id, req.body);

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
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
  getMe,
  changePassword,
};
