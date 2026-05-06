const { z } = require("zod");

const VALID_STATUSES = ["planned", "in-progress", "completed"];

const createProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(1000, "Description cannot exceed 1000 characters"),
  tags: z
    .array(z.string().trim())
    .max(10, "Cannot add more than 10 tags")
    .default([]),
  status: z
    .enum(VALID_STATUSES, {
      errorMap: () => ({
        message: "Status must be planned, in-progress, or completed",
      }),
    })
    .default("planned"),
});

const updateProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(100, "Title cannot exceed 100 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .min(1, "Description cannot be empty")
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),
  tags: z
    .array(z.string().trim())
    .max(10, "Cannot add more than 10 tags")
    .optional(),
  status: z
    .enum(VALID_STATUSES, {
      errorMap: () => ({
        message: "Status must be planned, in-progress, or completed",
      }),
    })
    .optional(),
});

module.exports = { createProjectSchema, updateProjectSchema };
