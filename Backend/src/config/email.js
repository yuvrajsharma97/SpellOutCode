const { Resend } = require("resend");

let resend;

/**
 * Lazily construct the Resend client so a missing RESEND_API_KEY only
 * breaks email sending, not the entire server at startup.
 */
const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error(
      "RESEND_API_KEY is not set. Add it to Backend/.env to send emails.",
    );
  }

  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }

  return resend;
};

module.exports = getResendClient;
