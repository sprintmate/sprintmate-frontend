import axios from 'axios';
import { authUtils } from '../utils/authUtils';

const httpInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

httpInstance.interceptors.request.use(config => {
  const token = authUtils.getAuthToken();
  if (!config.skipAuth && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

export default httpInstance;
