const express = require('express');
const router = express.Router();
const { getSuppliers, createSupplier, updateSupplier, deleteSupplier } = require('../controllers/supplierController');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');

router.use(authenticateUser);

router.route('/')
  .get(getSuppliers)
  .post(authorizeRoles('Admin', 'Employee'), createSupplier);

router.route('/:id')
  .put(authorizeRoles('Admin', 'Employee'), updateSupplier)
  .delete(authorizeRoles('Admin'), deleteSupplier);

module.exports = router;
