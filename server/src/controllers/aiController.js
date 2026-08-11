const aiService = require('../services/aiService');
const asyncHandler = require('../utils/asyncHandler');

const generateAIInsights = asyncHandler(async (req, res) => {
  const { prompt, context } = req.body;
  const result = await aiService.generateResponse(prompt, context);
  res.status(200).json({
    success: true,
    message: 'AI content generated successfully',
    data: result
  });
});

const chatAI = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  const result = await aiService.processChat(prompt, req.user);
  res.status(200).json({
    success: true,
    message: 'AI Chat response processed successfully',
    data: result
  });
});

const analyticsAI = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  const result = await aiService.runNaturalLanguageAnalytics(prompt, req.user);
  res.status(200).json({
    success: true,
    message: 'Natural Language Analytics query executed',
    data: result
  });
});

module.exports = {
  generateAIInsights,
  chatAI,
  analyticsAI
};
