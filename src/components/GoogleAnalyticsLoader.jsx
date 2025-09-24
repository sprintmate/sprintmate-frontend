import { useEffect } from 'react';
import { ANALYTICS_CONFIG } from '../config/analytics';

const GoogleAnalyticsLoader = () => {
  useEffect(() => {
    // Load Google Analytics script
    const loadGoogleAnalytics = () => {
      const GA_MEASUREMENT_ID = ANALYTICS_CONFIG.GA4_MEASUREMENT_ID;
      
      // Check if GA is already loaded
      if (window.gtag) {
        return;
      }

      // Create and append the Google Analytics script
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script1);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: false // We'll handle page views manually
      });
    };

    // Load Google Tag Manager (optional - for advanced tracking)
    const loadGoogleTagManager = () => {
      const GTM_ID = ANALYTICS_CONFIG.GTM_ID;
      
      // Check if GTM is already loaded
      if (document.querySelector(`script[src*="googletagmanager.com/gtm.js?id=${GTM_ID}"]`)) {
        return;
      }

      // GTM script
      const gtmScript = document.createElement('script');
      gtmScript.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `;
      document.head.appendChild(gtmScript);

      // GTM noscript
      const gtmNoscript = document.createElement('noscript');
      gtmNoscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      document.body.insertBefore(gtmNoscript, document.body.firstChild);
    };

    // Load Google Search Console verification
    const loadGoogleSearchConsole = () => {
      const GSC_VERIFICATION_CODE = ANALYTICS_CONFIG.GSC_VERIFICATION_CODE;
      
      // Check if verification tag already exists
      const existingTag = document.querySelector('meta[name="google-site-verification"]');
      if (existingTag) {
        return;
      }

      // Add verification meta tag
      const metaTag = document.createElement('meta');
      metaTag.name = 'google-site-verification';
      metaTag.content = GSC_VERIFICATION_CODE;
      document.head.appendChild(metaTag);
    };

    // Initialize all tracking
    loadGoogleAnalytics();
    // loadGoogleTagManager(); // Uncomment if you use GTM
    loadGoogleSearchConsole();
  }, []);

  return null;
};

export default GoogleAnalyticsLoader;
