const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');

router.use(authenticateUser);

router.route('/')
  .get(getCategories)
  .post(authorizeRoles('Admin', 'Employee'), createCategory);

router.route('/:id')
  .put(authorizeRoles('Admin', 'Employee'), updateCategory)
  .delete(authorizeRoles('Admin'), deleteCategory);

module.exports = router;
