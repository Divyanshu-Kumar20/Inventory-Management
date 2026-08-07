const Product = require('../models/Product');
const Order = require('../models/Order');
const Customer = require('../models/Customer');

class DashboardService {
  async getDashboardSummary() {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await Customer.countDocuments();

    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const lowStockCount = await Product.countDocuments({ stock: { $lte: 10 } });
    const pendingOrdersCount = await Order.countDocuments({ fulfillmentStatus: 'Pending' });
    const topProducts = await Product.find().sort({ stock: -1 }).limit(5);

    return {
      totalProducts,
      productsGrowth: '+12%',
      totalOrders,
      ordersGrowth: '+8.5%',
      totalRevenue,
      revenueGrowth: '+18.2%',
      totalCustomers,
      customersGrowth: '+5.4%',
      lowStockCount,
      pendingOrdersCount,
      topProducts
    };
  }
}

module.exports = new DashboardService();
