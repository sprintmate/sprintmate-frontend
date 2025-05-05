import httpInstance from './axiosInstance';


export const createUser = async (userData) => {
    try {
      const response = await httpInstance.post('/v1/users', userData , {skipAuth : true});
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };


export const generateToken = async (loginData) => {
    try {
      const response = await httpInstance.post('/v1/tokens', loginData);
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