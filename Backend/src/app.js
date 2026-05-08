const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const errorHandler = require("./middleware/errorHandlerMiddleware");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const updateRoutes = require("./routes/updateRoutes");
const profileRoutes = require("./routes/profileRoutes");
const AppError = require('./utils/appError');

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));

app.use(express.urlencoded({ extended: true }));

/**
 app.use(
  mongoSanitize({
    replaceWith: "_",
  }),
);
*/

app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

/**
 * Routes
 */

// Test route
// app.get("/api/health", (req, res) => {
//   res.json({ success: true, message: "Server is running" });
// });

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/updates", updateRoutes);
app.use("/api/profile", profileRoutes);

// 404 Not Found handler
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Global error handling middleware
app.use(errorHandler);



module.exports = app;