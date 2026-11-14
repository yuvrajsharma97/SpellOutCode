const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./middleware/errorHandlerMiddleware");
const originCheck = require("./middleware/originCheckMiddleware");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const updateRoutes = require("./routes/updateRoutes");
const profileRoutes = require("./routes/profileRoutes");
const contactRoutes = require("./routes/contactRoutes");
const AppError = require("./utils/appError");

const app = express();

// How many proxies sit in front of the app. req.ip (used by every rate
// limiter) is read from X-Forwarded-For only for this many hops; trusting
// more hops than really exist lets clients fake their IP.
//   Render: 1 (its load balancer). Render sets RENDER=true automatically.
//   Local / no proxy: 0. Override with TRUST_PROXY_HOPS if the setup changes
//   (e.g. Cloudflare in front of Render -> 2).
const trustProxyHops =
  process.env.TRUST_PROXY_HOPS !== undefined
    ? Number(process.env.TRUST_PROXY_HOPS)
    : process.env.RENDER
      ? 1
      : 0;
app.set("trust proxy", trustProxyHops);

app.use(helmet());

app.use(
  cors({
    origin: (process.env.CLIENT_URL || "").replace(/\/$/, ""),
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

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again in 15 minutes.",
  },
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);
app.use("/api/auth/reset-password", authLimiter);
app.use("/api/auth/verify-email", authLimiter);
app.use("/api/auth/resend-verification", authLimiter);

// CSRF: state-changing requests must come from the configured client origin.
app.use("/api", originCheck);

// Update content may be up to 50,000 characters (validators/updateValidator),
// so the body limit must allow that plus JSON escaping.
app.use(express.json({ limit: "150kb" }));

// No urlencoded parser: this is a JSON API, and accepting form posts is
// what lets a plain cross-site <form> submit authenticated requests.

// express-mongo-sanitize v2.2.0 is incompatible with Express 5 (req.query is
// read-only). Query inputs are zod-parsed, and auth cookies are type-checked
// as strings before any lookup, because cookie-parser decodes "j:{...}"
// cookies into objects.

app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/**
 * Routes
 */

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/updates", updateRoutes);
app.use("/api/users", profileRoutes);
app.use("/api/contact", contactRoutes);

// 404 Not Found handler
app.use((req, res, next) => {
  next(new AppError("We couldn't find what you were looking for.", 404));
});

// Global error handling middleware
app.use(errorHandler);

module.exports = app;
