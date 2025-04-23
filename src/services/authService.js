// src/services/authService.js

import axios from 'axios';

const TOKEN_KEY = 'auth_token';

// Ensure token is stored with Bearer prefix if needed
export const setToken = (token) => {
  try {
    // Make sure token has the Bearer prefix for API calls
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    localStorage.setItem('authToken', formattedToken);
    return true;
  } catch (error) {
    console.error("Error storing auth token:", error);
    return false;
  }
};

// Get token with proper format
export const getToken = () => {
  try {
    return localStorage.getItem('authToken');
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

// Store user profile data in localStorage for easy access
export const storeUserProfile = (profileData) => {
  try {
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    return true;
  } catch (error) {
    console.error("Error storing user profile:", error);
    return false;
  }
};

// Get stored user profile
export const getUserProfile = () => {
  try {
    const profileData = localStorage.getItem('userProfile');
    return profileData ? JSON.parse(profileData) : null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

// Get company profile from stored user profile
export const getCompanyProfile = () => {
  try {
    const userProfile = getUserProfile();
    if (userProfile && userProfile.companyProfiles && userProfile.companyProfiles.length > 0) {
      return userProfile.companyProfiles[0];
    }
    return null;
  } catch (error) {
    console.error("Error getting company profile:", error);
    return null;
  }
};

// Fetch user profile with better error handling and logging
export const fetchUserProfile = async () => {
  try {
    // Try to get from localStorage first
    const storedProfile = getUserProfile();
    if (storedProfile) {
      console.log("Using profile from localStorage");
      return storedProfile;
    }

    const token = getToken();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    
    if (!token) {
      console.error("No auth token available for profile fetch");
      throw new Error("Authentication required");
    }
    
    console.log("Fetching profile from API:", `${apiBaseUrl}/v1/users/profile`);
    
    const response = await axios.get(`${apiBaseUrl}/v1/users/profile`, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data) {
      console.log("Profile API response received successfully");
      // Store profile in localStorage for future use
      storeUserProfile(response.data);
      return response.data;
    } else {
      throw new Error("Invalid profile data received");
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Clear all auth data when logging out
export const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userProfile');
};

// Initialize authentication on app load
export const initializeAuth = () => {
  const token = getToken();
  if (token) {
    axios.defaults.headers.common['Authorization'] = token;
    return true;
  }
  return false;
};


