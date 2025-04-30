/**
 * Utility functions for OAuth flow and profile validation
 */

/**
 * Check if user profile is incomplete based on role and profile data
 * @param {Object} userData - User profile data from API
 * @returns {boolean} - True if profile is incomplete, false otherwise
 */
export const isProfileIncomplete = (userData) => {
  console.log("Checking if profile is incomplete:", userData);
  
  if (!userData) return false;
  
  // Check if role is CORPORATE and companyProfiles is empty
  if (userData.role === "CORPORATE") {
    const hasCompanyProfiles = userData.companyProfiles && 
                              Array.isArray(userData.companyProfiles) && 
                              userData.companyProfiles.length > 0;
    
    console.log("Company profile check:", { 
      role: userData.role, 
      hasProfiles: hasCompanyProfiles,
      profiles: userData.companyProfiles 
    });
    
    return !hasCompanyProfiles;
  }
  
  // Check if role is DEVELOPER and developerProfiles is empty
  if (userData.role === "DEVELOPER") {
    const hasDeveloperProfiles = userData.developerProfiles && 
                                Array.isArray(userData.developerProfiles) && 
                                userData.developerProfiles.length > 0;
    
    console.log("Developer profile check:", { 
      role: userData.role, 
      hasProfiles: hasDeveloperProfiles,
      profiles: userData.developerProfiles 
    });
    
    return !hasDeveloperProfiles;
  }
  
  return false;
};

/**
 * Extract user ID from different possible locations in user data
 * @param {Object} userData - User profile data from API
 * @returns {string|null} - User ID or null if not found
 */
export const extractUserId = (userData) => {
  if (!userData) return null;
  
  return userData.userId || userData.externalId || userData.id;
};

/**
 * Get registration path based on user role and ID
 * @param {Object} userData - User profile data from API
 * @returns {string|null} - Registration path or null if not needed
 */
export const getRegistrationPath = (userData) => {
  if (!isProfileIncomplete(userData)) return null;
  
  const userId = extractUserId(userData);
  if (!userId) return null;
  
  if (userData.role === "CORPORATE") {
    return `/complete-company-profile/${userId}`;
  } else if (userData.role === "DEVELOPER") {
    return `/complete-developer-profile/${userId}`;
  }
  
  return null;
};
