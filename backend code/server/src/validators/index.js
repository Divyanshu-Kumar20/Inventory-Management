const { body, validationResult } = require('express-validator');

/**
 * Common Express Validation Error Checker
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Failed',
      errors: errors.array().map(err => ({ field: err.path || err.param, message: err.msg }))
    });
  }
  next();
};

// Validation Rules
const validateRegister = [
  body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  validate
];

const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const validateProduct = [
  body('name').notEmpty().withMessage('Product name is required').trim(),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be an integer >= 0'),
  body('category').notEmpty().withMessage('Product category is required'),
  validate
];

const validateOrder = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.productId').notEmpty().withMessage('Product ID is required for each item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  validate
];

const validateCustomer = [
  body('name').notEmpty().withMessage('Customer name is required'),
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('phone').optional().notEmpty().withMessage('Phone number must not be empty if provided'),
  validate
];

module.exports = {
  validate,
  validateRegister,
  validateLogin,
  validateProduct,
  validateOrder,
  validateCustomer
};
