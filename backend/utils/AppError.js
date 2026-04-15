/**
 * AppError — custom error class for operational errors.
 * All errors thrown with this class are "expected" errors
 * (bad request, unauthorized, not found, etc.)
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
