const jwt = require("jsonwebtoken");
const User = require("../models/user");
const AppError = require("../utils/appError");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return next(new AppError("Not authenticated. Please log in.", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id).select(
      "+passwordChangedAt",
    );

    if (!currentUser) {
      return next(new AppError("User no longer exists.", 401));
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          "Password was recently changed. Please log in again.",
          401,
        ),
      );
    }

    req.user = { id: currentUser._id };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(
        new AppError("Session expired. Please refresh your token.", 401),
      );
    }
    return next(new AppError("Invalid token. Please log in again.", 401));
  }
};

module.exports = protect;
