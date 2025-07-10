const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../Middleware/authMiddleware');
const {
    getTotalEmployees,
    getProjectsStatusStats,
    getTaskCompletionRate,
    getActiveProjectsAndTasks,
    getProjectCompletionByPriority,
    getUpcomingProjectDeadlines,
    getEmployeeProjectDistribution,
} = require('../Controllers/companyController');

// CRUD routes for company


// Stats routes (with /stats prefix)
router.get('/total-employees', authenticateToken, getTotalEmployees); // Get total employees
router.get('/projects-status', authenticateToken, getProjectsStatusStats); // Get projects status stats
router.get('/task-completion-rate', authenticateToken, getTaskCompletionRate); // Get task completion rate
router.get('/active-projects-tasks', authenticateToken, getActiveProjectsAndTasks); // Get active projects and tasks
router.get('/project-completion-priority', authenticateToken, getProjectCompletionByPriority); // Get project completion by priority
router.get('/upcoming-project-deadlines', authenticateToken, getUpcomingProjectDeadlines); // Get upcoming project deadlines
router.get('/employee-project-distribution', authenticateToken, getEmployeeProjectDistribution); // Get employee project distribution

module.exports = router;
