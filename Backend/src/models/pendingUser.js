const mongoose = require("mongoose");

/**
 * A sign-up that has not been confirmed by email yet.
 *
 * Kept outside the users collection on purpose: an email address is only
 * bound to an account once its owner clicks the verification link AND
 * re-enters the password chosen at sign-up. Several pending sign-ups for
 * the same address can coexist, so nobody can squat an address by
 * registering it first, and a link only activates the sign-up that
 * produced it.
 */
const pendingUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    username: { type: String, required: true, lowercase: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    tokenHash: { type: String, required: true, unique: true },
    lastSentAt: { type: Date, required: true },
    failedAttempts: { type: Number, default: 0 },
    // MongoDB's TTL monitor removes the document once this time passes.
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PendingUser", pendingUserSchema);
