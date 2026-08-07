const orderService = require('../services/orderService');
const asyncHandler = require('../utils/asyncHandler');

const getOrders = asyncHandler(async (req, res) => {
  const { search, status, page, limit } = req.query;
  const result = await orderService.getOrders({ search, status, page, limit });
  res.status(200).json({ success: true, ...result });
});

const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.body);
  res.status(201).json({ success: true, message: 'Sales order processed successfully', data: order });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { fulfillmentStatus } = req.body;
  const order = await orderService.updateOrderStatus(req.params.id, fulfillmentStatus);
  res.status(200).json({ success: true, message: `Order status updated to ${fulfillmentStatus}`, data: order });
});

module.exports = { getOrders, createOrder, updateOrderStatus };
