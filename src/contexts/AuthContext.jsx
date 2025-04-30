import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  getToken, 
  getUserProfile, 
  getCompanyProfile,
  clearAuthData, 
  initializeAuth,
  fetchUserProfile,
  setToken
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);
  
  // Check if profile is incomplete
  const isProfileIncomplete = useCallback((userData) => {
    if (!userData) return false;
    
    if (userData.role === "CORPORATE" && 
        (!userData.companyProfiles || userData.companyProfiles.length === 0)) {
      return true;
    }
    
    if (userData.role === "DEVELOPER" && 
        (!userData.developerProfiles || userData.developerProfiles.length === 0)) {
      return true;
    }
    
    return false;
  }, []);

  // Fetch current user data
  const fetchUserData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/v1/users/profile`, {
        headers: {
          Authorization: token
        }
      });

      const userData = response.data;
      console.log("User data fetched:", userData);
      
      setUser(userData);
      
      // Store user profile in localStorage for offline access
      localStorage.setItem("userProfile", JSON.stringify(userData));

      // Check if profile needs completion
      if (isProfileIncomplete(userData)) {
        console.log("Profile is incomplete, needs registration");
        // Store a flag indicating profile needs completion
        localStorage.setItem("needsProfileCompletion", "true");
        
        // Store the user ID for the registration page
        localStorage.setItem("userId", userData.userId || userData.externalId);
      } else {
        localStorage.removeItem("needsProfileCompletion");
      }

    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch user data");
      // Clear token if the request fails due to invalid token
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [token, isProfileIncomplete]);

  // Login user with token
  const login = useCallback((newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }, []);

  // Logout user
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("needsProfileCompletion");
    localStorage.removeItem("userId");
    setToken(null);
    setUser(null);
  }, []);

  // Effect to fetch user data when token changes
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Value to provide through context
  const value = {
    token,
    user,
    loading,
    error,
    companyProfile,
    isProfileIncomplete,
    login,
    logout,
    refreshUser: fetchUserData,
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        companyProfile,
        isAuthenticated: !!token, 
        loading,
        login,
        logout,
        refreshUserProfile: fetchUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};