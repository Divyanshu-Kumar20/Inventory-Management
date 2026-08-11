const Product = require('../models/Product');
const Order = require('../models/Order');
const Supplier = require('../models/Supplier');
const logger = require('../utils/logger');

class RestockService {
  async getRestockRecommendations() {
    try {
      const products = await Product.find({});
      const orders = await Order.find({ paymentStatus: 'Paid' });
      const suppliers = await Supplier.find({});

      const productSales = {};
      orders.forEach(o => {
        (o.items || []).forEach(item => {
          productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
        });
      });

      const recommendations = products.map(p => {
        const totalSold = productSales[p.name] || (p.stock > 0 ? 3 : 0);
        const dailyVelocity = Math.max(0.3, Math.round((totalSold / 14) * 10) / 10);
        
        // 30-Day Demand Forecast
        const predicted30DayDemand = Math.round(dailyVelocity * 30 * 1.2);
        
        // Supplier Lead Time (days)
        const supplierLeadTime = 7;
        
        // Safety Stock Buffer
        const safetyStock = Math.ceil(dailyVelocity * supplierLeadTime * 1.5);
        
        // Recommended Order Quantity Formula
        const recommendedOrderQty = Math.max(0, predicted30DayDemand + safetyStock - p.stock);
        
        // Priority Determination
        let priority = 'LOW';
        let priorityVariant = 'secondary';
        
        const leadTimeDemand = dailyVelocity * supplierLeadTime;
        if (p.stock <= leadTimeDemand || recommendedOrderQty >= 50) {
          priority = 'HIGH';
          priorityVariant = 'danger';
        } else if (p.stock <= predicted30DayDemand) {
          priority = 'MEDIUM';
          priorityVariant = 'warning';
        }

        const vendor = suppliers.find(s => s.name === p.supplier) || { name: p.supplier || 'TechSource Global', leadTime: '7 days' };

        return {
          productId: p._id || p.id,
          productName: p.name,
          sku: p.sku || 'SKU-GEN',
          category: p.category || 'General',
          currentStock: p.stock,
          predicted30DayDemand,
          supplierLeadTime: `${supplierLeadTime} days`,
          safetyStock,
          recommendedOrderQty,
          priority,
          priorityVariant,
          unitPrice: p.price,
          estimatedCost: Math.round(recommendedOrderQty * p.price),
          supplier: vendor.name
        };
      });

      // Filter & sort high and medium priority items first
      recommendations.sort((a, b) => {
        const pOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
        return pOrder[a.priority] - pOrder[b.priority] || b.recommendedOrderQty - a.recommendedOrderQty;
      });

      const highPriorityCount = recommendations.filter(r => r.priority === 'HIGH').length;
      const totalPurchaseOrderCost = recommendations.reduce((sum, r) => sum + r.estimatedCost, 0);

      return {
        timestamp: new Date().toISOString(),
        summary: {
          totalProductsEvaluated: products.length,
          highPriorityCount,
          mediumPriorityCount: recommendations.filter(r => r.priority === 'MEDIUM').length,
          totalPurchaseOrderCost
        },
        recommendations
      };
    } catch (err) {
      logger.error(`[Restock Service Error] ${err.message}`);
      return {
        timestamp: new Date().toISOString(),
        summary: { totalProductsEvaluated: 0, highPriorityCount: 0, totalPurchaseOrderCost: 0 },
        recommendations: []
      };
    }
  }
}

module.exports = new RestockService();
