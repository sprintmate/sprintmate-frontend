// src/utils/analytics.js
import posthog from '../posthog';
import { authUtils } from './authUtils';

const ANALYTICS_ENABLED = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';

// Grab user info from localStorage
const getUserInfo = () => {
  try {
    return authUtils.getUserProfile();
  } catch {
    return null;
  }
};

// Identify user (call this after login)
export const identifyUser = () => {
  if(ANALYTICS_ENABLED) {
    const user = getUserInfo();
    if (user?.email) {
      posthog.identify(user.email, {
        email: user.email,
        role: user.role,
        userId: user?.userId ||  user?.externalId,
      });
    }
  } else {
    console.log('analytics disabled')
  }
 
};

// Track any event
export const trackEvent = (eventName, properties = {}) => {
  console.log('analytics ' , ANALYTICS_ENABLED)
  if(ANALYTICS_ENABLED) {
    console.log('trackEvent ',eventName,properties)
    const user = getUserInfo();
    posthog.capture(eventName, {
      ...properties,
      userId: user?.userId ||  user?.externalId,
      role: user?.role,
      email: user?.email,
    });
  } else {
    console.log('analytics disabled')
  }
 
};

// Call this on logout
export const resetTracking = () => {
  if(ANALYTICS_ENABLED) {
    posthog.reset();
  } else {
    console.log('analytics disabled')
  }
};
