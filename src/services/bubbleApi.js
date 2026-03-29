import axios from 'axios';

const BUBBLE_API_BASE_URL = 'https://your-app-name.bubbleapps.io/api/1.1/obj';
const API_TOKEN = 'YOUR_BUBBLE_API_TOKEN';

const apiClient = axios.create({
  baseURL: BUBBLE_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const fetchMorningAssignments = async () => {
  try {
    const response = await apiClient.get('/inspection'); // Replace with your Bubble table name
    return response.data.response.results;
  } catch (error) {
    console.error("Error fetching morning preload:", error);
    throw error;
  }
};

// Add this to your bubbleApi.js
export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post('/login', {
      email: email,
      password: password,
    });
    return response.data; // This returns the user token
  } catch (error) {
    throw error;
  }
};