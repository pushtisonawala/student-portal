import axios from 'axios';

const API_URL = 'https://student-portal-qvyb.onrender.com/api';

// Add base configuration for axios
axios.defaults.baseURL = API_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (data) => {
  try {
    const response = await axios.post('/auth/register', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProfile = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get('/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
