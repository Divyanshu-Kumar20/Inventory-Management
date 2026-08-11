const express = require('express');
const router = express.Router();
const { generateAIInsights, chatAI, analyticsAI, getInsights, getForecast, getStockoutRisk, getRestockRecommendations, getAnomalies, seedHistory } = require('../controllers/aiController');
const { authenticateUser } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { validateAIPrompt } = require('../validators/aiValidator');

router.use(authenticateUser);
router.use(apiLimiter);

router.get('/insights', getInsights);
router.get('/forecast', getForecast);
router.get('/stockout-risk', getStockoutRisk);
router.get('/restock-recommendations', getRestockRecommendations);
router.get('/anomalies', getAnomalies);
router.post('/seed-history', seedHistory);
router.post('/generate', validateAIPrompt, generateAIInsights);
router.post('/chat', validateAIPrompt, chatAI);
router.post('/analytics', validateAIPrompt, analyticsAI);

module.exports = router;
