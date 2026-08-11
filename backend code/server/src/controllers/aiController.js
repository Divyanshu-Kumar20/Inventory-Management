const aiService = require('../services/aiService');
const asyncHandler = require('../utils/asyncHandler');
const { seedHistoricalOrderDataset } = require('../seeders/historicalSeeder');

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

const getInsights = asyncHandler(async (req, res) => {
  const result = await aiService.getBusinessInsights(req.user);
  res.status(200).json({
    success: true,
    message: 'AI Business Insights generated',
    data: result
  });
});

const seedHistory = asyncHandler(async (req, res) => {
  const result = await seedHistoricalOrderDataset();
  res.status(200).json({
    success: true,
    message: 'Historical sales dataset preparation completed',
    data: result
  });
});

module.exports = {
  generateAIInsights,
  chatAI,
  analyticsAI,
  getInsights,
  seedHistory
};
