const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/tokenUtils');
const AppError = require('../utils/AppError');
const { ROLES } = require('../config/roles');

/**
 * Register a new user (self-registration — always creates a 'user' role)
 */
const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already in use.', 409);
  }

  const user = await User.create({
    name,
    email,
    password,
    role: ROLES.USER, // Self-registered users always get base role
  });

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  // Store hashed refresh token
  user.refreshToken = await bcrypt.hash(refreshToken, 10);
  await user.save({ validateBeforeSave: false });

  return { user, accessToken, refreshToken };
};

/**
 * Login — validates credentials and returns tokens
 */
const login = async ({ email, password }) => {
  // Explicitly select password (it's excluded by default)
  const user = await User.findOne({ email }).select('+password +refreshToken');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password.', 401);
  }

  if (user.status === 'inactive') {
    throw new AppError('Your account is deactivated. Contact an administrator.', 403);
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  // Store hashed refresh token
  user.refreshToken = await bcrypt.hash(refreshToken, 10);
  await user.save({ validateBeforeSave: false });

  return { user, accessToken, refreshToken };
};

/**
 * Refresh — issues a new access token using a valid refresh token
 */
const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError('Refresh token is required.', 400);
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new AppError('Invalid or expired refresh token.', 401);
  }

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || !user.refreshToken) {
    throw new AppError('Invalid refresh token.', 401);
  }

  // Verify stored hash matches
  const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
  if (!isValid) {
    throw new AppError('Invalid refresh token.', 401);
  }

  if (user.status === 'inactive') {
    throw new AppError('Account is deactivated.', 403);
  }

  const newAccessToken = generateAccessToken(user._id, user.role);
  return { accessToken: newAccessToken };
};

/**
 * Logout — clears stored refresh token
 */
const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

/**
 * Get the authenticated user's own profile
 */
const getMe = async (userId) => {
  const user = await User.findById(userId)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  if (!user) throw new AppError('User not found.', 404);
  return user;
};

module.exports = { register, login, refresh, logout, getMe };