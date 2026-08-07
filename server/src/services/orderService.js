const Order = require('../models/Order');
const Product = require('../models/Product');
const InventoryLog = require('../models/InventoryLog');
const { AppError } = require('../middleware/errorHandler');

class OrderService {
  async getOrders({ search, status, page = 1, limit = 10 }) {
    const query = {};
    if (status) query.fulfillmentStatus = status;
    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { customer: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const totalRecords = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return {
      orders,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords
      }
    };
  }

  async createOrder(orderData) {
    const { customer, customerEmail, items, paymentMethod } = orderData;
    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new AppError(`Product with ID ${item.productId} not found`, 404);
      }
      if (product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${product.name}. Available: ${product.stock}, requested: ${item.quantity}`, 400);
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      processedItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price
      });

      const oldStock = product.stock;
      product.stock -= item.quantity;
      await product.save();

      await InventoryLog.create({
        product: product.name,
        productId: product._id,
        oldStock,
        newStock: product.stock,
        change: `-${item.quantity}`,
        reason: `Order Fulfillment (${customer})`
      });
    }

    const order = await Order.create({
      customer,
      customerEmail,
      items: processedItems,
      amount: totalAmount,
      paymentMethod: paymentMethod || 'Credit Card',
      paymentStatus: 'Paid',
      fulfillmentStatus: 'Processing'
    });

    return order;
  }

  async updateOrderStatus(id, fulfillmentStatus) {
    const order = await Order.findById(id);
    if (!order) throw new AppError('Order not found', 404);
    order.fulfillmentStatus = fulfillmentStatus;
    return await order.save();
  }
}

module.exports = new OrderService();
