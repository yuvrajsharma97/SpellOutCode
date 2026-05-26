const mongoose = require("mongoose");

const updateSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project reference is required"],
    },
    title: {
      type: String,
      required: [true, "Update title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    summary: {
      type: String,
      required: [true, "Summary is required"],
      trim: true,
      maxlength: [300, "Summary cannot exceed 300 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      maxlength: [50000, "Content cannot exceed 50,000 characters"],
    },
    coverImage: {
      url: { type: String, default: "" },
      fileId: { type: String, default: "" },
    },
    tags: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: false,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// Fast lookups for all updates belonging to a project, sorted by date
updateSchema.index({ project: 1, createdAt: -1 });

// Fast lookups for all updates by a specific author
updateSchema.index({ author: 1, createdAt: -1 });

const Update = mongoose.model("Update", updateSchema);

module.exports = Update;
