const z = require("zod");

const contactSchema = z.object({
  senderName: z.string().trim().min(2).max(60),

  senderEmail: z.string().trim().email(),

  message: z.string().trim().min(10).max(1000),

  projectId: z.string().trim().optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().trim().email(),
});

module.exports = {
  contactSchema,
  forgotPasswordSchema,
};
