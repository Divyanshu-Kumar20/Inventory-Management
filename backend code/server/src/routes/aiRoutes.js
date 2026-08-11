const express = require('express');
const router = express.Router();
const { generateAIInsights } = require('../controllers/aiController');
const { authenticateUser } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { validateAIPrompt } = require('../validators/aiValidator');

router.use(authenticateUser);
router.use(apiLimiter);

router.post('/generate', validateAIPrompt, generateAIInsights);

module.exports = router;
