const User = require("../models/user");
const AppError = require("../utils/appError");
const { contactSchema } = require("../validators/contactValidator");
const { sendContactEmail } = require("../services/contactServices");

const sendEmailToAuthor = async (req, res, next) => {
  try {
    const parsed = contactSchema.safeParse(req.body);

    if (!parsed.success) {
      return next(new AppError(parsed.error.issues[0].message, 400));
    }

    const { senderName, senderEmail, message } = parsed.data;

    const author = await User.findOne({
      username: req.params.username,
    });

    if (!author) {
      return next(new AppError("Author not found", 404));
    }

    await sendContactEmail({
      to: author.email,
      senderName,
      senderEmail,
      message,
      authorName: author.name,
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendEmailToAuthor,
};
