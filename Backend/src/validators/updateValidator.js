const { z } = require("zod");

const createUpdateSchema = z.object({
  project: z.string().trim().min(1, "Project ID is required"),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(150, "Title cannot exceed 150 characters"),
  summary: z
    .string()
    .trim()
    .min(1, "Summary is required")
    .max(300, "Summary cannot exceed 300 characters"),
  content: z.string().trim().min(1, "Content is required"),
  tags: z
    .array(z.string().trim())
    .max(10, "Cannot add more than 10 tags")
    .default([]),
  published: z.boolean().default(false),
});

const updateUpdateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(150, "Title cannot exceed 150 characters")
    .optional(),
  summary: z
    .string()
    .trim()
    .min(1, "Summary cannot be empty")
    .max(300, "Summary cannot exceed 300 characters")
    .optional(),
  content: z.string().trim().min(1, "Content cannot be empty").optional(),
  tags: z
    .array(z.string().trim())
    .max(10, "Cannot add more than 10 tags")
    .optional(),
  published: z.boolean().optional(),
});

module.exports = { createUpdateSchema, updateUpdateSchema };
