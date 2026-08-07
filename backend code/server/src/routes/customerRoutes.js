const express = require('express');
const router = express.Router();
const { getCustomers, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const { validateCustomer } = require('../validators');

router.use(authenticateUser);

router.route('/')
  .get(getCustomers)
  .post(validateCustomer, createCustomer);

router.route('/:id')
  .put(updateCustomer)
  .delete(authorizeRoles('Admin'), deleteCustomer);

module.exports = router;
