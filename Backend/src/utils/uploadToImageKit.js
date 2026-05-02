const ImageKitClient = require("../config/imagekit");

const uploadToImageKit = (buffer, fileName, folder) => {
  return new Promise((resolve, reject) => {
    ImageKitClient.upload(
      {
        file: buffer,
        fileName,
        folder,
        useUniqueFileName: true, 
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.url,
          fileId: result.fileId, 
        });
      },
    );
  });
};

module.exports = uploadToImageKit;
