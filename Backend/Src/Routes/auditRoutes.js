const express = require('express');
const { getAuditLogs } = require('../Controllers/auditController');
const { protect, authorize } = require('../Middleware/authMiddleware');

const router = express.Router();

// Protect the route and allow access only to Admins
router.get('/audit-logs', protect, authorize(['Admin']), getAuditLogs);

module.exports = router;
