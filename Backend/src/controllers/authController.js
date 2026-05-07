const authService = require("../services/authServices");
const { registerSchema, loginSchema } = require("../validators/authValidator");
const { setAuthCookies, clearAuthCookies } = require("../utils/cookieHelpers");
const AppError = require("../utils/appError");

/**
 * POST /api/auth/register
 * Body: { name, username, email, password }
 */

const register = async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(parsed.error.issues[0].message, 400));
    }

    const user = await authService.registerUser(parsed.data);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 */

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

/**
 * POST /api/auth/logout
 * Body: none
 */

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

/**
 * POST /api/auth/refresh
 * Body: none
 */
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

module.exports = { register, login, logout, refresh };
