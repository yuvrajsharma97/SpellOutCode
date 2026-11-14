const z = require("zod");

const allowedStatuses = ["active", "paused", "completed", "archived"];

// Only http(s) links may be stored; they are rendered as hrefs.
const httpUrl = z
  .string()
  .trim()
  .url("Enter a valid URL")
  .refine((value) => /^https?:\/\//i.test(value), "URL must start with http:// or https://");

const shortList = (label) =>
  z
    .array(z.string().trim().min(1).max(40, `${label} entries must be under 40 characters`))
    .max(20, `Use at most 20 ${label.toLowerCase()} entries`);

const fields = {
  title: z
    .string()
    .trim()
    .min(2, "Project title is required")
    .max(120, "Title is too long"),

  summary: z
    .string()
    .trim()
    .max(300, "Summary must be under 300 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be under 5,000 characters"),

  techStack: shortList("Tech stack"),

  githubUrl: httpUrl.or(z.literal("")),

  liveUrl: httpUrl.or(z.literal("")),

  tags: shortList("Tags"),

  status: z.enum(allowedStatuses, {
    message: "Please choose a valid project status.",
  }),
};

const createProjectSchema = z.object({
  title: fields.title,
  summary: fields.summary.optional(),
  description: fields.description,
  techStack: fields.techStack.default([]),
  githubUrl: fields.githubUrl.optional(),
  liveUrl: fields.liveUrl.optional(),
  tags: fields.tags.default([]),
  status: fields.status.default("active"),
});

// No defaults on edit: a field the client leaves out must stay unchanged,
// not be reset.
const updateProjectSchema = z.object(fields).partial();

module.exports = {
  createProjectSchema,
  updateProjectSchema,
};
