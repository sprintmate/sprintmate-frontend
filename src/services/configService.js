import axios from 'axios';

// Cache mechanism to avoid repeated API calls
let configCache = null;
let lastFetchTime = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Fetch configuration data from the API
 * @returns {Promise<Object>} The configuration data
 */
export const fetchConfig = async () => {
  const currentTime = new Date().getTime();
  
  // Return cached data if it's still valid
  if (configCache && lastFetchTime && (currentTime - lastFetchTime < CACHE_DURATION)) {
    console.log("Using cached config data");
    return configCache;
  }
  
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.stackmint.in';
    const response = await axios.get(`${baseUrl}/v1/config`);
    
    // Store the result in cache
    configCache = response.data;
    lastFetchTime = currentTime;
    
    console.log("Fetched fresh config data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching config:", error);
    
    // Return cached data even if expired in case of API error
    if (configCache) {
      console.log("Using expired cached config after fetch error");
      return configCache;
    }
    
    // If no cached data, return empty config
    return {
      config: {
        LINKEDIN_URL: '',
        GITHUB_URL: '',
        INSTAGRAM_URL: '',
        EMAIL: '',
        PHONE_NUMBER: '',
        ADDRESS: '',
        TAGLINE: 'LESS CHAOS , MORE CODE'
      }
    };
  }
};

/**
 * Parse comma-separated values into an array
 * @param {string} value - Comma-separated string
 * @returns {Array<string>} Array of trimmed values
 */
export const parseCommaSeparated = (value) => {
  if (!value) return [];
  return value.split(',').map(item => item.trim());
};

/**
 * Get a specific config value with fallback
 * @param {Object} config - The config object
 * @param {string} key - The config key to retrieve
 * @param {*} fallback - Fallback value if key doesn't exist
 * @returns {*} The config value or fallback
 */
export const getConfigValue = (config, key, fallback = '') => {
  if (!config || !config.config) return fallback;
  return config.config[key] || fallback;
};
