const { body, validationResult } = require('express-validator');

const validateAI = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'AI Validation Failed',
      errors: errors.array().map(err => ({ field: err.path || err.param, message: err.msg }))
    });
  }
  next();
};

const validateAIPrompt = [
  body('prompt')
    .notEmpty().withMessage('Prompt string is required')
    .isString().withMessage('Prompt must be a string')
    .isLength({ max: 2000 }).withMessage('Prompt must not exceed 2000 characters'),
  body('context')
    .optional()
    .isObject().withMessage('Context must be a valid JSON object'),
  validateAI
];

module.exports = {
  validateAIPrompt,
  validateAI
};
