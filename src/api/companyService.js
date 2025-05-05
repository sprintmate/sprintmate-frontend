import httpInstance from './axiosInstance';

export const createCompanyProfile = async (userId,companyData) => {
    try {
      const response = await httpInstance.post(`/v1/users/${userId}/company-profile`, companyData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

