import axios from "axios";

const API_URL = "http://localhost:5000/api/users"; // Replace with your actual API URL

// Utility function to create headers with authorization token
const createAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Function to retrieve token from localStorage
const getToken = () => {
  // Try to get token from localStorage, fallback to sessionStorage
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// Register a new user
export const register = async (firstName, lastName, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      firstName,
      lastName,
      email,
      password,
    });
    return response.data; // Return the token
  } catch (error) {
    throw new Error(error.response.data.message || "Registration failed");
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    // Store the token in localStorage after successful login
    localStorage.setItem("token", response.data.token);
    return response.data; // Return the token
  } catch (error) {
    throw new Error(error.response.data.message || "Login failed");
  }
};

// Logout user
export const logout = async () => {
  const token = getToken(); // Retrieve token from localStorage
  try {
    const response = await axios.post(
      `${API_URL}/logout`,
      null,
      createAuthHeaders(token)
    );
    localStorage.removeItem("token"); // Remove token from localStorage upon logout
    return response.data; // Return logout success message
  } catch (error) {
    throw new Error(error.response.data.message || "Logout failed");
  }
};

// Get user profile by ID
export const getUserById = async (userId) => {
  const token = getToken(); // Retrieve token from localStorage
  try {
    const response = await axios.get(
      `${API_URL}/${userId}`,
      createAuthHeaders(token)
    );
    return response.data; // Return user data
  } catch (error) {
    throw new Error(error.response.data.message || "Failed to retrieve user");
  }
};

// Get current user's profile
export const getCurrentUserProfile = async () => {
  const token = getToken(); // Retrieve token from localStorage
  try {
    const response = await axios.get(
      `${API_URL}/profile`,
      createAuthHeaders(token)
    );
    return response.data; // Return user profile data
  } catch (error) {
    throw new Error(
      error.response.data.message || "Failed to retrieve user profile"
    );
  }
};

// Update user profile
export const updateUserProfile = async (updates) => {
  const token = getToken(); // Retrieve token from localStorage
  try {
    const response = await axios.put(
      `${API_URL}/update`,
      {
        ...updates,
      },
      createAuthHeaders(token)
    );
    return response.data; // Return updated user data
  } catch (error) {
    throw new Error(error.response.data.message || "Update failed");
  }
};
export const getRole = async () => {
  const token = getToken();
  try {
    const response = await axios.get(
      `${API_URL}/role`,
      createAuthHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Failed to get role");
  }
};

// Update user profile picture
// UserService.js
export const updateProfilePicture = async (image) => {
  const token = getToken(); // Retrieve token from localStorage

  const response = await fetch(
    `http://localhost:5000/api/users/profile-picture`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update profile picture");
  }

  return await response.json(); // Return the updated user data
};

// Get all users
export const getAllUsers = async () => {
  const token = getToken(); // Retrieve token from localStorage
  try {
    const response = await axios.get(`${API_URL}`, createAuthHeaders(token));
    return response.data; // Return all users data
  } catch (error) {
    throw new Error(error.response.data.message || "Failed to retrieve users");
  }
};

// Search users by query
export const searchUsers = async (query) => {
  const token = getToken(); // Retrieve token from localStorage
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { query },
      ...createAuthHeaders(token),
    });
    return response.data; // Return search results
  } catch (error) {
    throw new Error(error.response.data.message || "Failed to search users");
  }
};

export const updateBannerPicture = async (userId, image) => {
  const token = getToken(); // Retrieve token from localStorage
  try {
    const response = await axios.put(
      `${API_URL}/banner-picture`,
      {
        userId,
        image,
      },
      createAuthHeaders(token)
    );
    return response.data; // Return updated user data
  } catch (error) {
    throw new Error(
      error.response.data.message || "Failed to update banner picture"
    );
  }
};

export const fetchUserInvitations = async () => {
  const token = getToken(); // Retrieve token from storage
  try {
    const response = await axios.get(`${API_URL}/invitations`, createAuthHeaders(token));
    return response.data.invitations; // Return the invitations array
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch invitations"
    );
  }
};

// Update invitation status
export const updateInvitationStatus = async (invitationId,companyId, action) => {
  const token = getToken(); // Retrieve token from storage
  try {
    const response = await axios.put(
      `${API_URL}/invitation-status`,
      { invitationId,companyId, action },
      createAuthHeaders(token)
    );
    return response.data.message; // Return the success message
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update invitation status"
    );
  }
};

// Send a friend request
export const sendFriendRequest = async (friendId) => {
  const token = getToken(); // Retrieve token from localStorage
  try {
    const response = await axios.post(
      `${API_URL}/friend-request`,
      { friendId },
      createAuthHeaders(token)
    );
    return response.data.message; // Return the success message
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to send friend request"
    );
  }
};

// Accept a friend request
export const acceptFriendRequest = async (requesterId) => {
  const token = getToken(); // Retrieve token from localStorage
  try {
    const response = await axios.put(
      `${API_URL}/friend-request/accept`,
      { requesterId },
      createAuthHeaders(token)
    );
    return response.data.message; // Return the success message
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to accept friend request"
    );
  }
};

// Decline a friend request
export const declineFriendRequest = async (requesterId) => {
  const token = getToken(); // Retrieve token from localStorage
  try {
    const response = await axios.put(
      `${API_URL}/friend-request/decline`,
      { requesterId },
      createAuthHeaders(token)
    );
    return response.data.message; // Return the success message
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to decline friend request"
    );
  }
};

// Remove a friend
export const removeFriend = async (friendId) => {
  const token = getToken(); // Retrieve token from localStorage
  try {
    const response = await axios.put(
      `${API_URL}/friend`,
      { friendId },
      createAuthHeaders(token)
    );
    return response.data.message; // Return the success message
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to remove friend"
    );
  }
};
// Get user friends
export const getUserFriends = async () => {
  const token = getToken(); // Retrieve token from localStorage
  try {
    const response = await axios.get(
      `http://localhost:5000/api/users/friends`, // Endpoint to get friends
      createAuthHeaders(token)
    );
    return response.data; // Return friends list
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to retrieve friends");
  }
};
