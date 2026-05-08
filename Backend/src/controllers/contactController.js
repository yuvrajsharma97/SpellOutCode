const User = require("../models/user");
const AppError = require("../utils/appError");
const { sendContactEmail } = require("../services/contactServices");
const { contactSchema } = require("../validators/contactValidator");


const sendEmailToAuthorService = async (
  senderName,
  senderEmail,
  message,
  projectId,
  authorName,
) => {
  const project = await Project.findOne({ _id: projectId }).select("author", "slug email");

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const projectSlug = project.slug;
  const authorEmail = project.email;

  await sendContactEmail(
    senderName,
    senderEmail,
    message,
    projectSlug,
    authorName,
    authorEmail,
  );
  return;
};

const sendEmailToAuthor = async (req, res, next) => {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(parsed.error.issues[0].message, 400));
    }
     
    await sendEmailToAuthorService(parsed.data);
    
    res.status(200).json({
      status: "success",
      message: "Email sent successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendEmailToAuthor,
};