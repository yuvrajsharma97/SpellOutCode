const { z } = require("zod");

// bcrypt only uses the first 72 bytes of a password, so every password
// schema caps at 72.

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(60, "Name cannot exceed 60 characters"),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(
      /^[a-z0-9_]+$/,
      "Username can only contain lowercase letters, numbers, or underscores",
    ),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password cannot exceed 72 characters"),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(1, "Password is required").max(200),
});

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password cannot exceed 72 characters"),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required").max(200),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(72, "New password cannot exceed 72 characters"),
});

const verifyEmailSchema = z.object({
  password: z
    .string()
    .min(1, "Enter the password you chose when signing up")
    .max(200),
});

// Used by forgot-password and resend-verification.
const emailOnlySchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
});

module.exports = {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  changePasswordSchema,
  verifyEmailSchema,
  emailOnlySchema,
};
