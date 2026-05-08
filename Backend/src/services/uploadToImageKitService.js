const imagekit = require("../config/imagekit");
const AppError = require("../utils/appError");

// Upload a file buffer to ImageKit 
const uploadImage = async (fileBuffer, fileName, folder) => {

  console.log("Uploading image to ImageKit:",fileName, folder, fileBuffer);

  try {
    const result = await imagekit.files.upload({
      file: fileBuffer.toString("base64"),
      fileName: `${fileName} + ${Date.now()}`,
      folder: folder,
    });

    return {
      url: result.url,
      fileId: result.fileId,
    };
  } catch (error) {
    throw new AppError("Image upload failed. Please try again.", 502);
  }
};

// Delete an Image
const deleteImage = async (fileId) => {
  try {
    await imagekit.files.deleteFile(fileId);
  } catch (error) {
    throw new AppError("Image deletion failed. Please try again.", 502);
  }
};

module.exports = { uploadImage, deleteImage };
