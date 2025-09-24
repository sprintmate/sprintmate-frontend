import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ANALYTICS_CONFIG } from '../config/analytics';

const SEOAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Google Analytics 4 (GA4) integration
    const initializeGA4 = () => {
      const GA_MEASUREMENT_ID = ANALYTICS_CONFIG.GA4_MEASUREMENT_ID;
      
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', GA_MEASUREMENT_ID, {
          page_path: location.pathname + location.search,
          page_title: document.title,
          page_location: window.location.href
        });
      }
    };

    // Google Search Console integration
    const initializeGSC = () => {
      // Add Google Search Console verification meta tag
      const existingTag = document.querySelector('meta[name="google-site-verification"]');
      if (!existingTag) {
        const metaTag = document.createElement('meta');
        metaTag.name = 'google-site-verification';
        metaTag.content = ANALYTICS_CONFIG.GSC_VERIFICATION_CODE;
        document.head.appendChild(metaTag);
      }
    };

    // Enhanced ecommerce tracking for conversions
    const trackPageView = () => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
          page_path: location.pathname + location.search
        });
      }
    };

    // Initialize all tracking
    initializeGA4();
    initializeGSC();
    trackPageView();

    // Track custom events based on page
    const trackCustomEvents = () => {
      const path = location.pathname;
      
      if (path === '/') {
        // Track landing page visits
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'landing_page_view', {
            page_title: 'Home Page',
            page_location: window.location.href
          });
        }
      } else if (path.startsWith('/blog/')) {
        // Track blog post views
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'blog_post_view', {
            page_title: document.title,
            page_location: window.location.href,
            blog_slug: path.split('/blog/')[1]
          });
        }
      } else if (path === '/post-project') {
        // Track project posting page visits
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'project_posting_page_view', {
            page_title: 'Post Project',
            page_location: window.location.href
          });
        }
      }
    };

    trackCustomEvents();
  }, [location]);

  return null;
};

export default SEOAnalytics;
