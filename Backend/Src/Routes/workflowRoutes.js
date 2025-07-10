const express = require('express');
const { createWorkflow, getWorkflow, updateWorkflow, deleteWorkflow } = require('../Controllers/workflowController');
const { protect, authorize } = require('../Middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, authorize(['admin']), createWorkflow)
  .get(protect, authorize(['admin']), getWorkflow);

router.route('/:id')
  .put(protect, authorize(['admin']), updateWorkflow)
  .delete(protect, authorize(['admin']), deleteWorkflow);

module.exports = router;
