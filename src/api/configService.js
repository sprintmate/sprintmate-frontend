import httpInstance from './axiosInstance';

import { authUtils } from '../utils/authUtils';


export const fetchAppConfig = async () => {
    const localConfig = authUtils.getAppConfig();
    if (localConfig) {
        console.log("fetch from local storage ",localConfig)
      return localConfig;
    }
  
    try {
      const response = await httpInstance.get('/v1/config', { skipAuth: true } as any);
      const config = response.data;
      authUtils.setAppConfig(config);
      return config;
    } catch (error) {
      console.error('Error fetching app config:', error);
      throw error;
    }
  };