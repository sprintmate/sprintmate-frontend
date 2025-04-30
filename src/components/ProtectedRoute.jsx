import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token, user, loading, isProfileIncomplete } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is loaded and profile is incomplete
    if (user && !loading && isProfileIncomplete(user)) {
      console.log("Profile incomplete, redirecting from protected route");
      const userId = user.userId || user.externalId;
      
      // Don't redirect if already on a registration page
      if (location.pathname.includes('complete-company-profile') || 
          location.pathname.includes('complete-developer-profile')) {
        return;
      }
      
      // Redirect based on user role
      if (user.role === "CORPORATE") {
        navigate(`/complete-company-profile/${userId}`);
      } else {
        navigate(`/complete-developer-profile/${userId}`);
      }
    }
  }, [user, loading, isProfileIncomplete, navigate, location]);

  if (loading) {
    // Show loading indicator while checking authentication status
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If loading is done, token exists, and we're not redirecting due to incomplete profile,
  // then render the protected component
  return children;
};

export default ProtectedRoute;