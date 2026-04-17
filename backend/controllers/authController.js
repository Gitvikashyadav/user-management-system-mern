const authService = require("../services/authService");
const { asyncHandler } = require("../middleware/asyncHandler");
const { sendTokenResponse } = require("../utils/tokenUtils");

/**
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.register({
    name,
    email,
    password,
  });
  sendTokenResponse(res, 201, user, accessToken, refreshToken);
});

/**
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.login({
    email,
    password,
  });
  sendTokenResponse(res, 200, user, accessToken, refreshToken);
});

/**
 * @route   POST /api/auth/refresh
 * @access  Public
 */
const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const { accessToken } = await authService.refresh(refreshToken);
  res.status(200).json({ success: true, data: { accessToken } });
});

/**
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);
  res.status(200).json({ success: true, message: "Logged out successfully." });
});

/**
 * @route   GET /api/auth/me
 * @access  Private
 */
// const getMe = asyncHandler(async (req, res) => {
//   const user = await authService.getMe(req.user._id);
//   res.status(200).json({ success: true, data: { user } });
// });

const getMe = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("User not authenticated", 401);
  }

  // ✅ directly return middleware user (no DB call needed)
  res.status(200).json({
    success: true,
    data: { user: req.user },
  });
});
module.exports = { register, login, refresh, logout, getMe };
