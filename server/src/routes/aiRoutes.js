const express = require('express');
const router = express.Router();
const { generateAIInsights, chatAI, analyticsAI } = require('../controllers/aiController');
const { authenticateUser } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { validateAIPrompt } = require('../validators/aiValidator');

router.use(authenticateUser);
router.use(apiLimiter);

router.post('/generate', validateAIPrompt, generateAIInsights);
router.post('/chat', validateAIPrompt, chatAI);
router.post('/analytics', validateAIPrompt, analyticsAI);

module.exports = router;
