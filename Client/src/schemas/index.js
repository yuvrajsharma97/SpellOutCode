import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(
      /^[a-z0-9_]+$/,
      "Username can contain lowercase letters, numbers, and underscores only",
    ),
  email: z.string().email(),
  password: z.string().min(6),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const projectSchema = z.object({
  title: z
    .string()
    .min(2, "Project title is required")
    .max(80, "Title is too long"),
  summary: z
    .string()
    .max(300, "Summary must be under 300 characters")
    .optional(),
  description: z.string().optional(),
  status: z
    .enum(["active", "paused", "completed", "archived"])
    .default("active"),
  techStack: z.string().optional(),
  tags: z.string().optional(),
  githubUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  liveUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

export const updateSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  summary: z.string().min(2, "Summary must be at least 2 characters"),
  content: z.string().min(1, "Content is required"),
  tag: z.string().optional(),
  published: z.boolean().default(false),
});

export const profileSchema = z.object({
  name: z.string().min(2).max(80),
  roleTitle: z.string().max(80).optional(),
  bio: z.string().max(500).optional(),
});

export const socialSchema = z.object({
  github: z.string().url("Enter a valid URL").or(z.literal("")).optional(),
  twitter: z.string().url("Enter a valid URL").or(z.literal("")).optional(),
  linkedin: z.string().url("Enter a valid URL").or(z.literal("")).optional(),
  website: z.string().url("Enter a valid URL").or(z.literal("")).optional(),
});

export const contactSchema = z.object({
  senderName: z.string().min(2),
  senderEmail: z.string().email(),
  message: z.string().min(10).max(1000),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
