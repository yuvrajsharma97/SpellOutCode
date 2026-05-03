const AppError = require("../utils/appError");

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFields = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const message = `${field} already exists. Please use a different value.`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTExpired = () =>
  new AppError("Your session has expired. Please log in again.", 401);

const handleJWTInvalid = () =>
  new AppError("Invalid token. Please log in again.", 401);

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err, message: err.message };

  if (error.name === "CastError") error = handleCastError(error);
  if (error.code === 11000) error = handleDuplicateFields(error);
  if (error.name === "ValidationError") error = handleValidationError(error);
  if (error.name === "TokenExpiredError") error = handleJWTExpired();
  if (error.name === "JsonWebTokenError") error = handleJWTInvalid();

  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }

  console.error("UNEXPECTED ERROR:", err);
  return res.status(500).json({
    status: "error",
    message: "Something went wrong. Please try again later.",
  });
};

module.exports = errorHandler;
