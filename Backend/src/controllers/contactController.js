const User = require("../models/user");
const AppError = require("../utils/appError");
const { sendContactEmail } = require("../services/contactServices");
const { contactSchema } = require("../validators/contactValidator");
const Project = require("../models/project");


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
     
    const { name, email, message } = parsed.data;
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) return next(new AppError("User not found", 404));

    await sendContactEmail(
      name,
      email,
      message,
      username,
      user.name,
      user.email,
    );

    
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