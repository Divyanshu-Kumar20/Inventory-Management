const Order = require('../models/Order');
const Product = require('../models/Product');
const logger = require('../utils/logger');

const seedHistoricalOrderDataset = async () => {
  try {
    const existingCount = await Order.countDocuments({});
    if (existingCount >= 50) {
      logger.info(`[Historical Seeder] Data already sufficient (${existingCount} records).`);
      return { seeded: false, count: existingCount };
    }

    const demoProducts = [
      { name: 'MacBook Pro 16" M2 Max', price: 2499.00, category: 'Electronics' },
      { name: 'Logitech MX Master 3S Mouse', price: 99.99, category: 'Electronics' },
      { name: 'Dell UltraSharp 27" 4K Monitor', price: 549.50, category: 'Electronics' },
      { name: 'Herman Miller Aeron Chair', price: 1395.00, category: 'Furniture' },
      { name: 'Keychron K2 Mechanical Keyboard', price: 89.00, category: 'Electronics' },
      { name: 'Sony WH-1000XM5 Headphones', price: 398.00, category: 'Electronics' },
      { name: 'Nespresso Vertuo Next Coffee Machine', price: 169.00, category: 'Appliances' },
      { name: 'Moleskine Classic Notebook', price: 22.95, category: 'Stationery' }
    ];

    const demoCustomers = [
      { name: 'Sarah Jenkins (Apex Corp)', email: 'procurement@apexcorp.io' },
      { name: 'David Chen (Nexus Labs)', email: 'billing@nexuslabs.com' },
      { name: 'Marcus Brody (Vanguard)', email: 'orders@vanguard.org' },
      { name: 'Elena Rostova (Starlight)', email: 'admin@starlight.co' },
      { name: 'Robert Vance (Elevate)', email: 'finance@elevatesolutions.com' }
    ];

    const paymentMethods = ['Credit Card', 'Wire Transfer', 'UPI / NetBanking', 'PayPal'];
    const newOrders = [];
    const now = new Date();

    for (let dayOffset = 360; dayOffset >= 0; dayOffset -= 5) {
      const orderDate = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
      const cust = demoCustomers[Math.floor(Math.random() * demoCustomers.length)];
      const prod = demoProducts[Math.floor(Math.random() * demoProducts.length)];
      const qty = Math.floor(1 + Math.random() * 5);
      const amount = prod.price * qty;

      newOrders.push({
        invoiceNumber: `INV-HIST-${Date.now().toString().slice(-6)}-${dayOffset}`,
        customer: cust.name,
        customerEmail: cust.email,
        items: [
          {
            productId: '64f1a2b3c4d5e6f7a8b9c0d1',
            name: prod.name,
            quantity: qty,
            price: prod.price
          }
        ],
        amount,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        paymentStatus: 'Paid',
        fulfillmentStatus: 'Completed',
        createdAt: orderDate,
        updatedAt: orderDate
      });
    }

    await Order.insertMany(newOrders);
    logger.info(`[Historical Seeder] Seeded ${newOrders.length} time-series historical orders.`);
    return { seeded: true, count: newOrders.length };
  } catch (err) {
    logger.error(`[Historical Seeder Error] ${err.message}`);
    return { seeded: false, error: err.message };
  }
};

module.exports = { seedHistoricalOrderDataset };
