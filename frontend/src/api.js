import axios from 'axios';

const API_URL = 'https://student-portal-qvyb.onrender.com/api';

// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true; // Important for CORS

// Create axios instance with custom config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (data) => {
  try {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

export const getProfile = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axiosInstance.get('/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};
