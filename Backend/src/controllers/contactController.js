const Project = require("../models/project");
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

    const project = await Project.findById(req.params.projectId).populate(
      "author",
      "name email username",
    );

    if (!project || !project.author) {
      return next(new AppError("Project or author not found", 404));
    }

    await sendContactEmail({
      to: project.author.email,
      senderName,
      senderEmail,
      message,
      authorName: project.author.name,
      projectSlug: project.slug,
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
