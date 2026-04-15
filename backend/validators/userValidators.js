const { body, query } = require("express-validator");
const { ROLES } = require("../config/roles");

const createUserValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("role")
    .optional()
    .isIn(Object.values(ROLES))
    .withMessage("Invalid role"),
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be active or inactive"),
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

const updateUserValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("role")
    .optional()
    .isIn(Object.values(ROLES))
    .withMessage("Invalid role"),
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be active or inactive"),
];

const updateOwnProfileValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain uppercase, lowercase, and number"),
  body("role").not().exists().withMessage("You cannot change your own role"),
];

const getUsersQueryValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("role")
    .optional()
    .isIn(Object.values(ROLES))
    .withMessage("Invalid role filter"),
  query("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Invalid status filter"),
];

module.exports = {
  createUserValidator,
  updateUserValidator,
  updateOwnProfileValidator,
  getUsersQueryValidator,
};
