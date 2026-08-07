const express = require('express');
const router = express.Router();
const { getDashboardSummary } = require('../controllers/dashboardController');
const { authenticateUser } = require('../middleware/auth');

router.use(authenticateUser);
router.get('/summary', getDashboardSummary);

module.exports = router;
