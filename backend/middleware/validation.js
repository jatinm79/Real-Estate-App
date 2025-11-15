const { body, validationResult } = require("express-validator");

const validateProperty = [
  body("project_name")
    .trim()
    .notEmpty()
    .withMessage("Project name is required")
    .isLength({ min: 2, max: 255 })
    .withMessage("Project name must be between 2 and 255 characters"),

  body("builder_name")
    .trim()
    .notEmpty()
    .withMessage("Builder name is required")
    .isLength({ min: 2, max: 255 })
    .withMessage("Builder name must be between 2 and 255 characters"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ min: 5, max: 500 })
    .withMessage("Location must be between 5 and 500 characters"),

  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a valid positive number")
    .notEmpty()
    .withMessage("Price is required"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description must not exceed 2000 characters"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
];

const validateFilters = [
  body("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be a valid number"),

  body("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be a valid number"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Invalid filter parameters",
        errors: errors.array(),
      });
    }
    next();
  },
];

module.exports = {
  validateProperty,
  validateFilters,
};
