const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

class ReportsService {
  async getSalesReport() {
    return await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$amount' },
          ordersCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }

  async getRevenueReport() {
    return await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$amount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }

  async getInventoryReport() {
    return await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalUnits: { $sum: '$stock' },
          totalValuation: { $sum: { $multiply: ['$price', '$stock'] } },
          productsCount: { $sum: 1 }
        }
      },
      { $sort: { totalUnits: -1 } }
    ]);
  }

  async getCustomerReport() {
    return await Customer.find().sort({ totalSpent: -1 }).limit(10);
  }
}

module.exports = new ReportsService();
