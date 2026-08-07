const express = require('express');
const router = express.Router();

const { apiLimiter, authLimiter } = require('../middleware/rateLimiter');

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const supplierRoutes = require('./supplierRoutes');
const customerRoutes = require('./customerRoutes');
const orderRoutes = require('./orderRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const reportsRoutes = require('./reportsRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const uploadRoutes = require('./uploadRoutes');

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'Inventra Enterprise ERP Backend API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

router.use('/auth', authLimiter, authRoutes);
router.use(apiLimiter);

router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/customers', customerRoutes);
router.use('/orders', orderRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/reports', reportsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
