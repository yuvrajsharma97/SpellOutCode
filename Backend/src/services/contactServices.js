const sendEmail = require("../utils/sendEmail");

const registrationSuccessEmailTemplate = async (userEmail, name) => {
  const subject = "Welcome to Spell Out Code!";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Welcome to Spell Out Code, ${name}!</h1>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin-top: 20px;">
        <p>Thank you for registering. We're excited to have you on board!</p>
        <p>Here are some tips to get you started:</p>
        <ul>
          <li><strong>Complete Your Profile:</strong> Add a profile picture and a bio.</li>
          <li><strong>Create Projects:</strong> Start your own projects and share them with the community.</li>
          <li><strong>Explain What and Why:</strong> Document the purpose and reasoning behind your decisions.</li>
          <li><strong>Build and Share:</strong> Help others learn and get inspired by your work.</li>
        </ul>
      </div>
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 20px;">
        <p>Happy Documenting!</p>
      </div>
    </div>
  `;
  await sendEmail(userEmail, subject, html);
};

const sendContactEmail = async ({ to, senderName, senderEmail, message, projectSlug, authorName }) => {
  const subject = `${authorName}, you have a new message on ${projectSlug}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>New message on your project ${projectSlug}</h1>
      <p>You received a message via your <strong>Spell Out Code</strong> profile.</p>
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 20px;">
        <p><strong>Name:</strong> ${senderName}</p>
        <p><strong>Email:</strong> ${senderEmail}</p>
      </div>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin-top: 20px;">
        <p><strong>Message:</strong> ${message}</p>
      </div>
      <p style="margin-top: 20px;">Reply to the sender at ${senderEmail}</p>
    </div>
  `;
  await sendEmail(to, subject, html);
};

const sendPasswordResetEmail = async (userEmail, userName, resetLink) => {
  const subject = "Password Reset Request";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Password Reset Request</h1>
      <p>Hello ${userName},</p>
      <p>You requested a password reset. Click the button below — the link expires in 10 minutes.</p>
      <div style="margin: 32px 0;">
        <a href="${resetLink}"
           style="background-color: #2563a8; color: #fff; padding: 12px 24px;
                  text-decoration: none; border-radius: 4px; font-family: monospace; font-size: 14px;">
          Reset Password
        </a>
      </div>
      <p style="color: #888; font-size: 12px;">If you didn't request this, ignore this email.</p>
    </div>
  `;
  await sendEmail(userEmail, subject, html);
};

module.exports = {
  registrationSuccessEmailTemplate,
  sendPasswordResetEmail,
  sendContactEmail,
};
