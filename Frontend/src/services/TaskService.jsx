import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks'; // Update with your actual API base URL

// Function to create authorization headers
const createAuthHeaders = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

// Function to retrieve token from localStorage
const getToken = () => {
    // Try to get token from localStorage, fallback to sessionStorage
    return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Create a new task
export const createTask = async (taskData) => {
    try {
        const token = getToken(); // Retrieve token
        const response = await axios.post(`${API_URL}/create`, taskData, createAuthHeaders(token));
        return response.data; // Return the created task data
    } catch (error) {
        console.error('Error creating task:', error.response?.data);
        throw error; // Rethrow the error to handle it in the component
    }
};

// Fetch tasks by project ID
export const fetchTasksByProjectId = async (projectId) => {
    try {
        const token = getToken(); // Retrieve token
        const response = await axios.get(`${API_URL}/project/${projectId}`, createAuthHeaders(token));
        return response.data; // Return the fetched tasks
    } catch (error) {
        console.error('Error fetching tasks:', error.response?.data);
        throw error; // Rethrow the error to handle it in the component
    }
};

// Change task status
export const changeTaskStatus = async (taskId, status) => {
    try {
        const token = getToken(); // Retrieve token
        const response = await axios.patch(`${API_URL}/update/${taskId}`, { status }, createAuthHeaders(token));
        return response.data; // Return the updated task
    } catch (error) {
        console.error('Error updating task status:', error.response?.data);
        throw error; // Rethrow the error to handle it in the component
    }
};

// Edit a task
export const editTask = async (taskId, taskData) => {
    try {
        const token = getToken(); // Retrieve token
        const response = await axios.put(`${API_URL}/edit/${taskId}`, taskData, createAuthHeaders(token));
        return response.data; // Return the updated task data
    } catch (error) {
        console.error('Error updating task:', error.response?.data);
        throw error; // Rethrow the error to handle it in the component
    }
};

// Delete a task
export const deleteTask = async (taskId) => {
    try {
        const token = getToken(); // Retrieve token
        const response = await axios.delete(`${API_URL}/delete/${taskId}`, createAuthHeaders(token));
        return response.data; // Return a success message or the deleted task data
    } catch (error) {
        console.error('Error deleting task:', error.response?.data);
        throw error; // Rethrow the error to handle it in the component
    }
};

// Fetch task by ID
export const fetchTaskById = async (taskId) => {
    try {
        const token = getToken(); // Retrieve token
        const response = await axios.get(`${API_URL}/task/${taskId}`, createAuthHeaders(token));
        return response.data; // Return the fetched task
    } catch (error) {
        console.error('Error fetching task by ID:', error.response?.data);
        throw error; // Rethrow the error to handle it in the component
    }
};
