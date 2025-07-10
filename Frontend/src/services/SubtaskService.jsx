import axios from 'axios';

// Base URL for the backend API
const BASE_URL = 'http://localhost:5000/api/subtask'; // Adjust the URL based on your backend API



// Function to retrieve token from localStorage
const getToken = () => {
    // Try to get token from localStorage, fallback to sessionStorage
    return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Create the authorization header
const createAuth = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Create a new subtask
const createSubtask = async (subtaskData) => {
  try {
    
    const response = await axios.post(
      `${BASE_URL}/create`,
      subtaskData,
      { headers: createAuth() }
    );
    return response.data;
  } catch (err) {
    console.error('Error creating subtask:', err);
    throw new Error('Error creating subtask');
  }
};

// Get all subtasks for a specific task
const getSubtasksByTask = async (taskId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/task/${taskId}`,
      { headers: createAuth() }
    );
    return response.data;
  } catch (err) {
    console.error('Error fetching subtasks:', err);
    throw new Error('Error fetching subtasks');
  }
};

// Get a specific subtask by ID
const getSubtaskById = async (subtaskId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/subtask/${subtaskId}`,
      { headers: createAuth() }
    );
    return response.data;
  } catch (err) {
    console.error('Error fetching subtask:', err);
    throw new Error('Error fetching subtask');
  }
};

// Update a subtask
const updateSubtask = async (subtaskId, updates) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/subtask/${subtaskId}`,
      updates,
      { headers: createAuth() }
    );
    return response.data;
  } catch (err) {
    console.error('Error updating subtask:', err);
    throw new Error('Error updating subtask');
  }
};

// Delete a subtask
const deleteSubtask = async (subtaskId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/subtask/${subtaskId}`,
      { headers: createAuth() }
    );
    return response.data;
  } catch (err) {
    console.error('Error deleting subtask:', err);
    throw new Error('Error deleting subtask');
  }
};
const getProjectCreatorBySubtaskId = async (subtaskId) => {
  try {
    const response = await axios.get(`${BASE_URL}/creator/${subtaskId}`, {
      headers: createAuth(),
    });
    return response.creatorId; // Assuming your API returns the creator's ID
  } catch (err) {
    console.error('Error fetching project creator:', err);
    throw new Error('Error fetching project creator');
  }
};

export {
  createSubtask,
  getSubtasksByTask,
  getSubtaskById,
  updateSubtask,
  deleteSubtask,
  getProjectCreatorBySubtaskId,
};
