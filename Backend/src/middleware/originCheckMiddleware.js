const AppError = require("../utils/appError");

/**
 * CSRF defence for cookie-authenticated, state-changing requests.
 *
 * Production cookies must be SameSite=None because the SPA and the API run
 * on different sites, so the browser attaches them to cross-site requests.
 * Every non-safe request must therefore come from the configured client
 * origin. Browsers always send Origin on cross-origin POST/PATCH/PUT/DELETE
 * and an attacker page cannot forge it. Referer is a fallback for the rare
 * same-origin case where Origin is omitted.
 */
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

const originCheck = (req, res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();

  const allowedOrigin = (process.env.CLIENT_URL || "").replace(/\/$/, "");

  let requestOrigin = req.get("origin");
  if (!requestOrigin) {
    const referer = req.get("referer");
    if (referer) {
      try {
        requestOrigin = new URL(referer).origin;
      } catch {
        requestOrigin = undefined;
      }
    }
  }

  if (allowedOrigin && requestOrigin === allowedOrigin) return next();

  return next(
    new AppError(
      "This request wasn't allowed. Please reload the page and try again.",
      403,
    ),
  );
};

module.exports = originCheck;
