const userService = require('../services/userService');
const { asyncHandler } = require('../middleware/asyncHandler');

/**
 * @route   GET /api/users
 * @access  Private — Admin, Manager
 * @desc    Get all users with pagination, search, filters
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, search, role, status } = req.query;

  const result = await userService.getAllUsers({
    page,
    limit,
    search,
    role,
    status,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @route   GET /api/users/:id
 * @access  Private — Admin, Manager
 * @desc    Get a single user by ID
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id, req.user);

  res.status(200).json({
    success: true,
    data: { user },
  });
});

/**
 * @route   POST /api/users
 * @access  Private — Admin only
 * @desc    Create a new user
 */
const createUser = asyncHandler(async (req, res) => {
  const result = await userService.createUser(req.body, req.user._id);

  res.status(201).json({
    success: true,
    message: 'User created successfully.',
    data: result,
  });
});

/**
 * @route   PUT /api/users/:id
 * @access  Private — Admin, Manager (with restrictions)
 * @desc    Update any user's details
 */
const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body, req.user);

  res.status(200).json({
    success: true,
    message: 'User updated successfully.',
    data: { user },
  });
});

/**
 * @route   PATCH /api/users/profile
 * @access  Private — All authenticated users
 * @desc    Update own profile (name, password only)
 */
const updateOwnProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateOwnProfile(req.user._id, req.body);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    data: { user },
  });
});

/**
 * @route   DELETE /api/users/:id
 * @access  Private — Admin only
 * @desc    Soft delete (deactivate) a user
 */
const deleteUser = asyncHandler(async (req, res) => {
  const result = await userService.deleteUser(req.params.id, req.user._id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

/**
 * @route   PATCH /api/users/:id/status
 * @access  Private — Admin only
 * @desc    Toggle user active/inactive status
 */
const toggleUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const user = await userService.updateUser(
    req.params.id,
    { status },
    req.user
  );

  res.status(200).json({
    success: true,
    message: `User ${status === 'active' ? 'activated' : 'deactivated'} successfully.`,
    data: { user },
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateOwnProfile,
  deleteUser,
  toggleUserStatus,
};