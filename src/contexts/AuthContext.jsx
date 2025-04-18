import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [user, setUser] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        const hasToken = initializeAuth();
        
        if (hasToken) {
          // Try to get stored profile data first
          const storedUser = getUserProfile();
          const storedCompany = getCompanyProfile();
          
          if (storedUser) {
            setUser(storedUser);
            setCompanyProfile(storedCompany);
            setIsAuthenticated(true);
          } else {
            // If no stored profile, fetch it from API
            try {
              const profileData = await fetchUserProfile();
              setUser(profileData);
              
              if (profileData.companyProfiles?.length > 0) {
                setCompanyProfile(profileData.companyProfiles[0]);
              }
              
              setIsAuthenticated(true);
            } catch (error) {
              console.error("Error fetching profile on init:", error);
              clearAuthData();
              setIsAuthenticated(false);
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  // Login function - properly clears previous data
  const login = (token, userData) => {
    // Clear any existing auth data
    clearAuthData();
    
    // Set the new token
    setToken(token);
    
    // Set user data
    if (userData) {
      setUser(userData);
      
      if (userData.companyProfiles?.length > 0) {
        setCompanyProfile(userData.companyProfiles[0]);
      }
    }
    
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    clearAuthData();
    setUser(null);
    setCompanyProfile(null);
    setIsAuthenticated(false);
  };

  // Refresh user profile
  const refreshUserProfile = async () => {
    try {
      setLoading(true);
      const profileData = await fetchUserProfile();
      setUser(profileData);
      
      if (profileData.companyProfiles?.length > 0) {
        setCompanyProfile(profileData.companyProfiles[0]);
      }
      
      return profileData;
    } catch (error) {
      console.error("Error refreshing profile:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        companyProfile,
        isAuthenticated, 
        loading,
        login,
        logout,
        refreshUserProfile
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