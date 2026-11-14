const AppError = require("../utils/appError");

// The email message stays generic so a duplicate-key race cannot be used
// to check whether an address has an account.
const FRIENDLY_DUPLICATE_FIELDS = {
  email: "This email can't be used. Please try another or sign in.",
  username: "This username is already taken.",
};

const MULTER_MESSAGES = {
  LIMIT_FILE_SIZE: ["Images must be 5MB or smaller.", 413],
  LIMIT_FILE_COUNT: ["Upload one image at a time.", 400],
  LIMIT_UNEXPECTED_FILE: ["Unexpected file field.", 400],
};

const handleMulterError = (err) => {
  const [message, status] = MULTER_MESSAGES[err.code] || [
    "The upload was too large or malformed.",
    400,
  ];
  return new AppError(message, status);
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

  if (err.name === "MulterError") error = handleMulterError(err);
  // body-parser errors carry a type; without this they surface as 500s.
  if (err.type === "entity.too.large")
    error = new AppError("That request is too large.", 413);
  if (err.type === "entity.parse.failed")
    error = new AppError("The request body isn't valid JSON.", 400);
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
