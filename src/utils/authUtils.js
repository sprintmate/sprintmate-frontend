import CryptoJS from 'crypto-js';
import { identifyUser, resetTracking } from './analytics';

const AUTH_TOKEN_KEY = 'authToken';
const USER_PROFILE_KEY = 'userProfile';
const USER_TYPE_KEY = 'userType';
const OAUTH_ROLE_KEY = 'oauthRole';
const CONFIG_KEY = 'appConfig';

const ENCRYPTION_SECRET = import.meta.env.VITE_ENCRYPTION_SECRET;


if (!ENCRYPTION_SECRET) {
  throw new Error("Missing VITE_ENCRYPTION_SECRET");
}

// Encryption utilities
const encrypt = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_SECRET).toString();
};

const decrypt = (cipherText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, ENCRYPTION_SECRET);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (e) {
    console.error('Decryption failed:', e);
    return null;
  }
};

// LocalStorage wrappers
const setItem = (key, value) => {
  localStorage.setItem(key, encrypt(value));
};

const getItem = (key) => {
  const item = localStorage.getItem(key);
  return item ? decrypt(item) : null;
};

const removeItem = (key) => {
  localStorage.removeItem(key);
};

export const authUtils = {
  // Auth token
  setAuthToken: (token) => setItem(AUTH_TOKEN_KEY, token),
  getAuthToken: () => getItem(AUTH_TOKEN_KEY),
  removeAuthToken: () => removeItem(AUTH_TOKEN_KEY),

  // User profile
  setUserProfile: (profile) => {
    setItem(USER_PROFILE_KEY, profile);
    identifyUser();
  },
  getUserProfile: () => getItem(USER_PROFILE_KEY),
  removeUserProfile: () => removeItem(USER_PROFILE_KEY),

  // App config
  setAppConfig: (config) => setItem(CONFIG_KEY, config),
  getAppConfig: () => getItem(CONFIG_KEY),

  // User type
  setUserType: (type) => setItem(USER_TYPE_KEY, type),
  getUserType: () => getItem(USER_TYPE_KEY),
  removeUserType: () => removeItem(USER_TYPE_KEY),

  // OAuth role
  setOAuthRole: (role) => {
    console.log("Setting OAuth role:", role);
    setItem(OAUTH_ROLE_KEY, role);
  },
  getOAuthRole: () => getItem(OAUTH_ROLE_KEY),
  removeOAuthRole: () => removeItem(OAUTH_ROLE_KEY),

  // Clear specific auth data
  clearAllAuthData: () => {
    authUtils.removeAuthToken();
    authUtils.removeUserProfile();
    authUtils.removeUserType();
    authUtils.removeOAuthRole();
  },

  // Clear everything
  clearAllData: () => {
    localStorage.clear();
    sessionStorage.clear();
    document?.cookie?.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    });
    console.log("cleared all data from session, local");
  },

  isAuthenticated: () => !!authUtils.getAuthToken(),

  logout: () => {
    authUtils.removeAuthToken();
    authUtils.removeUserProfile();
    authUtils.removeOAuthRole();
    resetTracking();
  }
};
