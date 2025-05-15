// src/utils/analytics.js
import posthog from '../posthog';
import { authUtils } from './authUtils';

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
  const user = getUserInfo();
  if (user?.email) {
    posthog.identify(user.email, {
      email: user.email,
      role: user.role,
      userId: user?.userId ||  user?.externalId,
    });
  }
};

// Track any event
export const trackEvent = (eventName, properties = {}) => {
  console.log('trackEvent ',eventName,properties)
  const user = getUserInfo();
  posthog.capture(eventName, {
    ...properties,
    userId: user?.userId ||  user?.externalId,
    role: user?.role,
    email: user?.email,
  });
};

// Call this on logout
export const resetTracking = () => {
  posthog.reset();
};
