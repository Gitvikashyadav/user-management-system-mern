const logger = require("../utils/logger");
const AppError = require("../utils/AppError");

/**
 * 404 handler — for unmatched routes
 */
const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

/**
 * Global error handler
 * Handles Mongoose errors, JWT errors, and custom AppErrors
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // ── Mongoose: Bad ObjectId ─────────────────────────────────────────────────
  if (err.name === "CastError") {
    error = new AppError(`Invalid ID format: ${err.value}`, 400);
  }

  // ── Mongoose: Duplicate key ────────────────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    error = new AppError(`${field} '${value}' already exists.`, 409);
  }

  // ── Mongoose: Validation error ────────────────────────────────────────────
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new AppError(messages.join(". "), 400);
  }

  // ── JWT errors ────────────────────────────────────────────────────────────
  if (err.name === "JsonWebTokenError") {
    error = new AppError("Invalid token. Please log in again.", 401);
  }
  if (err.name === "TokenExpiredError") {
    error = new AppError("Token expired. Please log in again.", 401);
  }

  // Log server errors
  if (error.statusCode >= 500) {
    logger.error(
      `${error.statusCode} - ${error.message} - ${req.originalUrl} - ${req.method}`,
    );
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
