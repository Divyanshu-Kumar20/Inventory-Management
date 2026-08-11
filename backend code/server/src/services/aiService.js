const { GoogleGenAI } = require('@google/genai');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Supplier = require('../models/Supplier');
const Customer = require('../models/Customer');
const logger = require('../utils/logger');

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (this.apiKey && this.apiKey !== 'your_gemini_api_key_here') {
      try {
        this.ai = new GoogleGenAI({ apiKey: this.apiKey });
      } catch (e) {
        logger.error(`[AI Service Init Error] ${e.message}`);
      }
    }
  }

  async fetchContextForIntent(prompt, user) {
    const p = prompt.toLowerCase();
    let intent = 'GENERAL';
    let data = {};

    if (p.includes('low') || p.includes('threshold') || p.includes('out of stock')) {
      intent = 'LOW_STOCK';
      const lowStockProducts = await Product.find({ stock: { $lte: 10 } }).select('name sku stock category price');
      data = { lowStockProducts };
    } else if (p.includes('best') || p.includes('top selling') || p.includes('most sold')) {
      intent = 'BEST_SELLING';
      const orders = await Order.find({ paymentStatus: 'Paid' });
      const productSales = {};
      orders.forEach(order => {
        (order.items || []).forEach(item => {
          productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
        });
      });
      data = { topSellingProducts: productSales };
    } else if (p.includes('order') || p.includes('month') || p.includes('received')) {
      intent = 'MONTHLY_ORDERS';
      const count = await Order.countDocuments({});
      const paidOrders = await Order.find({ paymentStatus: 'Paid' });
      const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
      data = { totalOrders: count, totalRevenue };
    } else if (p.includes('category') || p.includes('revenue category') || p.includes('highest revenue')) {
      intent = 'TOP_REVENUE_CATEGORY';
      const categories = await Category.find({});
      const products = await Product.find({});
      const categoryData = categories.map(cat => ({
        name: cat.name,
        productCount: products.filter(prd => prd.category === cat.name).length
      }));
      data = { categories: categoryData };
    } else if (p.includes('supplier') || p.includes('vendor')) {
      intent = 'TOP_SUPPLIER';
      const suppliers = await Supplier.find({});
      const products = await Product.find({});
      const supplierProductCount = suppliers.map(s => ({
        name: s.name,
        contactPerson: s.contactPerson,
        productsSupplied: products.filter(p => p.supplier === s.name).length
      }));
      data = { suppliers: supplierProductCount };
    } else {
      const totalProducts = await Product.countDocuments({});
      const totalOrders = await Order.countDocuments({});
      const totalCustomers = await Customer.countDocuments({});
      data = { summary: { totalProducts, totalOrders, totalCustomers } };
    }

    return { intent, data };
  }

  async processChat(prompt, user) {
    try {
      const { intent, data } = await this.fetchContextForIntent(prompt, user);

      if (this.ai) {
        const response = await this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `System Context: You are Inventra AI, the intelligent Enterprise ERP Assistant.
Intent Recognized: ${intent}
Context Data from Database: ${JSON.stringify(data)}
User Question: "${prompt}"

Instructions: Give a concise, professional, friendly markdown response answering the user's question directly using the provided Context Data.`
        });
        return {
          reply: response.text,
          intent,
          model: 'gemini-2.5-flash'
        };
      }

      const reply = this.synthesizeFallbackReply(intent, data, prompt);
      return {
        reply,
        intent,
        model: 'inventra-ai-engine-v2'
      };
    } catch (error) {
      logger.error(`[AI Chat Error] ${error.message}`);
      return {
        reply: `Inventra AI: I examined your request for "${prompt}". Currently ${error.message ? 'using cached ERP metrics' : 'processing'}.`,
        intent: 'FALLBACK',
        model: 'inventra-ai-fallback'
      };
    }
  }

  synthesizeFallbackReply(intent, data, prompt) {
    if (intent === 'LOW_STOCK') {
      const items = data.lowStockProducts || [];
      if (items.length === 0) return '📦 **Inventra AI Stock Alert**: Excellent news! All products in your inventory are currently well above safety thresholds.';
      const list = items.map(i => `- **${i.name}** (SKU: ${i.sku || 'N/A'}) - **${i.stock} units remaining** (₹${i.price})`).join('\n');
      return `⚠️ **Inventra AI Low Stock Report**:\nThe following **${items.length} items** are below threshold (<= 10 units):\n\n${list}\n\n*Recommendation: Reorder stock from your suppliers soon to avoid out-of-stock loss.*`;
    }

    if (intent === 'BEST_SELLING') {
      const sales = data.topSellingProducts || {};
      const keys = Object.keys(sales);
      if (keys.length === 0) return '📈 **Inventra AI Sales Analytics**: No completed sales orders found for this workspace yet. Create sales orders to view top-selling items.';
      const sorted = keys.sort((a, b) => sales[b] - sales[a]).slice(0, 5);
      const list = sorted.map((name, index) => `${index + 1}. **${name}** — ${sales[name]} units sold`).join('\n');
      return `🏆 **Inventra AI Best-Selling Products**:\n${list}`;
    }

    if (intent === 'MONTHLY_ORDERS') {
      return `📦 **Inventra AI Order Summary**:\n- Total Orders Received: **${data.totalOrders || 0} orders**\n- Total Realized Revenue: **₹${(data.totalRevenue || 0).toLocaleString()}**`;
    }

    if (intent === 'TOP_REVENUE_CATEGORY') {
      const cats = data.categories || [];
      if (cats.length === 0) return '📊 **Inventra AI Department Analytics**: No active categories registered.';
      const list = cats.map(c => `- **${c.name}**: ${c.productCount} active products`).join('\n');
      return `🏷️ **Inventra AI Category Breakdown**:\n${list}`;
    }

    if (intent === 'TOP_SUPPLIER') {
      const supps = data.suppliers || [];
      if (supps.length === 0) return '🏢 **Inventra AI Vendor Intelligence**: No registered vendors found.';
      const list = supps.map(s => `- **${s.name}** (${s.contactPerson || 'Vendor'}) — Supplies **${s.productsSupplied} products**`).join('\n');
      return `🏢 **Inventra AI Vendor Intelligence**:\n${list}`;
    }

    return `🤖 **Inventra AI Assistant**: I am monitoring your workspace containing **${data.summary?.totalProducts || 0} products**, **${data.summary?.totalOrders || 0} orders**, and **${data.summary?.totalCustomers || 0} customer accounts**. How can I assist your inventory today?`;
  }
}

module.exports = new AIService();
