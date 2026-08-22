const z = require("zod");

const allowedStatuses = ["active", "paused", "completed", "archived"];

const createProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Project title is required")
    .max(120, "Title is too long"),

  summary: z
    .string()
    .trim()
    .max(300, "Summary must be under 300 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),

  techStack: z.array(z.string()).default([]),

  githubUrl: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),

  liveUrl: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),

  tags: z.array(z.string()).default([]),

  status: z.enum(allowedStatuses, {
    message: "Please choose a valid project status.",
  }).default("active"),
});

const updateProjectSchema = createProjectSchema.partial();

module.exports = {
  createProjectSchema,
  updateProjectSchema,
};
