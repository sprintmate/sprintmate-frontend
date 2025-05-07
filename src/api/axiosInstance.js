import axios from 'axios';
import { authUtils } from '../utils/authUtils';

const appToken = import.meta.env.VITE_APP_TOKEN;
const APP_TOKEN_HEADER = 'X-APP-TOKEN';
const BASE_URL = import.meta.env.VITE_API_BASE_URL


const httpInstance = axios.create({
  baseURL: BASE_URL
});

httpInstance.interceptors.request.use(config => {
  const token = authUtils.getAuthToken();

  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }

  if (!config.skipAuth && token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    config.headers[APP_TOKEN_HEADER] = appToken;
  }
  return config;
}, error => Promise.reject(error));


export default httpInstance;
