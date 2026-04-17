const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { hasPermission } = require("../config/roles");
const { asyncHandler } = require("./asyncHandler");
const AppError = require("../utils/AppError");

/**
 * protect — verifies the JWT access token and attaches user to req
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AppError("Not authenticated. Please log in.", 401);
  }

  // Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new AppError("Session expired. Please log in again.", 401);
    }
    throw new AppError("Invalid token. Please log in again.", 401);
  }

  // Find user (exclude password)
  // const user = await User.findById(decoded.id).select(
  //   "-password -refreshToken",
  // );
  const userId = decoded.id || decoded._id;

  if (!userId) {
    throw new AppError("Invalid token payload", 401);
  }

  const user = await User.findById(userId).select("-password -refreshToken");

  if (!user) {
    throw new AppError("User belonging to this token no longer exists.", 401);
  }

  if (user.status === "inactive") {
    throw new AppError(
      "Your account has been deactivated. Contact an administrator.",
      403,
    );
  }

  req.user = user;
  next();
});

/**
 * authorize — checks if the authenticated user has the required roles
 * Usage: authorize('admin', 'manager')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        `Access denied. Required role: ${roles.join(" or ")}.`,
        403,
      );
    }
    next();
  };
};

/**
 * requirePermission — checks a specific RBAC permission
 * Usage: requirePermission(PERMISSIONS.CREATE_USER)
 */
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!hasPermission(req.user.role, permission)) {
      throw new AppError(
        "You do not have permission to perform this action.",
        403,
      );
    }
    next();
  };
};

module.exports = { protect, authorize, requirePermission };
