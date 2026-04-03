import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const TENANT_ID = import.meta.env.VITE_TENANT_ID || 'DEFAULT';

const SESSION_CORRELATION_ID = crypto.randomUUID();

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers['X-Tenant-ID'] = TENANT_ID;
  config.headers['X-Correlation-ID'] = SESSION_CORRELATION_ID;

  if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method)) {
    config.headers['Idempotency-Key'] = crypto.randomUUID();
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
