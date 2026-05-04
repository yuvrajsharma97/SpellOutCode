// models/Thread.js
const mongoose = require("mongoose");
const slugify = require("slugify");

const threadSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Thread title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [80, "Title cannot exceed 80 characters"],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      maxlength: [300, "Description cannot exceed 300 characters"],
      default: "",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    postCount: {
      type: Number,
      default: 0,
    },
    coverImage: {
      url: { type: String, default: "" },
      fileId: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);


threadSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return;

  let slug = slugify(this.title, { lower: true, strict: true });
  
  const existing = await mongoose.models.Thread.findOne({
    slug,
    _id: { $ne: this._id },
  });
  if (existing) slug = `${slug}-${this.author.toString().slice(-4)}`;

  this.slug = slug;
});

const threadModel = mongoose.model("Thread", threadSchema);
module.exports = threadModel;
