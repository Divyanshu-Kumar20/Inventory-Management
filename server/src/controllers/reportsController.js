const reportsService = require('../services/reportsService');
const asyncHandler = require('../utils/asyncHandler');

const getSalesReport = asyncHandler(async (req, res) => {
  const data = await reportsService.getSalesReport();
  res.status(200).json({ success: true, data });
});

const getRevenueReport = asyncHandler(async (req, res) => {
  const data = await reportsService.getRevenueReport();
  res.status(200).json({ success: true, data });
});

const getInventoryReport = asyncHandler(async (req, res) => {
  const data = await reportsService.getInventoryReport();
  res.status(200).json({ success: true, data });
});

const getCustomerReport = asyncHandler(async (req, res) => {
  const data = await reportsService.getCustomerReport();
  res.status(200).json({ success: true, data });
});

module.exports = { getSalesReport, getRevenueReport, getInventoryReport, getCustomerReport };
