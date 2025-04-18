import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setToken, fetchUserProfile, clearAuthData } from '../../services/authService';
// ...existing imports...

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const url = import.meta.env.VITE_API_BASE_URL 

    try {
      // Clear any existing auth data before login
      clearAuthData();
      
      // 1. Login and get token
      const response = await axios.post(`${url}/v1/tokens`, { 
        email, 
        cred: password 
      });
      
      if (response.data && response.data.token) {
        // 2. Store the token
        setToken(response.data.token);
        
        // 3. Fetch user profile data using the token
        const profileData = await fetchUserProfile();
        
        // 4. Redirect based on user role
        if (profileData.role === 'CORPORATE') {
          navigate('/dashboard/company');
        } else if (profileData.role === 'DEVELOPER') {
          navigate('/dashboard/developer');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Invalid login response');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ...existing render code...
};

export default LoginForm;
