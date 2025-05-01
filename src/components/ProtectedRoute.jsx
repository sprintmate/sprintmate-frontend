import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const defaultIsProfileIncomplete = (user) => {
  if (!user) return true;
  if (user.role === "CORPORATE") {
    return !user.companyProfiles || user.companyProfiles.length === 0;
  }
  if (user.role === "DEVELOPER") {
    return !user.developerProfiles || user.developerProfiles.length === 0;
  }
  return true;
};

const ProtectedRoute = ({ children }) => {
  const { token, user, loading, isProfileIncomplete } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Use context function if available, else fallback
  const checkProfileIncomplete = typeof isProfileIncomplete === 'function'
    ? isProfileIncomplete
    : defaultIsProfileIncomplete;

  useEffect(() => {
    if (user && !loading && checkProfileIncomplete(user)) {
      const userId = user.userId || user.externalId;
      if (
        location.pathname.includes('complete-company-profile') ||
        location.pathname.includes('complete-developer-profile')
      ) {
        return;
      }
      if (user.role === "CORPORATE") {
        navigate(`/complete-company-profile/${userId}`);
      } else {
        navigate(`/complete-developer-profile/${userId}`);
      }
    }
  }, [user, loading, checkProfileIncomplete, navigate, location]);

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

  // Redirect to dashboard if profile is complete and user is on landing or registration page
  if (
    user &&
    !checkProfileIncomplete(user)
  ) {
    // If on landing or registration page, redirect to dashboard
    if (
      location.pathname === '/' ||
      location.pathname.includes('complete-company-profile') ||
      location.pathname.includes('complete-developer-profile')
    ) {
      if (user.role === "CORPORATE") {
        return <Navigate to="/company/dashboard" replace />;
      } else if (user.role === "DEVELOPER") {
        return <Navigate to="/developer/dashboard" replace />;
      }
    }
  }

  // If loading is done, token exists, and we're not redirecting due to incomplete profile,
  // then render the protected component
  return children;
};

export default ProtectedRoute;