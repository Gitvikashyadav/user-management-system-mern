const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

/**
 * validate — runs after express-validator chains.
 * Collects all validation errors and returns them in a clean format.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join('. ');
    throw new AppError(messages, 400);
  }
  next();
};

module.exports = { validate };