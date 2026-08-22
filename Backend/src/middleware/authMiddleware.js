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
      return next(
        new AppError("We couldn't find your account. Please log in again.", 401),
      );
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          "Your password was recently changed. Please log in again.",
          401,
        ),
      );
    }

    req.user = { id: currentUser._id };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(
        new AppError("Your session has expired. Please log in again.", 401),
      );
    }
    return next(
      new AppError("Your session isn't valid. Please log in again.", 401),
    );
  }
};

module.exports = protect;
