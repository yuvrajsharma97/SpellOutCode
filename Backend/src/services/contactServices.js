const sendEmail = require("../utils/sendEmail");

const registrationSuccessEmailTemplate = async(userEmail, name) => {
    const subject = "Welcome to Spell Out Code!";

    const text = `Welcome to Spell Out Code, ${name}! 
                    Thank you for registering on our platform. We're excited to have you on board! 
                        Here are some tips to get you started: 
                        1. Complete Your Profile: Add a profile picture and a bio to let others know more about you. 
                        2. Create Projects: Start your own projects and share them with the community. 
                        3. Explain What and Why: When creating projects, explain the purpose and the reasoning behind your decisions. 
                        4. Build and Share: Develop and share the logic behind your projects to help others learn and get inspired by your work. 
                    If you have any questions or need assistance, feel free to reach out to our support team. 
                Happy Documenting!`;
    
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Welcome to Spell Out Code, ${name}!</h1>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin-top: 20px;">  
        <p>Thank you for registering on our platform. We're excited to have you on board!</p>
        <p>Here are some tips to get you started:</p>
            <ul>
                <li><strong>Complete Your Profile:</strong> Add a profile picture and a bio to let others know more about you.</li>
                <li><strong>Create Projects:</strong> Start your own projects and share them with the community.</li>
                <li><strong>Explain What and Why:</strong> When creating projects, explain the purpose and the reasoning behind your decisions.</li>
                <li><strong>Build and Share:</strong> Develop and share the logic behind your projects to help others learn and get inspired by your work.</li>
            </ul>
    </div>
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 20px;">
        <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
        <p>Happy Documenting!</p>
    </div>
    </div>
    `;
    
    await sendEmail(userEmail, subject, text, html);
};

const sendContactEmail = async ({ to, senderName, senderEmail, message, projectSlug, authorName }) => {
    const subject = ` ${authorName}, You have a new message on your project ${projectSlug}`;
    const text = `You have received a new message from the contact form on your project ${projectSlug}, on your Spell Out Code website profile.
    \n\nName: ${senderName}\nEmail: ${senderEmail}\nMessage: ${message}`;
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>You have a new message on your project ${projectSlug}</h1>
            <p>You have received a new message from the contact form on your project ${projectSlug}, on your <strong>Spell Out Code</strong> website profile.</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 20px;">
            <p><strong>Name:</strong> ${senderName}</p>
            <p><strong>Email:</strong> ${senderEmail}</p>
        </div>

        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin-top: 20px;">
            <p><strong>Message:</strong> ${message}</p>
        </div>
        <p style="margin-top: 20px;">Please respond to the sender's email at your earliest convenience, at ${senderEmail}</p>
    </div>
    `;
    await sendEmail(to, subject, text, html);
};

const sendPasswordResetEmail = async (userEmail, userName, resetLink) => {
    const subject = "Password Reset Request";
    const text = `Hello ${userName}, You have requested a password reset. Click the link below to reset your password: ${resetLink}`;
    const html = `
      <h1>Password Reset Request</h1>
      <p>Hello ${userName}, <br/>You have requested a password reset. Click the link below to reset your password:</p><br/>
      <a href="${resetLink}">Reset Password</a>
    `;
    await sendEmail(userEmail, subject, text, html);
};

module.exports = {
    registrationSuccessEmailTemplate,
    sendPasswordResetEmail,
    sendContactEmail
};

