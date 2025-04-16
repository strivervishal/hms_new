import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api; // Add this line to fix the issue

// API Functions
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    if (error.response?.headers['content-type']?.includes('text/html')) {
      console.error('Unexpected HTML response:', error.response.data);
      throw { message: 'Unexpected server error' };
    }
    throw error.response?.data || { message: 'Failed to fetch user data' };
  }
};

export const getPatientProfile = async () => {
  try {
    const response = await api.get('/api/auth/getPatientProfile'); // Ensure the endpoint matches the backend
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch patient profile' };
  }
};

export const updatePatientProfile = async (profileData) => {
  try {
    const response = await api.put('/patients/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update patient profile' };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
