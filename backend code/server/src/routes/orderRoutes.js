const express = require('express');
const router = express.Router();
const { getOrders, createOrder, updateOrderStatus } = require('../controllers/orderController');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const { validateOrder } = require('../validators');

router.use(authenticateUser);

router.route('/')
  .get(getOrders)
  .post(validateOrder, createOrder);

router.route('/:id/status')
  .patch(authorizeRoles('Admin', 'Employee'), updateOrderStatus);

module.exports = router;
