import httpInstance from './axiosInstance';



export const sendMessage = async (payload) => {
    const url = "/v1/notifications/send/feedback";
    try {
      const response = await httpInstance.post(url, payload,{ skipAuth: true });
      return response;
    } catch (error) {
      console.error('Error fetching app config:', error);
      throw error;
    }
  };