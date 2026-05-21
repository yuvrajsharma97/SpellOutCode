const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    summary: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    techStack: [
      {
        type: String,
      },
    ],

    githubUrl: {
      type: String,
    },

    liveUrl: {
      type: String,
    },

    status: {
      type: String,
      enum: ["planned", "in-progress", "completed", "archived"],
      default: "planned",
    },

    tags: [
      {
        type: String,
      },
    ],

    coverImage: {
      url: String,
      fileId: String,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Project", projectSchema);
