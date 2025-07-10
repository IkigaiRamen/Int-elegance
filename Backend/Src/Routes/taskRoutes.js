const express = require('express');
const { createTask, fetchTasksByProjectId, changeTaskStatus, editTask, deleteTask, getTaskById } = require('../Controllers/taskController');
const { authenticateToken } = require('../Middleware/authMiddleware');

const router = express.Router();

// Create a new task
router.post('/create', authenticateToken, createTask);

// Fetch tasks by project ID
router.get('/project/:projectId', authenticateToken, fetchTasksByProjectId);

// Get task by ID
router.get('/task/:taskId', authenticateToken, getTaskById);

// Update task status
router.patch('/update/:taskId', authenticateToken, changeTaskStatus);

// Edit a task
router.put('/edit/:taskId', authenticateToken, editTask);

// Delete a task
router.delete('/delete/:taskId', authenticateToken, deleteTask);

module.exports = router;
