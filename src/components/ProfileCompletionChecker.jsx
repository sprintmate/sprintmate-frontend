import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { isProfileIncomplete } from '../utils/oauthHelper';
import { authUtils } from '../utils/authUtils';

/**
 * Component that checks if a user's profile is complete
 * and redirects to registration pages if needed
 */
const ProfileCompletionChecker = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  
  // Skip check for registration pages and public routes
  const isRegistrationPage = 
    location.pathname.includes('complete-company-profile') || 
    location.pathname.includes('complete-developer-profile');
  
  const isPublicRoute = 
    location.pathname === '/' || 
    location.pathname.includes('login') || 
    location.pathname.includes('signup') ||
    location.pathname.includes('oauth');
  
  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        // Skip check for registration pages and public routes
        if (isRegistrationPage || isPublicRoute) {
          setChecking(false);
          return;
        }
        
        // Only check if user is logged in
        const token = authUtils.getAuthToken();
        if (!token) {
          setChecking(false);
          return;
        }
        
        console.log("ProfileCompletionChecker: Checking profile...");
        
        // Make a fresh API call to ensure we have the latest profile data
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/v1/users/profile`, 
          { headers: { Authorization: token } }
        );
        
        const userData = response.data;
        console.log("Fresh profile data:", userData);
        authUtils.setUserProfile(userData);
        
        // Explicitly check both arrays regardless of role
        const hasDeveloperProfiles = userData.developerProfiles && 
                                    Array.isArray(userData.developerProfiles) && 
                                    userData.developerProfiles.length > 0;
        
        const hasCompanyProfiles = userData.companyProfiles && 
                                  Array.isArray(userData.companyProfiles) && 
                                  userData.companyProfiles.length > 0;
        
        console.log("Profile check:", {
          role: userData.role,
          hasDeveloperProfiles,
          hasCompanyProfiles,
          developerProfilesLength: userData.developerProfiles?.length,
          companyProfilesLength: userData.companyProfiles?.length
        });
        
        // Determine if profile is incomplete based on role
        let isIncomplete = false;
        if (userData.role === "CORPORATE" && !hasCompanyProfiles) {
          console.log("Company profile is incomplete");
          isIncomplete = true;
        } else if (userData.role === "DEVELOPER" && !hasDeveloperProfiles) {
          console.log("Developer profile is incomplete"); 
          isIncomplete = true;
        }
        
        if (isIncomplete) {
          const userId = userData.userId || userData.id || userData.externalId;
          
          // Construct redirect path
          const redirectPath = userData.role === 'DEVELOPER' 
            ? `/complete-developer-profile/${userId}`
            : `/complete-company-profile/${userId}`;
            
          console.log(`Profile is incomplete, redirecting to: ${redirectPath}`);
          toast.info('Please complete your profile to continue');
          navigate(redirectPath);
        }
      } catch (error) {
        console.error("Error checking profile completion:", error);
      } finally {
        setChecking(false);
      }
    };
    
    checkProfileCompletion();
  }, [navigate, location.pathname, isRegistrationPage, isPublicRoute]);
  
  if (checking && !isPublicRoute && !isRegistrationPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default ProfileCompletionChecker;
