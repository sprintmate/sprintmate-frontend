import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setToken, fetchUserProfile, clearAuthData } from '../../services/authService';
import { generateToken } from '../../api/userService';
// ...existing imports...

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const ENABLE_OTP_VERIFY = import.meta.env.VITE_ENABLE_OTP_VERIFICATION === 'true' ;


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const url = import.meta.env.VITE_API_BASE_URL;

    console.log("Login attempt for:", email);

    try {
      // Clear any existing auth data before login
      clearAuthData();

      // 1. Login and get token

      const payload = {
        email,
        cred: password
      };

      const response = await generateToken(payload)
      console.log('response generateToken', response)


      if (response?.token) {
        console.log('inside if block ', response)
        authUtils.setAuthToken(response.token);
      }

      if (ENABLE_OTP_VERIFY) {
        if (!response.isVerified) {
          navigate('/verify', {
            state: {
              email: payload.email
            }
          });
        }
      }


      if (response && response.token) {
        const token = response.token;

        // 2. Store the token - ensure it has Bearer prefix for API calls
        const success = setToken(token);

        if (!success) {
          setError("Failed to store authentication token");
          setLoading(false);
          return;
        }

        try {
          // 3. Fetch user profile data immediately after successful login
          const profileData = await fetchUserProfile();

          // 4. Store user profile data for later use
          storeUserProfile(profileData);

          console.log("Profile data stored in localStorage");

          // 5. Redirect based on user role
          if (profileData.role === 'CORPORATE') {
            navigate('/company/dashboard');
          } else if (profileData.role === 'DEVELOPER') {
            navigate('/dashboard/developer');
          } else {
            navigate('/dashboard');
          }
        } catch (profileError) {
          console.error("Error fetching profile:", profileError);

          setError("Login successful but couldn't load your profile. Redirecting to dashboard...");

          // Default to company dashboard if we can't determine role
          setTimeout(() => {
            navigate('/company/dashboard');
          }, 2000);
        }
      } else {
        setError('Invalid login response - no token received');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.message ||
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ...existing render code...
};

export default LoginForm;
