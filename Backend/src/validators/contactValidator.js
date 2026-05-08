const { z } = require("zod");

const contactSchema = z.object({
  senderName: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(60, "Name cannot exceed 60 characters"),
  senderEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message cannot exceed 2000 characters"),
  authorName: z
    .string()
    .trim()
    .min(1, "Author name is required")
    .max(60, "Author name cannot exceed 60 characters"),
  projectId: z.string().trim().optional(),
});

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email"),
});

module.exports = { contactSchema, forgotPasswordSchema };
