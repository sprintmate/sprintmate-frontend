import httpInstance from './axiosInstance';

import { authUtils } from '../utils/authUtils';


export const fetchAppConfig = async () => {
    const localConfig = authUtils.getAppConfig();
    if (localConfig) {
        console.log("fetch from local storage ",localConfig)
      return localConfig;
    }
  
    try {
      const response = await httpInstance.get('/v1/config', { skipAuth: true });
      return response;
    } catch (error) {
      console.error('Error fetching app config:', error);
      throw error;
    }
  };

  export const fetchAppConfigWithCache = async() => {
    const cachedConfig = authUtils.getAppConfig();
    if (cachedConfig){
      return cachedConfig;
    }
    const responseFromApi = await fetchAppConfig();
    authUtils.setAppConfig(responseFromApi);
    return responseFromApi;
  }