const getResendClient = require("../config/email");

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

const sendEmail = async (to, subject, html) => {
  const resend = getResendClient();

  const { data, error } = await resend.emails.send({
    from: `Spell Out Code <${FROM_ADDRESS}>`,
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Email send failed: ${error.message}`);
  }

  return data;
};

module.exports = sendEmail;
