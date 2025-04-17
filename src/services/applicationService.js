import axios from 'axios';
import { getToken } from './authService';

const url = import.meta.env.VITE_API_BASE_URL;

// Helper to set up authorization headers
const getHeaders = () => {
  const token = getToken();
  return {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  };
};

// Withdraw an application
export const withdrawApplication = async (taskId, applicationId) => {
  try {
    const response = await axios.post(
      `${url}/v1/tasks/${taskId}/applications/${applicationId}/withdraw`,
      {},
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error withdrawing application:', error);
    throw error;
  }
};

// Get application details
export const getApplicationDetails = async (applicationId) => {
  try {
    const response = await axios.get(
      `${url}/v1/applications/${applicationId}`,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error getting application details:', error);
    throw error;
  }
};

// Get all applications
export const getApplications = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(
      `${url}/v1/applications?page=${page}&size=${size}`,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error getting applications:', error);
    throw error;
  }
};
