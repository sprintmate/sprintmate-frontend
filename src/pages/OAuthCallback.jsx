import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { authUtils } from '@/utils/authUtils';

const OAuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get token from URL
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const role = authUtils.getOAuthRole();

        if (!token) {
          throw new Error('No token found in URL');
        }

        if (!role) {
          throw new Error('No role found in localStorage');
        }

        // Store token
        authUtils.setAuthToken(token);

        // Get user profile
        const profileResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/v1/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log("Profile response:", profileResponse);

        if (!profileResponse.data) {
          throw new Error('Failed to fetch user profile');
        }

        // Store user profile
        authUtils.setUserProfile(profileResponse.data);

        // Update user role
        const updateRoleResponse = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/v1/users/${profileResponse.data.userId}`,
          {
            role: role === 'company' ? 'CORPORATE' : 'DEVELOPER'
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        // Clear the oauthRole from localStorage
        // authUtils.removeOAuthRole();

        // Redirect based on role
        if (role === 'company') {
          navigate('/company/dashboard');
        } else {
          navigate('/developer/dashboard');
        }

      } catch (error) {
        console.error('OAuth callback error:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    handleOAuthCallback();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Completing authentication...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuthCallback; 