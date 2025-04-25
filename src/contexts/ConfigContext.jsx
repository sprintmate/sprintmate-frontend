import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchConfig, parseCommaSeparated } from '../services/configService';

// Create the context
const ConfigContext = createContext();

/**
 * Provider component for config data
 */
export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const data = await fetchConfig();
        setConfig(data);
        setError(null);
      } catch (err) {
        console.error("Error loading config:", err);
        setError(err.message || 'Failed to load configuration');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
    
    // Refresh config periodically (every hour)
    const intervalId = setInterval(loadConfig, 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Process config data into more usable format
  const processedConfig = React.useMemo(() => {
    if (!config || !config.config) return {};
    
    const { config: configData } = config;
    
    return {
      linkedInUrl: configData.LINKEDIN_URL || '',
      githubUrl: configData.GITHUB_URL || '',
      instagramUrl: configData.INSTAGRAM_URL || '',
      emails: parseCommaSeparated(configData.EMAIL),
      phoneNumbers: parseCommaSeparated(configData.PHONE_NUMBER),
      address: configData.ADDRESS || '',
      tagline: configData.TAGLINE || 'LESS CHAOS , MORE CODE',
      
      // Original raw config
      rawConfig: config
    };
  }, [config]);

  return (
    <ConfigContext.Provider 
      value={{ 
        config: processedConfig,
        loading,
        error,
        rawConfig: config
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

/**
 * Hook to use config data
 */
export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

export default ConfigContext;
