const ImageKit = require("@imagekit/nodejs");

const ImageKitclient = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

module.exports = ImageKitclient;
