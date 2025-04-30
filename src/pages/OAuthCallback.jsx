import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        console.log("OAuthCallback Processing: URL =", window.location.href, "Pathname =", location.pathname);
        
        // Extract token from the URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        let token = urlParams.get('token');
        const error = urlParams.get('error');

        // Handle explicit error parameter
        if (error) {
          throw new Error(error);
        }

        // Extract token from URL path if not in query params
        if (!token) {
          const pathParts = location.pathname.split('/');
          const lastPathPart = pathParts[pathParts.length - 1];
          
          // Check if the last part of the URL path looks like a UUID
          // UUID pattern: 8-4-4-4-12 characters (e.g. 4196d52d-0549-4aaf-af75-9575c05d0a9e)
          const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          
          if (uuidPattern.test(lastPathPart)) {
            console.log("Found user ID in URL path:", lastPathPart);
            
            // If we have a UUID in the path, treat it as the user ID and attempt to get a token
            try {
              // Make a request to get an authentication token for this user ID
              const tokenResponse = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/v1/auth/token`,
                { userId: lastPathPart }
              );
              
              if (tokenResponse.data && tokenResponse.data.token) {
                token = tokenResponse.data.token;
                console.log("Retrieved token for user ID:", token);
              }
            } catch (tokenError) {
              console.error("Error getting token for user ID:", tokenError);
              // Continue with the flow, we'll check if token exists later
            }
          }
        }

        // If we still don't have a token, throw an error
        if (!token) {
          throw new Error('No authentication token received');
        }

        console.log("OAuth token received:", token.substring(0, 10) + "...");
        
        // Store the token immediately
        localStorage.setItem("token", token);
        
        try {
          // Fetch user profile data
          console.log("Fetching user profile...");
          const profileResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/v1/users/profile`, 
            { headers: { Authorization: token } }
          );
          
          // Log the full response for debugging
          console.log("Profile response: **************", profileResponse);
          
          // Make sure we have valid data
          if (!profileResponse.data || typeof profileResponse.data !== 'object') {
            throw new Error("Invalid profile data received");
          }
          
          const userData = profileResponse.data;
          console.log("User profile retrieved:", userData);
          
          // Check if developer and company profiles are both empty
          const hasDeveloperProfiles = userData.developerProfiles && 
                                      Array.isArray(userData.developerProfiles) && 
                                      userData.developerProfiles.length > 0;
                                      
          const hasCompanyProfiles = userData.companyProfiles && 
                                    Array.isArray(userData.companyProfiles) && 
                                    userData.companyProfiles.length > 0;
          
          console.log("Has developer profiles:", hasDeveloperProfiles);
          console.log("Has company profiles:", hasCompanyProfiles);
          
          // Store profile data
          localStorage.setItem("userProfile", JSON.stringify(userData));
          
          // Call login function
          login(token);
          
          // If both profile types are empty, we need to redirect to registration
          if (!hasDeveloperProfiles && !hasCompanyProfiles) {
            console.log("Both profile types are empty, redirecting to registration");
            const registrationPath = getRedirectPath(userData);
            
            if (registrationPath) {
              toast.info('Please complete your profile');
              console.log(`Redirecting to ${registrationPath}`);
              
              // Navigate to registration page
              navigate(registrationPath);
              return;
            }
          } else {
            // Check if profile needs completion based on user's role
            const isIncomplete = checkProfileCompleteness(userData);
            
            if (isIncomplete) {
              console.log("Profile is incomplete for user role, redirecting to registration");
              const registrationPath = getRedirectPath(userData);
              
              if (registrationPath) {
                toast.info('Please complete your profile');
                console.log(`Redirecting to ${registrationPath}`);
                
                // Navigate to registration page
                navigate(registrationPath);
                return;
              }
            }
          }
          
          // Profile is complete - redirect to dashboard
          const dashboardPath = getDashboardPath(userData.role);
          
          toast.success('Successfully signed in!');
          console.log(`Redirecting to dashboard: ${dashboardPath}`);
          
          // Use navigate for SPA navigation
          navigate(dashboardPath);
        } catch (profileError) {
          console.error("Error fetching profile:", profileError);
          
          // Log the complete error for debugging
          if (profileError.response) {
            console.error("Error response data:", profileError.response.data);
            console.error("Error response status:", profileError.response.status);
            console.error("Error response headers:", profileError.response.headers);
          } else if (profileError.request) {
            console.error("Error request:", profileError.request);
          } else {
            console.error("Error message:", profileError.message);
          }
            
          // Even if profile fetch fails, try to decode token
          try {
            const tokenPayload = parseJwt(token);
            console.log("Token payload:", tokenPayload);
            
            // Get user ID from token
            const userId = tokenPayload.sub || tokenPayload.userId || tokenPayload.id;
            console.log("User ID from token:", userId);
            
            // Get role from token
            const role = tokenPayload.role || "CORPORATE";
            console.log("Role from token:", role);
            
            // Check if user might need registration based on token data
            if (!tokenPayload.isProfileComplete) {
              // Determine registration path based on role
              let registrationPath;
              if (role === "CORPORATE") {
                registrationPath = `/complete-company-profile/${userId}`;
              } else if (role === "DEVELOPER") {
                registrationPath = `/complete-developer-profile/${userId}`;
              } else {
                registrationPath = '/register';
              }
              
              toast.info('Please complete your profile');
              console.log(`Token indicates incomplete profile, redirecting to: ${registrationPath}`);
              navigate(registrationPath);
              return;
            }
            
            const dashboardPath = getDashboardPath(role);
            
            toast.success('Successfully signed in!');
            console.log(`Using token data to redirect to: ${dashboardPath}`);
            navigate(dashboardPath);
            return;
          } catch (jwtError) {
            console.error("Error parsing JWT:", jwtError);
            throw new Error('Failed to determine user role');
          }
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err.message || 'Authentication failed');
        toast.error(err.message || 'Authentication failed. Please try again.');
        setLoading(false);
      }
    };    processOAuthCallback();
  }, [navigate, login, location.pathname]);  // Helper function to check if profile is complete based on user role
  const checkProfileCompleteness = (userData) => {
    if (!userData) return true; // If no user data, consider profile incomplete
    
    console.log("Checking profile completeness for role:", userData.role);
    
    // Check for corporate users
    if (userData.role === "CORPORATE") {
      const isIncomplete = !(userData.companyProfiles && 
                           Array.isArray(userData.companyProfiles) && 
                           userData.companyProfiles.length > 0);
      console.log("CORPORATE profile is incomplete:", isIncomplete);
      return isIncomplete;
    }
    
    // Check for developer users
    if (userData.role === "DEVELOPER") {
      const isIncomplete = !(userData.developerProfiles && 
                           Array.isArray(userData.developerProfiles) && 
                           userData.developerProfiles.length > 0);
      console.log("DEVELOPER profile is incomplete:", isIncomplete);
      return isIncomplete;
    }
    
    // If the role doesn't match any of the above, consider the profile incomplete
    console.log("Unknown role, considering profile incomplete");
    return true;
  };
  // Helper to get redirect path for incomplete profiles
  const getRedirectPath = (userData) => {
    if (!userData) {
      console.log("No user data, redirecting to generic register page");
      return '/register'; // Fallback to generic registration if no user data
    }
    
    // Extract user ID from available fields
    const userId = userData.userId || userData.id || userData.externalId;
    console.log("Extracted userId for registration:", userId);
    
    if (!userId) {
      console.log("No user ID found, redirecting to generic register page");
      return '/register'; // Fallback to generic registration if no user ID
    }
    
    // Log user role for debugging
    console.log("User role for registration path:", userData.role);
    
    if (userData.role === "CORPORATE") {
      const path = `/complete-company-profile/${userId}`;
      console.log("Generated company registration path:", path);
      return path;
    } else if (userData.role === "DEVELOPER") {
      const path = `/complete-developer-profile/${userId}`;
      console.log("Generated developer registration path:", path);
      return path;
    }
    
    // If no specific role path is found, use a generic registration path
    console.log("No matching role found, redirecting to generic register page");
    return '/register';
  };
  
  // Helper to get dashboard path
  const getDashboardPath = (role) => {
    if (role === "DEVELOPER") {
      return "/developer/dashboard";
    } else {
      return "/company/dashboard";
    }
  };
    // Helper to parse JWT
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (error) {
      console.error("Error parsing JWT:", error);
      return {};
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Authenticating...</h2>
        <p className="text-gray-500 mt-2">Please wait while we complete your sign-in process.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="rounded-full bg-red-100 p-3 text-red-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-700">Authentication Failed</h2>
        <p className="text-gray-500 mt-2">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          onClick={() => navigate('/')}
        >
          Return to Home
        </button>
      </div>
    );
  }

  return null;
};

export default OAuthCallback;