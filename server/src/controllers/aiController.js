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

module.exports = {
  generateAIInsights
};
