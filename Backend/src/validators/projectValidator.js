const z = require("zod");

const allowedStatuses = ["active", "paused", "completed", "archived"];

const createProjectSchema = z.object({
  title: z.string().trim().min(2).max(120),

  summary: z.string().trim().max(300).optional(),

  description: z.string().trim().min(10),

  techStack: z.array(z.string()).default([]),

  githubUrl: z.string().url().optional(),

  liveUrl: z.string().url().optional(),

  tags: z.array(z.string()).default([]),

  status: z.enum(allowedStatuses).default("active"),
});

const updateProjectSchema = createProjectSchema.partial();

module.exports = {
  createProjectSchema,
  updateProjectSchema,
};
