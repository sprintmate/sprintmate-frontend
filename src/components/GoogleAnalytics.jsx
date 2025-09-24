import React, { useEffect } from 'react';

const GoogleAnalytics = ({ trackingId = 'GA_MEASUREMENT_ID' }) => {
  useEffect(() => {
    // Only load analytics in production
    if (process.env.NODE_ENV === 'production' && trackingId !== 'GA_MEASUREMENT_ID') {
      // Load Google Analytics script
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      document.head.appendChild(script1);

      // Initialize Google Analytics
      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${trackingId}', {
          page_title: document.title,
          page_location: window.location.href
        });
      `;
      document.head.appendChild(script2);

      // Track page views on route changes
      const handleRouteChange = () => {
        if (typeof gtag !== 'undefined') {
          gtag('config', trackingId, {
            page_title: document.title,
            page_location: window.location.href
          });
        }
      };

      // Listen for popstate events (back/forward navigation)
      window.addEventListener('popstate', handleRouteChange);

      return () => {
        window.removeEventListener('popstate', handleRouteChange);
      };
    }
  }, [trackingId]);

  return null;
};

// Google Analytics event tracking function
export const trackEvent = (action, category = 'General', label = '', value = 0) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
};

// Google Analytics page view tracking function
export const trackPageView = (page_title, page_location) => {
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: page_title,
      page_location: page_location
    });
  }
};

export default GoogleAnalytics;
