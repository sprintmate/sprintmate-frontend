// import React, { useEffect } from 'react';
// import { Navigate, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import { isProfileComplete } from '../utils/redirectionUtil';

// const defaultIsProfileIncomplete = (user) => {
//   if (!user) return true;
//   console.log("defaultIsProfileIncomplete" , user)
//   return !isProfileComplete(user);
// };

// const ProtectedRoute = ({ children }) => {
//   const { token, user, loading, isProfileIncomplete } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const checkProfileIncomplete =
//     typeof isProfileIncomplete === 'function'
//       ? isProfileIncomplete
//       : defaultIsProfileIncomplete;

//   useEffect(() => {
//     if (!loading && user && checkProfileIncomplete(user)) {
//       const userId = user.userId || user.externalId;
//       const isOnCompletionPage =
//         location.pathname.includes('complete-company-profile') ||
//         location.pathname.includes('complete-developer-profile');

//       if (!isOnCompletionPage) {
//         const redirectPath =
//           user.role === 'CORPORATE'
//             ? `/complete-company-profile/${userId}`
//             : `/complete-developer-profile/${userId}`;

//         navigate(redirectPath, { replace: true });
//       }
//     }
//   }, [user, loading, checkProfileIncomplete, navigate, location]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (!token) {
//     return <Navigate to="/" replace />;
//   }

//   if (
//     user &&
//     !checkProfileIncomplete(user) &&
//     (location.pathname === '/' ||
//       location.pathname.includes('complete-company-profile') ||
//       location.pathname.includes('complete-developer-profile'))
//   ) {
//     const dashboardPath =
//       user.role === 'CORPORATE'
//         ? '/company/dashboard'
//         : '/developer/dashboard';

//     return <Navigate to={dashboardPath} replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;


// ----------- ///////////////////////////////////////////// SIMPLIFIED ROUTE ////////////////////////////--------------//

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authUtils } from '../utils/authUtils';
import { fetchUserProfile } from '../api/userService';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [userValid, setUserValid] = useState(false);

  useEffect(() => {
    const validateUser = async () => {
      try {
        console.log("fetched user from protected guard validateUser ")
        const token = authUtils.getAuthToken();
        if (!token) {
          setLoading(false);
          return;
        }
        const user = await fetchUserProfile();
        console.log("fetched user from protected guard ", user)
        authUtils.setUserProfile(user); // Optional: update stored profile
        setUserValid(true);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        authUtils.clearAllData(); // Clear invalid token
      } finally {
        setLoading(false);
      }
    };

    validateUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!userValid) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

