const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateOwnProfile,
  deleteUser,
  toggleUserStatus,
} = require("../controllers/userController");

const { protect, authorize } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const {
  createUserValidator,
  updateUserValidator,
  updateOwnProfileValidator,
  getUsersQueryValidator,
} = require("../validators/userValidators");

const { ROLES } = require("../config/roles");

// All user routes require authentication
router.use(protect);

// ─── Own Profile ──────────────────────────────────────────────────────────────
// PATCH /api/users/profile  — must be defined BEFORE /:id routes
router.patch("/profile", updateOwnProfileValidator, validate, updateOwnProfile);

// ─── Admin + Manager Routes ───────────────────────────────────────────────────
router
  .route("/")
  .get(
    authorize(ROLES.ADMIN, ROLES.MANAGER),
    getUsersQueryValidator,
    validate,
    getAllUsers,
  )
  .post(authorize(ROLES.ADMIN), createUserValidator, validate, createUser);

// ─── Single User Routes ────────────────────────────────────────────────────────
router
  .route("/:id")
  .get(authorize(ROLES.ADMIN, ROLES.MANAGER), getUserById)
  .put(
    authorize(ROLES.ADMIN, ROLES.MANAGER),
    updateUserValidator,
    validate,
    updateUser,
  )
  .delete(authorize(ROLES.ADMIN), deleteUser);

// ─── Status Toggle ─────────────────────────────────────────────────────────────
router.patch("/:id/status", authorize(ROLES.ADMIN), toggleUserStatus);

module.exports = router;
