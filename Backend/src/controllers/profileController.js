const profileService = require("../services/profileServices");
const { updateProfileSchema } = require("../validators/profileValidator");
const AppError = require("../utils/appError");

// GET /api/profile/:userId 
const getProfile = async (req, res, next) => {
  try {
    const user = await profileService.getProfileByUserId(req.params.userId);

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/profile 
const updateProfile = async (req, res, next) => {
  try {
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(parsed.error.errors[0].message, 400));
    }

    // Prevent empty update requests
    if (Object.keys(parsed.data).length === 0) {
      return next(new AppError("No update fields provided", 400));
    }

    const user = await profileService.updateProfile(req.user.id, parsed.data);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/profile/avatarUpload 
const updateAvatar = async (req, res, next) => {

  try {
    if (!req.file) {
      return next(new AppError("No image file provided", 400));
    }

    const user = await profileService.updateAvatar(
      req.user.id,
      req.file.buffer,
      req.file.originalname,
    );

    res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      data: {
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, updateAvatar };
