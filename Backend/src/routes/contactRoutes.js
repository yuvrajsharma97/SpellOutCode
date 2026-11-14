const Express = require("express");
const rateLimit = require("express-rate-limit");
const { sendEmailToAuthor } = require("../controllers/contactController");
const router = Express.Router();

/**
 * The contact form is unauthenticated and every accepted request sends a
 * paid email, so it gets its own budgets on top of the global /api limiter:
 *  - per sender IP: 5 messages per hour
 *  - per recipient project: 20 messages per day, whatever the sender's IP
 *    (bounds inbox flooding and shared email-quota exhaustion)
 */
const limitMessage = {
  success: false,
  message: "Too many messages. Please try again later.",
};

const contactIpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: limitMessage,
});

const contactRecipientLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `project:${String(req.params.projectId)}`,
  message: limitMessage,
});

router.post(
  "/contactProjectAuthor/:projectId",
  contactIpLimiter,
  contactRecipientLimiter,
  sendEmailToAuthor,
);

module.exports = router;
