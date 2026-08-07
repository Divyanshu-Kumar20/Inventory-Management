const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');

// Apply authentication to all product routes
router.use(authenticateUser);

// GET & POST: Accessible to both Admin and Employee roles
router.route('/')
  .get(authorizeRoles('Admin', 'Employee'), getProducts)
  .post(authorizeRoles('Admin', 'Employee'), createProduct);

// GET & PUT: Accessible to Admin and Employee | DELETE: Restricted exclusively to Admin
router.route('/:id')
  .get(authorizeRoles('Admin', 'Employee'), getProductById)
  .put(authorizeRoles('Admin', 'Employee'), updateProduct)
  .delete(authorizeRoles('Admin'), deleteProduct);

module.exports = router;
