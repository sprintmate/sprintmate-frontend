import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import {
  getCompanyProfile,
  clearAuthData,
  getDeveloperProfile,
} from '../services/authService';

import { fetchUserProfile } from '../api/userService';

import { authUtils } from '../utils/authUtils';

import { isProfileComplete } from '../utils/redirectionUtil';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [tokenState, setTokenState] = useState(authUtils.getAuthToken());
  const [user, setUser] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to check if the profile is incomplete
  const isProfileIncomplete = useCallback((userData) => {
    return !isProfileComplete(userData);
  }, []);

  // Fetch user and company profile data
  const fetchUserData = useCallback(async () => {
    const currentToken = authUtils.getAuthToken();
    if (!currentToken) {
      setLoading(false);
      return;
    }

    try {
      const userData = await fetchUserProfile();
      setUser(userData);
      setTokenState(currentToken); // Sync token to state

      if (userData.role === 'CORPORATE') {
        const companyData = await getCompanyProfile(currentToken);
        setCompanyProfile(companyData);
      } 
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message);
      clearAuthData();
      setUser(null);
      setTokenState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login with token or user object
  const login = useCallback((userDataOrToken) => {
    if (typeof userDataOrToken === 'string') {
      localStorage.setItem('token', userDataOrToken);
      setTokenState(userDataOrToken);
    } else if (typeof userDataOrToken === 'object') {
      const { token: newToken } = userDataOrToken;
      setUser(userDataOrToken);
      localStorage.setItem('userProfile', JSON.stringify(userDataOrToken));

      if (newToken) {
        localStorage.setItem('token', newToken);
        setTokenState(newToken);
      }
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    clearAuthData();
    setTokenState(null);
    setUser(null);
    setCompanyProfile(null);
  }, []);

  // Fetch user data on initial load and when token changes
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const value = {
    token: tokenState,
    user,
    loading,
    error,
    companyProfile,
    isAuthenticated: !!tokenState,
    isProfileIncomplete,
    login,
    logout,
    refreshUser: fetchUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access Auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
