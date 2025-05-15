// src/posthog.js
import posthog from 'posthog-js';
import { getUTMParams } from './utils/utm';

const API_KEY = import.meta.env.VITE_POST_HOG;
const API_HOST = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

// Extract UTM params

const utmData = getUTMParams();


// Initialize PostHog
posthog.init(API_KEY, {
  api_host: 'https://app.posthog.com', // Default for cloud-hosted
  autocapture: true, // automatically tracks pageviews, button clicks etc.
  capture_pageview: true,
  persistence: 'localStorage',
  loaded: (ph) => {
    ph.register(utmData);
  },
});

// Export it for use elsewhere
export default posthog;