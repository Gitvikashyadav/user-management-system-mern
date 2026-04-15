const express = require("express");
const router = express.Router();

const {
  register,
  login,
  refresh,
  logout,
  getMe,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const {
  loginValidator,
  registerValidator,
  refreshTokenValidator,
} = require("../validators/authValidators");

// ─── Public Routes ─────────────────────────────────────────────────────────────
router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/refresh", refreshTokenValidator, validate, refresh);

// ─── Protected Routes ─────────────────────────────────────────────────────────
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

module.exports = router;
