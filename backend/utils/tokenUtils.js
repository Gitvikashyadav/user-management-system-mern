const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/**
 * Generate a short-lived JWT access token
 */
const generateAccessToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE || "15m",
  });
};

/**
 * Generate a long-lived JWT refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
  });
};

/**
 * Generate a random password (for admin-created users)
 * @param {number} length
 * @returns {string}
 */
const generateRandomPassword = (length = 12) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  return Array.from(crypto.randomBytes(length))
    .map((b) => chars[b % chars.length])
    .join("");
};

/**
 * Send token response — attaches tokens to response body
 */
const sendTokenResponse = (
  res,
  statusCode,
  user,
  accessToken,
  refreshToken,
) => {
  res.status(statusCode).json({
    success: true,
    data: {
      user: user.toSafeObject ? user.toSafeObject() : user,
      accessToken,
      refreshToken,
    },
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateRandomPassword,
  sendTokenResponse,
};
