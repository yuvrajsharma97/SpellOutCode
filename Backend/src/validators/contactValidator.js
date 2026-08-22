const z = require("zod");

const contactSchema = z.object({
  senderName: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(60, "Name is too long"),

  senderEmail: z.string().trim().email("Enter a valid email address"),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message is too long"),

  projectId: z.string().trim().optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});

module.exports = {
  contactSchema,
  forgotPasswordSchema,
};
