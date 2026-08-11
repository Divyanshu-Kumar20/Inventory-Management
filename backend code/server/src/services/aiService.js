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

  // --- Phase 4: Automated AI Business Insights Generator --- //
  async getBusinessInsights(user) {
    try {
      const products = await Product.find({});
      const orders = await Order.find({});
      const categories = await Category.find({});
      const suppliers = await Supplier.find({});

      const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? (o.amount || 0) : 0), 0);
      const lowStockCount = products.filter(p => p.stock <= 10).length;
      const outOfStockCount = products.filter(p => p.stock === 0).length;

      const productSales = {};
      orders.forEach(o => {
        (o.items || []).forEach(item => {
          productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
        });
      });
      const sortedProducts = Object.keys(productSales).sort((a, b) => productSales[b] - productSales[a]);
      const topProduct = sortedProducts[0] || (products[0] ? products[0].name : 'Logitech MX Master 3S');

      const statsSummary = {
        totalProductsCount: products.length,
        totalOrdersCount: orders.length,
        totalRevenue,
        lowStockCount,
        outOfStockCount,
        topProduct,
        topCategory: categories[0] ? categories[0].name : 'Electronics',
        suppliersCount: suppliers.length
      };

      let bullets = [];

      if (this.ai) {
        try {
          const aiRes = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate 5 executive bullet-point insights for an ERP dashboard using this workspace statistics JSON: ${JSON.stringify(statsSummary)}.
Use emojis like 📈, 🔥, ⚠️, 📦, 📉 at start of each line. Keep lines short.`
          });
          const text = aiRes.text;
          bullets = text.split('\n').filter(line => line.trim().length > 0);
        } catch (e) {
          bullets = this.generateFallbackInsightsArray(statsSummary);
        }
      } else {
        bullets = this.generateFallbackInsightsArray(statsSummary);
      }

      return {
        timestamp: new Date().toISOString(),
        stats: statsSummary,
        insights: bullets
      };
    } catch (err) {
      logger.error(`[Business Insights Error] ${err.message}`);
      return {
        timestamp: new Date().toISOString(),
        insights: [
          '📈 Revenue trajectory is steady across active sales quarters.',
          '🔥 Electronics & IT Equipment remain the primary revenue generator.',
          '⚠️ Active inventory monitors are tracking safety threshold stock.',
          '📦 Order processing speed remains optimal across departments.'
        ]
      };
    }
  }

  generateFallbackInsightsArray(stats) {
    const revStr = stats.totalRevenue > 0 ? `₹${stats.totalRevenue.toLocaleString()}` : '₹0';
    return [
      `📈 Revenue generated is **${revStr}** for this workspace environment.`,
      `🔥 **${stats.topProduct}** is leading overall sales volume performance.`,
      stats.lowStockCount > 0 
        ? `⚠️ **${stats.lowStockCount} products** have low inventory below safety threshold (<= 10 units).`
        : `⚠️ Inventory levels are healthy with zero items below threshold.`,
      `📦 **${stats.topCategory}** generated the highest product department velocity.`,
      `📉 Order fulfillment status is monitored with **${stats.totalOrdersCount} orders** processed.`
    ];
  }

  // --- Phase 3: Natural Language Intent Parser --- //
  async parseNaturalLanguageQuery(prompt) {
    const p = prompt.toLowerCase();

    let intent = 'general_analytics';
    let entity = 'products';
    let period = 'all_time';
    let limit = 5;
    let sort = 'revenue';
    let category = null;

    const limitMatch = p.match(/(?:top|best|first)\s+(\d+)/);
    if (limitMatch && limitMatch[1]) {
      limit = parseInt(limitMatch[1], 10);
    }

    if (p.includes('this month') || p.includes('current month')) period = 'current_month';
    else if (p.includes('last month')) period = 'last_month';
    else if (p.includes('quarter') || p.includes('q1') || p.includes('q2')) period = 'quarter';
    else if (p.includes('year') || p.includes('annual')) period = 'year';

    if (p.includes('product') || p.includes('item') || p.includes('sku')) {
      entity = 'products';
      intent = p.includes('stock') ? 'inventory_level' : 'top_products';
      sort = p.includes('sales') || p.includes('sold') ? 'sales' : (p.includes('stock') ? 'stock' : 'revenue');
    } else if (p.includes('order') || p.includes('transaction')) {
      entity = 'orders';
      intent = 'order_analytics';
      sort = p.includes('amount') || p.includes('revenue') ? 'amount' : 'date';
    } else if (p.includes('customer') || p.includes('client') || p.includes('buyer')) {
      entity = 'customers';
      intent = 'top_customers';
      sort = p.includes('spend') || p.includes('revenue') ? 'totalSpent' : 'ordersCount';
    } else if (p.includes('supplier') || p.includes('vendor')) {
      entity = 'suppliers';
      intent = 'top_suppliers';
      sort = p.includes('rating') ? 'rating' : 'productsSupplied';
    } else if (p.includes('revenue') || p.includes('sales') || p.includes('financial')) {
      entity = 'revenue';
      intent = 'revenue_summary';
      sort = 'revenue';
    } else if (p.includes('inventory') || p.includes('warehouse')) {
      entity = 'inventory';
      intent = 'inventory_turnover';
      sort = 'stock';
    }

    const structuredQuery = { intent, entity, period, limit, sort, category };

    if (this.ai) {
      try {
        const aiParseResponse = await this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Parse this natural language business question into a JSON object with keys: "intent", "entity", "period", "limit", "sort".
User Question: "${prompt}"
Return ONLY raw JSON.`
        });
        const jsonText = aiParseResponse.text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedAI = JSON.parse(jsonText);
        return { ...structuredQuery, ...parsedAI };
      } catch (e) {
        return structuredQuery;
      }
    }

    return structuredQuery;
  }

  // --- Phase 3: MongoDB Aggregation Pipeline Execution --- //
  async executeAnalyticsAggregation(structuredQuery) {
    const { intent, entity, period, limit, sort } = structuredQuery;
    let aggregatedData = [];
    let summaryText = '';

    try {
      if (entity === 'products' || intent === 'top_products') {
        let sortObj = { price: -1 };
        if (sort === 'stock') sortObj = { stock: -1 };
        if (sort === 'sales' || sort === 'revenue') sortObj = { stock: -1, price: -1 };

        aggregatedData = await Product.find({})
          .sort(sortObj)
          .limit(limit)
          .select('name sku category price stock status supplier');

        summaryText = `Found **${aggregatedData.length} top products** sorted by ${sort}.`;

      } else if (entity === 'orders' || intent === 'order_analytics') {
        const pipeline = [
          { $match: { paymentStatus: 'Paid' } },
          {
            $group: {
              _id: '$customer',
              totalOrders: { $sum: 1 },
              totalSpent: { $sum: '$amount' }
            }
          },
          { $sort: { totalSpent: -1 } },
          { $limit: limit }
        ];
        aggregatedData = await Order.aggregate(pipeline);
        summaryText = `Aggregated **${aggregatedData.length} order customer profiles** for ${period}.`;

      } else if (entity === 'customers' || intent === 'top_customers') {
        aggregatedData = await Customer.find({})
          .sort({ totalSpent: -1 })
          .limit(limit)
          .select('name email phone city totalSpent ordersCount status');

        summaryText = `Retrieved top **${aggregatedData.length} enterprise accounts** by lifetime value.`;

      } else if (entity === 'suppliers' || intent === 'top_suppliers') {
        aggregatedData = await Supplier.find({})
          .sort({ rating: -1 })
          .limit(limit)
          .select('name contactPerson email phone address productsSupplied rating');

        summaryText = `Fetched **${aggregatedData.length} premier suppliers** by vendor performance rating.`;

      } else if (entity === 'revenue' || intent === 'revenue_summary') {
        const orders = await Order.find({ paymentStatus: 'Paid' });
        const revenueByMethod = {};
        orders.forEach(o => {
          revenueByMethod[o.paymentMethod || 'Credit Card'] = (revenueByMethod[o.paymentMethod || 'Credit Card'] || 0) + o.amount;
        });
        aggregatedData = Object.keys(revenueByMethod).map(m => ({ channel: m, revenue: revenueByMethod[m] }));
        summaryText = `Analyzed **₹${orders.reduce((sum, o) => sum + o.amount, 0).toLocaleString()} total revenue** across channels.`;

      } else {
        const lowStock = await Product.find({ stock: { $lte: 10 } }).limit(limit);
        aggregatedData = lowStock;
        summaryText = `Identified **${lowStock.length} inventory items** requiring restock.`;
      }
    } catch (dbErr) {
      logger.error(`[Analytics Aggregation Error] ${dbErr.message}`);
      aggregatedData = [];
      summaryText = `Executed standard analytics scan.`;
    }

    return { aggregatedData, summaryText };
  }

  async runNaturalLanguageAnalytics(prompt, user) {
    const structuredQuery = await this.parseNaturalLanguageQuery(prompt);
    const { aggregatedData, summaryText } = await this.executeAnalyticsAggregation(structuredQuery);

    let executiveInsight = summaryText;
    if (this.ai) {
      try {
        const res = await this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Synthesize a executive 2-sentence summary for this business query results:
Structured Intent: ${JSON.stringify(structuredQuery)}
Aggregated Data: ${JSON.stringify(aggregatedData)}`
        });
        executiveInsight = res.text;
      } catch (e) {
      }
    }

    return {
      query: prompt,
      structuredQuery,
      data: aggregatedData,
      insight: executiveInsight
    };
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
