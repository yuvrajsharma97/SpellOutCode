const z = require("zod");

const objectId = z
  .string()
  .regex(/^[a-f0-9]{24}$/i, "A project must be selected.");

const fields = {
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(150, "Title cannot exceed 150 characters"),

  summary: z
    .string()
    .trim()
    .min(2, "Summary must be at least 2 characters")
    .max(300, "Summary cannot exceed 300 characters"),

  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(50000, "Content cannot exceed 50,000 characters"),

  tags: z
    .array(z.string().trim().min(1).max(40, "Tags must be under 40 characters"))
    .max(10, "Use at most 10 tags"),

  published: z.boolean(),
};

const createUpdateSchema = z.object({
  project: objectId,
  title: fields.title,
  summary: fields.summary,
  content: fields.content,
  tags: fields.tags.default([]),
  published: fields.published.default(false),
});

// Editing: no `project` field (an update can never move to another
// project) and no defaults (an omitted field must not be reset). Unknown
// keys, including `project`, are stripped.
const updateUpdateSchema = z
  .object({
    title: fields.title,
    summary: fields.summary,
    content: fields.content,
    tags: fields.tags,
    published: fields.published,
  })
  .partial();

module.exports = {
  createUpdateSchema,
  updateUpdateSchema,
};
