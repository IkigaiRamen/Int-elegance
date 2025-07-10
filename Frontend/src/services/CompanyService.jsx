import axios from 'axios';

const API_URL = 'http://localhost:5000/api/companies'; // Adjust the URL according to your backend setup

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

// Update the company logo
export const updateCompanyLogo = async (companyId, logo) => {
  const token = getToken();

  try {
    const response = await axios.put(
      `${API_URL}/logo`,
      { logo, companyId }, // Send both logo and companyId in the body
      { 
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Return the response data
  } catch (error) {
    console.error("Error updating company logo:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};


// Create a new company
export const createCompany = async (companyData) => {
  const token = getToken();
  console.log('Token:', token); // Log the token to verify its value

  // Send company data directly in the body (no FormData)
  try {
    const response = await axios.post(API_URL, companyData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // Ensure the server expects JSON
      },
    });

    console.log(response); // Log the response from the API
    return response.data;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error; // Handle errors
  }
};

// Get all companies
export const getCompanies = async () => {
  const token = getToken();
  const response = await axios.get(API_URL, createAuthHeaders(token));
  return response.data;
};

// Get a company by ID
export const getCompanyById = async (companyId) => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/${companyId}`, createAuthHeaders(token));
  return response.data;
};

// Update a company
export const updateCompany = async (companyId, companyData, logoFile) => {
  const token = getToken();
  const formData = new FormData();
  if (logoFile) {
    formData.append('file', logoFile); // Append new logo file if provided
  }
  Object.keys(companyData).forEach(key => {
    formData.append(key, companyData[key]); // Append other updated company details
  });

  const response = await axios.put(`${API_URL}/${companyId}`, formData, {
    ...createAuthHeaders(token),
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Delete a company
export const deleteCompany = async (companyId) => {
  const token = getToken();
  const response = await axios.delete(`${API_URL}/${companyId}`, createAuthHeaders(token));
  return response.data;
};

// Assign user to company
export const assignUserToCompany = async (userId, email) => {
  const token = getToken();
  const response = await axios.post(`${API_URL}/AddEmployee`, { userId, email }, createAuthHeaders(token));
  return response.data;
};

// Get employees of a company
export const getCompanyEmployees = async () => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/Company/employees`, createAuthHeaders(token));
  return response.data;
};

// Get companies by creator ID
export const getCompaniesByCreatorId = async () => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/Company`, createAuthHeaders(token));
  return response.data;
};

// Remove a company employee
export const removeCompanyEmployee = async (employeeId) => {
  const token = getToken(); // Retrieve the token from localStorage/sessionStorage

  try {
    const response = await axios.delete(
      `${API_URL}/Company/employees/`,
      {
        ...createAuthHeaders(token),
        data: { employeeId }, // Send the employeeId in the request body
      }
    );

    return response.data; // Return the API response
  } catch (error) {
    console.error('Error removing company employee:', error);
    throw error; // Handle errors in the calling function
  }
};

// Stats routes

