const z = require("zod");

const createUpdateSchema = z.object({
  project: z.string().min(1),

  title: z.string().trim().min(2),

  summary: z.string().trim().min(2),

  content: z.string().trim().min(1),

  tags: z.array(z.string()).default([]),

  published: z.boolean().default(false),
});

const updateUpdateSchema = createUpdateSchema.partial();

module.exports = {
  createUpdateSchema,
  updateUpdateSchema,
};
