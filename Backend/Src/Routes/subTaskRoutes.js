const express = require('express');
const { createSubtask, getSubtasksByTask, getSubtaskById, updateSubtask, deleteSubtask, getProjectCreatorBySubtaskId } = require('../Controllers/subTaskController');
const { authenticateToken } = require('../Middleware/authMiddleware');

const router = express.Router();

// Create a new subtask
router.post('/create', authenticateToken, createSubtask);  // Make sure to pass createSubtask as the callback function

// Get all subtasks for a specific task
router.get('/:taskId', authenticateToken, getSubtasksByTask);

// Get a specific subtask by ID
router.get('/subtask/:subtaskId', authenticateToken, getSubtaskById);

// Get the project creator by subtask ID
router.get('/creator/:subtaskId', authenticateToken, getProjectCreatorBySubtaskId);

// Update a subtask
router.put('/subtask/:subtaskId', authenticateToken, updateSubtask);

// Delete a subtask
router.delete('/subtask/:subtaskId', authenticateToken, deleteSubtask);

module.exports = router;
