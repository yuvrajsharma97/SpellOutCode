const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN, jwtid: crypto.randomUUID() },
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    // A unique id per token: two sessions issued in the same second would
    // otherwise get byte-identical tokens, so revoking one couldn't
    // distinguish it from the other.
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN, jwtid: crypto.randomUUID() },
  );
};



module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
