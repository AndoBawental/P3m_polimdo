import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      return Promise.reject(new Error('Request timeout - Server tidak merespons'));
    }

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden access');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 429: // PENANGANAN KHUSUS UNTUK RATE LIMIT
          console.error('Rate limit exceeded');
          return Promise.reject(new Error('Terlalu banyak permintaan. Silakan tunggu beberapa saat.'));
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('API Error:', data?.message || 'Unknown error');
      }
      
      return Promise.reject(error);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error - no response received');
      return Promise.reject(new Error('Tidak dapat terhubung ke server'));
    } else {
      // Something else happened
      console.error('Request setup error:', error.message);
      return Promise.reject(error);
    }
  }
);

export default api;