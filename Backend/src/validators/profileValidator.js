const { z } = require("zod");

const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name cannot be empty")
    .max(60, "Name cannot exceed 60 characters")
    .optional(),
  bio: z
    .string()
    .trim()
    .max(300, "Bio cannot exceed 300 characters")
    .optional(),
  roleTitle: z
    .string()
    .trim()
    .max(80, "Role title cannot exceed 80 characters")
    .optional(),
  socialLinks: z
    .object({
      github: z
        .string()
        .trim()
        .url("Invalid GitHub URL")
        .or(z.literal(""))
        .optional(),
      linkedin: z
        .string()
        .trim()
        .url("Invalid LinkedIn URL")
        .or(z.literal(""))
        .optional(),
      twitter: z
        .string()
        .trim()
        .url("Invalid Twitter URL")
        .or(z.literal(""))
        .optional(),
      website: z
        .string()
        .trim()
        .url("Invalid website URL")
        .or(z.literal(""))
        .optional(),
    })
    .optional(),
  skills: z
    .array(z.string().trim().min(1))
    .max(20, "Cannot add more than 20 skills")
    .optional(),
});

module.exports = { updateProfileSchema };
