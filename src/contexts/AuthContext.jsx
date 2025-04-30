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
import { authUtils } from '../utils/authUtils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(authUtils.getAuthToken());
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
    console.log("Fetching user data with token:", token);
    console.log("AuthUtils token:", authUtils.getAuthToken());
    const currentToken = authUtils.getAuthToken();
    if (!currentToken) {
      setLoading(false);
      return;
    }

    try {
      const userData = await fetchUserProfile(currentToken);
      setUser(userData);
      setToken(currentToken);
      
      if (userData.role === "CORPORATE") {
        const companyData = await getCompanyProfile(currentToken);
        setCompanyProfile(companyData);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.message);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  }, [token]);

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