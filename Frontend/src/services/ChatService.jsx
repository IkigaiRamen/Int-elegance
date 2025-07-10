import axios from 'axios';

const API_URL = 'http://localhost:5000/api/chat'; // Adjust the URL as needed

// Create a channel
export const createChannel = async (channelId) => {
  try {
    const response = await axios.post(`${API_URL}/channels`, { channelId });
    return response.data;
  } catch (error) {
    console.error('Error creating channel:', error);
    throw new Error('Failed to create channel');
  }
};

// Send a message to a channel
export const sendMessage = async (channelId, text, userId) => {
  try {
    const response = await axios.post(`${API_URL}/channels/${channelId}/message`, { text, userId });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message');
  }
};

// Generate a token for the user
export const getUserToken = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/token`, { userId });
    return response.data.token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate token');
  }
};

// Upsert users
export const upsertUsers = async (users) => {
  try {
    const response = await axios.post(`${API_URL}/upsert-users`, { users });
    return response.data;
  } catch (error) {
    console.error('Error upserting users:', error);
    throw new Error('Failed to upsert users');
  }
};

// Fetch messages for a channel
export const getMessages = async (channelId) => {
  try {
    const response = await axios.get(`${API_URL}/channels/${channelId}/messages`);
    return response.data.messages; // The response should contain an array of messages
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw new Error('Failed to fetch messages');
  }
};
