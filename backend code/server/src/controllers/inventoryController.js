const InventoryLog = require('../models/InventoryLog');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');

const getInventoryLogs = asyncHandler(async (req, res) => {
  const logs = await InventoryLog.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: logs.length, data: logs });
});

const adjustStock = asyncHandler(async (req, res) => {
  const { productId, actionType, quantity, reason } = req.body;
  if (!productId || !quantity || Number(quantity) <= 0) {
    throw new AppError('Product ID and valid quantity are required', 400);
  }

  const product = await Product.findById(productId);
  if (!product) throw new AppError('Product not found', 404);

  const oldStock = product.stock;
  const changeQty = Number(quantity);
  const newStock = actionType === 'increase' ? oldStock + changeQty : Math.max(0, oldStock - changeQty);

  product.stock = newStock;
  await product.save();

  const log = await InventoryLog.create({
    product: product.name,
    productId: product._id,
    oldStock,
    newStock,
    change: `${actionType === 'increase' ? '+' : '-'}${changeQty}`,
    reason: reason || 'Manual Adjustment'
  });

  res.status(200).json({
    success: true,
    message: `Adjusted stock for ${product.name} to ${newStock} units`,
    data: { product, log }
  });
});

module.exports = { getInventoryLogs, adjustStock };
