// redirectUtils.js

import { authUtils } from './authUtils';

export const getPostLoginRedirectPath = (userData) => {
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
  if (role === "CORPORATE") {
    return `/complete-company-profile/${userId}`;
  } else {
    return `/complete-developer-profile/${userId}`;
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
