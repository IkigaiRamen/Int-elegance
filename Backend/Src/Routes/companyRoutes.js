const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../Middleware/authMiddleware');
const {
    createCompany,
    getCompanies,
    updateCompanyLogo,
    getCompanyById,
    updateCompany,
    deleteCompany,
    assignUserToCompany,
    getCompanyEmployees,
    getCompaniesByCreatorId,
    removeUserFromCompany,
    getTotalEmployees,
    getProjectsStatusStats,
    getTaskCompletionRate,
    getActiveProjectsAndTasks,
    getProjectCompletionByPriority,
    getUpcomingProjectDeadlines,
    getEmployeeProjectDistribution,
} = require('../Controllers/companyController');

// CRUD routes for company
router.post('/', authenticateToken, createCompany); // Create company
router.get('/Company', authenticateToken, getCompaniesByCreatorId); // Get companies by creator ID
router.put('/logo', authenticateToken, updateCompanyLogo); // Update company logo
router.get('/:companyId', authenticateToken, getCompanyById); // Get company by ID
router.put('/:companyId', authenticateToken, updateCompany); // Update company
router.delete('/:companyId', authenticateToken, deleteCompany); // Delete company

// Company logo route


// Employee management routes
router.post('/AddEmployee', authenticateToken, assignUserToCompany); // Assign user to company
router.get('/Company/employees', authenticateToken, getCompanyEmployees); // Get company employees
router.delete('/Company/employees/', authenticateToken, removeUserFromCompany); // Remove employee from company

// Stats routes (with /stats prefix)
router.get('/:companyId/stats/total-employees', authenticateToken, getTotalEmployees); // Get total employees
router.get('/:companyId/stats/projects-status', authenticateToken, getProjectsStatusStats); // Get projects status stats
router.get('/:companyId/stats/task-completion-rate', authenticateToken, getTaskCompletionRate); // Get task completion rate
router.get('/:companyId/stats/active-projects-tasks', authenticateToken, getActiveProjectsAndTasks); // Get active projects and tasks
router.get('/:companyId/stats/project-completion-priority', authenticateToken, getProjectCompletionByPriority); // Get project completion by priority
router.get('/:companyId/stats/upcoming-project-deadlines', authenticateToken, getUpcomingProjectDeadlines); // Get upcoming project deadlines
router.get('/:companyId/stats/employee-project-distribution', authenticateToken, getEmployeeProjectDistribution); // Get employee project distribution

module.exports = router;
