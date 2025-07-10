import axios from 'axios';

const API_URL = 'http://localhost:5000/api/projects'; // Replace with your actual API URL

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

// Create a new project
export const createProject = async (projectData) => {
    const token = getToken();
    const formData = new FormData();

    // Append project data
    formData.append("name", projectData.name);
    formData.append("category", projectData.category);
    formData.append("startDate", projectData.startDate);
    formData.append("endDate", projectData.endDate);
    formData.append("priority", projectData.priority);
    formData.append("description", projectData.description);

    // Append users (assuming it's an array)
    projectData.users.forEach((user) => {
        formData.append("users[]", user);
    });


    try {
        const response = await axios.post(`${API_URL}/create`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating project:", error);
        throw error.response ? error.response.data : error;
    }
};

// Get all projects
export const getAllProjects = async () => {
    const token = getToken();
    try {
        const response = await axios.get(API_URL, createAuthHeaders(token));
        return response.data;
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error.response ? error.response.data : error;
    }
};

// Get a project by ID
export const getProjectById = async (id) => {
    const token=getToken();
    try {
      // Define headers with the Authorization token
      const headers = {
        'Authorization': `Bearer ${token}`, // Attach the token
        'Content-Type': 'application/json',  // Optional, good to specify content type
      };
  
      // Send the GET request to fetch the project by ID
      const response = await axios.get(`${API_URL}/${id}`, { headers });
  
      // Return the response data (project details)
      return response.data;
    } catch (error) {
      // Handle errors here
      console.error("Error fetching project by ID:", error);
      throw error.response ? error.response.data : error;
    }
  };

// Get projects by creator ID
export const getProjectsByCreatorId = async (creatorId) => {
    const token = getToken();
    try {
        const response = await axios.get(`${API_URL}/creator/${creatorId}`, createAuthHeaders(token));
        return response.data;
    } catch (error) {
        console.error("Error fetching projects by creator ID:", error);
        throw error.response ? error.response.data : error;
    }
};

// Get projects by user ID
export const getProjectsByUserId = async () => {
    const token = getToken();
    try {
        const response = await axios.get(`${API_URL}/user`, createAuthHeaders(token));
        return response.data;
    } catch (error) {
        console.error("Error fetching projects by user ID:", error);
        throw error.response ? error.response.data : error;
    }
};

// Edit a project
export const editProject = async (id, projectData, profileImage) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('name', projectData.name);
    formData.append('description', projectData.description);
    // Append other project fields as needed

    if (profileImage) {
        formData.append('profileImage', profileImage);
    }

    try {
        const response = await axios.put(`${API_URL}/${id}`, formData, {
            headers: {
                ...createAuthHeaders(token),
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error editing project:", error);
        throw error.response ? error.response.data : error;
    }
};

// Delete a project by ID
export const deleteProjectById = async (id) => {
    const token = getToken();
    try {
        await axios.delete(`${API_URL}/${id}`, createAuthHeaders(token));
    } catch (error) {
        console.error("Error deleting project:", error);
        throw error.response ? error.response.data : error;
    }
};
