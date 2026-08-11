const Product = require('../models/Product');
const Order = require('../models/Order');
const logger = require('../utils/logger');

class StockoutService {
  async predictStockoutRisk() {
    try {
      const products = await Product.find({});
      const orders = await Order.find({ paymentStatus: 'Paid' });

      // Calculate historical daily velocity per product
      const productSales = {};
      orders.forEach(o => {
        (o.items || []).forEach(item => {
          productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
        });
      });

      const itemsRiskList = products.map(p => {
        const totalSold = productSales[p.name] || (p.stock > 0 ? 2 : 0);
        // Estimate daily demand velocity (units / day)
        const dailyDemand = Math.max(0.2, Math.round((totalSold / 14) * 10) / 10);
        
        let estimatedDaysLeft = p.stock === 0 ? 0 : Math.floor(p.stock / dailyDemand);
        let riskLevel = 'LOW';
        let badgeVariant = 'success';

        if (p.stock === 0 || estimatedDaysLeft <= 7) {
          riskLevel = 'HIGH';
          badgeVariant = 'danger';
        } else if (estimatedDaysLeft <= 14) {
          riskLevel = 'MEDIUM';
          badgeVariant = 'warning';
        }

        const recommendedReorderQty = Math.max(20, Math.ceil(dailyDemand * 30 - p.stock));

        return {
          productId: p._id || p.id,
          name: p.name,
          sku: p.sku || 'SKU-LOGI',
          category: p.category || 'General',
          currentStock: p.stock,
          predictedDailyDemand: dailyDemand,
          estimatedStockoutDays: estimatedDaysLeft,
          riskLevel,
          badgeVariant,
          recommendedReorderQty
        };
      });

      // Sort items by highest risk first
      itemsRiskList.sort((a, b) => a.estimatedStockoutDays - b.estimatedStockoutDays);

      const highRiskCount = itemsRiskList.filter(i => i.riskLevel === 'HIGH').length;
      const mediumRiskCount = itemsRiskList.filter(i => i.riskLevel === 'MEDIUM').length;

      return {
        timestamp: new Date().toISOString(),
        summary: {
          totalProductsEvaluated: products.length,
          highRiskCount,
          mediumRiskCount,
          lowRiskCount: itemsRiskList.filter(i => i.riskLevel === 'LOW').length
        },
        stockoutRisks: itemsRiskList
      };
    } catch (err) {
      logger.error(`[Stockout Prediction Error] ${err.message}`);
      return {
        timestamp: new Date().toISOString(),
        summary: { totalProductsEvaluated: 0, highRiskCount: 0, mediumRiskCount: 0, lowRiskCount: 0 },
        stockoutRisks: []
      };
    }
  }
}

module.exports = new StockoutService();
