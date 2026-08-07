const express = require('express');
const router = express.Router();
const { getSalesReport, getRevenueReport, getInventoryReport, getCustomerReport } = require('../controllers/reportsController');
const { authenticateUser } = require('../middleware/auth');

router.use(authenticateUser);

router.get('/sales', getSalesReport);
router.get('/revenue', getRevenueReport);
router.get('/inventory', getInventoryReport);
router.get('/customer', getCustomerReport);

module.exports = router;
