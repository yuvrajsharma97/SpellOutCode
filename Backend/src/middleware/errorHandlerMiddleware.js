const AppError = require("../utils/appError");

const FRIENDLY_DUPLICATE_FIELDS = {
  email: "This email is already registered.",
  username: "This username is already taken.",
};

const handleCastError = () =>
  new AppError("We couldn't find what you were looking for.", 404);

const handleDuplicateFields = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(
    FRIENDLY_DUPLICATE_FIELDS[field] || `This ${field} is already in use.`,
    409,
  );
};

const handleValidationError = (err) => {
  const [firstError] = Object.values(err.errors);
  return new AppError(firstError.message, 400);
};

const handleJWTExpired = () =>
  new AppError("Your session has expired. Please log in again.", 401);

const handleJWTInvalid = () =>
  new AppError("Your session isn't valid. Please log in again.", 401);

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
    message: "Something went wrong on our end. Please try again in a moment.",
  });
};

module.exports = errorHandler;
