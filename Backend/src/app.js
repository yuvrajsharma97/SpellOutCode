const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const errorHandler = require("./middleware/errorHandlerMiddleware");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(helmet());
app.use(mongoSanitize());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api',limiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

/**
 * Routes
 */

// Test route
// app.get("/api/health", (req, res) => {
//   res.json({ status: "ok", message: "Server is running" });
// });

app.use("/api/auth", authRoutes);

// 404 Not Found handler
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Global error handling middleware
app.use(errorHandler);



module.exports = app;