const AppError = require("../utils/appError");

const handleCastError = (err) => new AppError(`Invalid ${err.path}`, 400);

const handleDuplicateFields = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(`${field} already exists`, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  return new AppError(errors.join(", "), 400);
};

const handleJWTExpired = () =>
  new AppError("Session expired. Please log in again.", 401);

const handleJWTInvalid = () =>
  new AppError("Invalid authentication token.", 401);

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (err.name === "CastError") error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateFields(err);
  if (err.name === "ValidationError") error = handleValidationError(err);
  if (err.name === "TokenExpiredError") error = handleJWTExpired();
  if (err.name === "JsonWebTokenError") error = handleJWTInvalid();

  const statusCode = error.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }

  if (error.isOperational) {
    return res.status(statusCode).json({
      success: false,
      message: error.message,
      ...(process.env.NODE_ENV === "development" && {
        stack: error.stack,
      }),
    });
  }

  return res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
};

module.exports = errorHandler;
