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

router.use(authenticateUser);

router.route('/')
  .get(authorizeRoles('Admin', 'Employee'), getProducts)
  .post(authorizeRoles('Admin', 'Employee'), createProduct);

router.route('/:id')
  .get(authorizeRoles('Admin', 'Employee'), getProductById)
  .put(authorizeRoles('Admin', 'Employee'), updateProduct)
  .delete(authorizeRoles('Admin'), deleteProduct);

module.exports = router;
