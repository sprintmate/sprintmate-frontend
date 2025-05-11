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

  export const fetchCompanyProfle = async (companyId) => {
    try {
      const url = `/v1/users/dummy/company-profile/${companyId}`
      const response = await httpInstance.get(url);
      return response.data;
    } catch (error) {
      console.error('fetchCompanyProfle', error);
      throw error;
    }
  };



export const postTask = async (companyId,taskPayload) => {
  try {
    const response = await httpInstance.post(`/v1/company-profiles/${companyId}/tasks`, taskPayload);
    return response.data;
  } catch (error) {
    console.error('Error creating postTask:', error);
    throw error;
  }
};
