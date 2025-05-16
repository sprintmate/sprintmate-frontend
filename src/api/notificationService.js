import { AnalyticEvents } from '../constants/AnalyticsEvents';
import { trackEvent } from '../utils/analytics';
import httpInstance from './axiosInstance';



export const sendMessage = async (payload) => {
    const url = "/v1/notifications/send/feedback";
    try {
      const response = await httpInstance.post(url, payload,{ skipAuth: true });
      trackEvent(AnalyticEvents.SEND_MESSAGE,payload)
      return response;
    } catch (error) {
      console.error('Error fetching app config:', error);
      throw error;
    }
  };