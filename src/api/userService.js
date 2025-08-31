import { authUtils } from '../utils/authUtils';
import httpInstance from './axiosInstance';
import axios from 'axios';


export const createUser = async (userData) => {
    try {
      const response = await httpInstance.post('/v1/users', userData , {skipAuth : true});
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };


  export const updateUser = async (userId,userData) => {
    try {
      const response = await httpInstance.put(`/v1/users/${userId}`, userData);
      // authUtils.removeUserProfile();
      // authUtils.setUserProfile(fetchUserProfile());
      return response;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

export const generateToken = async (loginData) => {
    try {
      const response = await httpInstance.post('/v1/tokens', loginData,{skipAuth : true});
      return response.data;
    } catch (error) {
      console.error('Error generating token:', error);
      throw error;
    }
  };

  export const fetchUserProfile = async () => {
    try {
      const response = await httpInstance.get('/v1/users/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetchUserProfile :', error);
      throw error;
    }
  };

  export const verifyResetPasswordToken = async (token) => {
    try {
      console.log('verify token');
      const response = await httpInstance.get('/v1/tokens/validate-reset-token');
      return response.data;
    } catch (error) {
      console.error('Error verifyResetPasswordToken :', error);
      throw error;
    }
  };

  export const resetPassword = async (password) => {
    try {
      const response = await httpInstance.post('/v1/users/reset-password', {newPassword:password});
      return response.data;
    } catch (error) {
      console.error('Error resetPassword :', error);
      throw error;
    }
  };

  export const forgotPassword = async (email) => {
    try {
      const response = await httpInstance.post('/v1/users/forgot-password', {email:email} , {skipAuth : true});
      return response.data;
    } catch (error) {
      throw error;
    }
  };

export const verifyUser = async (otp) => {
  try {
    const response = await httpInstance.put('/v1/users/verify', { otp });
    return response;
  } catch (error) {
    throw error;
  }
};

export const resendOtp = async (email) => {
  try {
    const response = await httpInstance.post('/v1/tokens/resend-otp', { email });
    return response;
  } catch (error) {
    throw error;
  }
};