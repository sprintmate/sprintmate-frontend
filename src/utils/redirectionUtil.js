// redirectUtils.js

import { authUtils } from './authUtils';
import { fetchUserProfile } from '../api/userService';

export const getPostLoginRedirectPath = async () => {
  try {
    const userData = await fetchUserProfile();
    if (!userData) return '/';

    const role = userData.role || authUtils.getOAuthRole();
    const userId = userData.userId;

    const isComplete = isProfileComplete(userData);

    if (isComplete) {
      if (role === "CORPORATE" && userData.companyProfiles?.length > 0) {
        return "/company/dashboard";
      } else if (role === "DEVELOPER" && userData.developerProfiles?.length > 0) {
        return "/developer/dashboard";
      }

      // fallback dashboard path
      return role === "DEVELOPER" ? "/developer/dashboard" : "/company/dashboard";
    }

    // Incomplete profile redirection
    return role === "CORPORATE"
      ? `/complete-company-profile/${userId}`
      : `/complete-developer-profile/${userId}`;
  } catch (error) {
    console.error("Failed to get user profile for redirection:", error);
    return '/';
  }
};


export const getLoginPage = async (role) => {
  try {
    return role === "DEVELOPER" ? "/developer/login" : "/company/login";
  } catch (error) {
    console.error("Failed to get user profile for redirection:", error);
    return '/';
  }
};

export const isProfileComplete = (userData) => {
  if (!userData) return false;

  const roleProfileMap = {
    CORPORATE: 'companyProfiles',
    DEVELOPER: 'developerProfiles',
  };

  const profileKey = roleProfileMap[userData.role];
  const profiles = userData[profileKey];
  const isComplete = Array.isArray(profiles) && profiles.length > 0;
  console.log(`${userData.role} profile is complete:`, isComplete);
  return isComplete;
};
