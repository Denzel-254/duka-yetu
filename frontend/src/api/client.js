import axios from 'axios';

// Get the correct API URL for Codespace
const getApiUrl = () => {
  // Check if running in Codespace
  if (import.meta.env.VITE_CODESPACE_NAME) {
    return `https://${import.meta.env.VITE_CODESPACE_NAME}-8001.${import.meta.env.VITE_GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}/api/v1`;
  }
  // Fallback to environment variable or localhost
  return import.meta.env.VITE_API_URL || 'http://localhost:8001/api/v1';
};

const API_BASE = getApiUrl();

console.log('🔗 API URL:', API_BASE);

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.config?.url, error.response?.status, error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;