import { AnalyticEvents } from '../constants/AnalyticsEvents';
import { trackEvent } from '../utils/analytics';
import httpInstance from './axiosInstance';


  export const fetchDeveloperProfile = async (developerId) => {
    try {
      const url = `/v1/developers/${developerId}`
      const response = await httpInstance.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetchDeveloperProfile :', error);
      throw error;
    }
  };


  export const createDeveloperProfile = async (payload) => {
    try {
      const url = `/v1/developers`
      const response = await httpInstance.post(url,payload);
      trackEvent(AnalyticEvents.PROFILE_CREATED,payload)
      return response.data;
    } catch (error) {
      console.error('Error createDeveloperProfile :', error);
      throw error;
    }
  };