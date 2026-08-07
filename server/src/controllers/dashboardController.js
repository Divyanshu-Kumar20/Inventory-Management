const dashboardService = require('../services/dashboardService');
const asyncHandler = require('../utils/asyncHandler');

const getDashboardSummary = asyncHandler(async (req, res) => {
  const summary = await dashboardService.getDashboardSummary();
  res.status(200).json({ success: true, data: summary });
});

module.exports = { getDashboardSummary };
