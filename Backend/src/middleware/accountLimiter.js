const crypto = require("crypto");
const rateLimit = require("express-rate-limit");

/**
 * Per-account limits. IP-based limits stop a single machine, but an attacker
 * with many IPs (botnet, rotating proxies) can spread guesses across them.
 * These limits key on the targeted email instead, so the number of guesses
 * against one account is capped no matter how many IPs are used.
 *
 * Unknown and existing emails are limited identically, so the limiter does
 * not reveal which emails have accounts.
 */
const emailKey = (prefix) => (req) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const hash = crypto.createHash("sha256").update(email).digest("hex");
  return `${prefix}:${hash}`;
};

// Failed logins per account. Successful logins are not counted, so the real
// owner signing in normally is unaffected. Kept moderately generous because
// anyone can push an account to the limit and block its owner from signing
// in for the rest of the window.
const loginAccountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: emailKey("login"),
  message: {
    success: false,
    message:
      "Too many failed sign-in attempts for this account. Please wait 15 minutes or reset your password.",
  },
});

module.exports = { loginAccountLimiter };
