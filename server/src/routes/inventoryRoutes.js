const express = require('express');
const router = express.Router();
const { getInventoryLogs, adjustStock } = require('../controllers/inventoryController');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');

router.use(authenticateUser);

router.get('/logs', getInventoryLogs);
router.post('/adjust', authorizeRoles('Admin', 'Employee'), adjustStock);

module.exports = router;
