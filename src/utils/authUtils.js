// Auth token management utilities
const AUTH_TOKEN_KEY = 'authToken';
const USER_PROFILE_KEY = 'userProfile';
const USER_TYPE_KEY = 'userType';
const OAUTH_ROLE_KEY = 'oauthRole';

export const authUtils = {
  // Token management
  setAuthToken: (token) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  getAuthToken: () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  removeAuthToken: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  // User profile management
  setUserProfile: (profile) => {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  },

  getUserProfile: () => {
    const profile = localStorage.getItem(USER_PROFILE_KEY);
    return profile ? JSON.parse(profile) : null;
  },

  removeUserProfile: () => {
    localStorage.removeItem(USER_PROFILE_KEY);
  },

  // User type management
  setUserType: (type) => {
    localStorage.setItem(USER_TYPE_KEY, type);
  },

  getUserType: () => {
    return localStorage.getItem(USER_TYPE_KEY);
  },

  removeUserType: () => {
    localStorage.removeItem(USER_TYPE_KEY);
  },

  // OAuth role management
  setOAuthRole: (role) => {
    console.log("Setting OAuth role:", role);
    localStorage.setItem(OAUTH_ROLE_KEY, role);
  },

  getOAuthRole: () => {
    return localStorage.getItem(OAUTH_ROLE_KEY);
  },

  removeOAuthRole: () => {
    localStorage.removeItem(OAUTH_ROLE_KEY);
  },

  // Clear all auth related data
  clearAllAuthData: () => {
    this.removeAuthToken();
    this.removeUserProfile();
    this.removeUserType();
    this.removeOAuthRole();
  },

  clearAllData: () => {
    localStorage.clear();
    sessionStorage.clear();
    document?.cookie?.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    });
    console.log("cleared all data from session,local");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },

  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_PROFILE_KEY);
    localStorage.removeItem(OAUTH_ROLE_KEY);
  }
}; 