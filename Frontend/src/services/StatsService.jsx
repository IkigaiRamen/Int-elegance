import axios from 'axios';

const API_URL = 'http://localhost:5000/api/stats'; // Adjust the URL according to your backend setup

// Function to retrieve token from localStorage or sessionStorage
const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Function to create authentication headers using the token
const createAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Get total employees for a company
export const getTotalEmployees = async (companyId) => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/total-employees`, createAuthHeaders(token));
    return response.data;
  };
  
  // Get projects status stats for a company
  export const getProjectsStatusStats = async (companyId) => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/projects-status`, createAuthHeaders(token));
    return response.data;
  };
  
  // Get task completion rate for a company
  export const getTaskCompletionRate = async (companyId) => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/task-completion-rate`, createAuthHeaders(token));
    return response.data;
  };
  
  // Get active projects and tasks for a company
  export const getActiveProjectsAndTasks = async (companyId) => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/active-projects-tasks`, createAuthHeaders(token));
    return response.data;
  };
  
  // Get project completion by priority for a company
  export const getProjectCompletionByPriority = async (companyId) => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/project-completion-priority`, createAuthHeaders(token));
    return response.data;
  };
  
  // Get upcoming project deadlines for a company
  export const getUpcomingProjectDeadlines = async (companyId) => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/upcoming-project-deadlines`, createAuthHeaders(token));
    return response.data;
  };
  
  // Get employee project distribution for a company
  export const getEmployeeProjectDistribution = async (companyId) => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/employee-project-distribution`, createAuthHeaders(token));
    return response.data;
  };
  