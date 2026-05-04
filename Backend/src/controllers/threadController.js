const Thread = require("../models/Thread");
const AppError = require("../utils/AppError");
const uploadToImageKit = require("../utils/uploadToImageKit");
const imagekit = require("../config/imagekit");


exports.createThread = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const thread = await Thread.create({
      title,
      description,
      author: req.user.id,
    });

    res.status(201).json({ status: "success", thread });
  } catch (error) {
    next(error);
  }
};


exports.getUserThreads = async (req, res, next) => {
  try {
    const threads = await Thread.find({ author: req.params.userId })
      .sort({ createdAt: -1 })
      .lean();

    res
      .status(200)
      .json({ status: "success", results: threads.length, threads });
  } catch (error) {
    next(error);
  }
};


exports.getThread = async (req, res, next) => {
  try {
    const thread = await Thread.findOne({ slug: req.params.slug })
      .populate("author", "name avatar bio")
      .lean();

    if (!thread) return next(new AppError("Thread not found.", 404));

    res.status(200).json({ status: "success", thread });
  } catch (error) {
    next(error);
  }
};


exports.updateThread = async (req, res, next) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) return next(new AppError("Thread not found.", 404));

    if (thread.author.toString() !== req.user.id) {
      return next(
        new AppError("You are not authorised to update this thread.", 403),
      );
    }

    const { title, description } = req.body;
    if (title) thread.title = title;
    if (description !== undefined) thread.description = description;

    await thread.save();

    res.status(200).json({ status: "success", thread });
  } catch (error) {
    next(error);
  }
};


exports.updateThreadCover = async (req, res, next) => {
  try {
    if (!req.file) return next(new AppError("Please upload an image.", 400));

    const thread = await Thread.findById(req.params.id);
    if (!thread) return next(new AppError("Thread not found.", 404));

    if (thread.author.toString() !== req.user.id) {
      return next(
        new AppError("You are not authorised to update this thread.", 403),
      );
    }

    // Delete old cover from ImageKit
    if (thread.coverImage.fileId) {
      await imagekit.deleteFile(thread.coverImage.fileId);
    }

    const { url, fileId } = await uploadToImageKit(
      req.file.buffer,
      `thread-cover-${thread._id}`,
      "/thread-covers",
    );

    thread.coverImage = { url, fileId };
    await thread.save({ validateBeforeSave: false });

    res.status(200).json({ status: "success", coverImage: thread.coverImage });
  } catch (error) {
    next(error);
  }
};


exports.deleteThread = async (req, res, next) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) return next(new AppError("Thread not found.", 404));

    if (thread.author.toString() !== req.user.id) {
      return next(
        new AppError("You are not authorised to delete this thread.", 403),
      );
    }

    // Delete cover image from ImageKit if exists
    if (thread.coverImage.fileId) {
      await imagekit.deleteFile(thread.coverImage.fileId);
    }

    // Unset thread reference on all posts in this thread
    const Post = require("../models/Post");
    await Post.updateMany({ thread: thread._id }, { $unset: { thread: "" } });

    await thread.deleteOne();

    res.status(200).json({ status: "success", message: "Thread deleted." });
  } catch (error) {
    next(error);
  }
};
