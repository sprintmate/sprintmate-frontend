// src/services/authService.js

import axios from 'axios';

// Storage keys
const TOKEN_KEY = 'auth_token';
const USER_PROFILE_KEY = 'user_profile';
const COMPANY_PROFILE_KEY = 'company_profile';

// Setup axios defaults
const setupAxiosDefaults = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Store authentication token
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
  setupAxiosDefaults(token);
};

// Get stored token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remove token on logout
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  setupAxiosDefaults(null);
};

// Login company with credentials
export const loginCompany = async (email, cred) => {
  try {
    console.log('Attempting login with:', { email, cred: '****' });
    
    const response = await axios.post(
      'https://round-georgianna-sprintmate-8451e6d8.koyeb.app/v1/tokens', 
      {
        email,
        cred
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('Login API response:', response);
    
    if (response.data && response.data.token) {
      console.log('Login successful, token received');
      setToken(response.data.token);
      
      // Store userId if it exists in the response
      if (response.data.userId) {
        const userProfile = {
          userId: response.data.userId,
          email
        };
        setUserProfile(userProfile);
      }
      
      return response.data;
    } else {
      console.error('Invalid response format:', response.data);
      throw new Error('Invalid login response: Token not found in response');
    }
    
  } catch (error) {
    console.error('Login failed:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

// Store user profile data
export const setUserProfile = (profileData) => {
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profileData));
  
  // Also store company profile separately for easier access
  if (profileData.companyProfiles && profileData.companyProfiles.length > 0) {
    const companyProfile = profileData.companyProfiles[0];
    // Make sure to include the companyId with the expected property name
    const enhancedCompanyProfile = {
      ...companyProfile,
      companyId: companyProfile.externalId // Add alias for consistent property naming
    };
    localStorage.setItem(COMPANY_PROFILE_KEY, JSON.stringify(enhancedCompanyProfile));
  }
};

// Get stored user profile
export const getUserProfile = () => {
  const profile = localStorage.getItem(USER_PROFILE_KEY);
  return profile ? JSON.parse(profile) : null;
};

// Get stored company profile
export const getCompanyProfile = () => {
  const profile = localStorage.getItem(COMPANY_PROFILE_KEY);
  return profile ? JSON.parse(profile) : null;
};

// Clear all auth data
export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_PROFILE_KEY);
  localStorage.removeItem(COMPANY_PROFILE_KEY);
  setupAxiosDefaults(null);
};

// Fetch user profile from API
export const fetchUserProfile = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    setupAxiosDefaults(token);
    const response = await axios.get('/v1/users/profile');
    
    if (response.data) {
      setUserProfile(response.data);
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Initialize auth service on app load
export const initializeAuth = () => {
  const token = getToken();
  if (token) {
    setupAxiosDefaults(token);
    return true;
  }
  return false;
};
