import axios from 'axios';
import { authUtils } from '../utils/authUtils';

const appToken = import.meta.env.VITE_APP_TOKEN; 
const APP_TOKEN_HEADER = 'X-HASHED-TOKEN';
const TIMESTAMP_HEADER = 'X-TIMESTAMP';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const httpInstance = axios.create({
  baseURL: BASE_URL
});

// Helper to compute HMAC SHA256 hash
async function generateHMAC(secret, message) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Modify request interceptor to compute HMAC dynamically
httpInstance.interceptors.request.use(async config => {
  const token = authUtils.getAuthToken();

  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }

  if (!config.skipAuth && token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    const timestamp = Date.now().toString();
    const hash = await generateHMAC(appToken, timestamp);

    config.headers[APP_TOKEN_HEADER] = hash;
    config.headers[TIMESTAMP_HEADER] = timestamp;
  }

  return config;
}, error => Promise.reject(error));

export default httpInstance;
