import { Navigate, useLocation } from 'react-router-dom';
import { authUtils } from '@/utils/authUtils';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = authUtils.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to the appropriate login page based on the current path
    const userType = location.pathname.includes('company') ? 'company' : 'developer';
    return <Navigate to={`/${userType}/login`} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 