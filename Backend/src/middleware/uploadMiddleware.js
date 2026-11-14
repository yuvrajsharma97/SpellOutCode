const multer = require("multer");
const AppError = require("../utils/appError");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif"];
const ALLOWED_EXTENSIONS = /\.(jpg|jpeg|png|gif)$/i;

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const mimeOk = ALLOWED_MIME_TYPES.includes(file.mimetype);
  const extOk = ALLOWED_EXTENSIONS.test(file.originalname);
  if (mimeOk && extOk) {
    cb(null, true);
  } else {
    cb(new AppError("Only JPEG, PNG, and GIF images are allowed.", 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  // Bound every part of the multipart body, not just the file: text fields
  // are buffered in memory too.
  limits: {
    fileSize: MAX_FILE_SIZE, // 5MB max
    files: 1,
    fields: 5,
    fieldSize: 1024,
    fieldNameSize: 100,
    parts: 6,
    headerPairs: 50,
  },
});

module.exports = upload;
