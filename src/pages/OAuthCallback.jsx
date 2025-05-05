import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { authUtils } from '../utils/authUtils';
import { getPostLoginRedirectPath } from '../utils/redirectionUtil';


const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processOAuthCallback = async () => {
      authUtils.removeAuthToken();
      try {
        console.log("OAuthCallback: URL =", window.location.href, "Pathname =", location.pathname);

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        authUtils.setAuthToken(token);
        console.log("OAuth token received:", token.substring(0, 10) + "...");

        let userData = await fetchUserProfile(token);
        console.log("User data received:", userData);

        const role = authUtils.getOAuthRole();
        if (role) userData.role = role;

        updateUserRole(userData.userId, role, token);
        userData = await fetchUserProfile(token);
        authUtils.setUserProfile(userData);
        const redirectPath = getPostLoginRedirectPath(userData);

        if (redirectPath.includes('complete')) {
          toast('Please complete your profile', { icon: 'ℹ️' });
        } else {
          toast.success('Successfully signed in!');
          authUtils.removeOAuthRole();
        }
        
        navigate(redirectPath, { replace: true });
        return;
      } catch (err) {
        const token = authUtils.getAuthToken();
        console.error("Primary profile load failed: ", err , 'token',token);
      } finally {
        setLoading(false);
      }
    };

    processOAuthCallback();
  }, [navigate, login, location.pathname]);

  return loading ? <LoadingView /> : error ? <ErrorView error={error} navigate={navigate} /> : null;
};

export default OAuthCallback;

// ----------------- Helper functions --------------------

const fetchUserProfile = async (token) => {
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/v1/users/profile`, {
    headers: { Authorization: token }
  });
  if (!response.data || typeof response.data !== 'object') throw new Error("Invalid profile data received");
  return response.data;
};


const updateUserRole = async (userId, role, token) => {
  const response = await axios.put(
    `${import.meta.env.VITE_API_BASE_URL}/v1/users/${userId}`,
    { role },
    {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      }
    }
  );

  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Failed to update user role. HTTP status: ${response.status}`);
  }
};


const LoadingView = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-4">
    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
    <h2 className="text-xl font-semibold text-gray-700">Authenticating...</h2>
    <p className="text-gray-500 mt-2">Please wait while we complete your sign-in process.</p>
  </div>
);

const ErrorView = ({ error, navigate }) => (
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
