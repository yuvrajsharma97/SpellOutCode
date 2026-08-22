const z = require("zod");

const createUpdateSchema = z.object({
  project: z.string().min(1, "A project must be selected."),

  title: z.string().trim().min(2, "Title must be at least 2 characters"),

  summary: z.string().trim().min(2, "Summary must be at least 2 characters"),

  content: z.string().trim().min(1, "Content is required"),

  tags: z.array(z.string()).default([]),

  published: z.boolean().default(false),
});

const updateUpdateSchema = createUpdateSchema.partial();

module.exports = {
  createUpdateSchema,
  updateUpdateSchema,
};
