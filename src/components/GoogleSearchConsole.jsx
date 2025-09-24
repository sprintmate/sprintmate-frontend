import { useEffect } from 'react';

const GoogleSearchConsole = () => {
  useEffect(() => {
    // Google Search Console verification meta tag
    const addVerificationTag = () => {
      // Check if meta tag already exists
      const existingTag = document.querySelector('meta[name="google-site-verification"]');
      if (existingTag) {
        return;
      }

      // Add Google Search Console verification meta tag
      const metaTag = document.createElement('meta');
      metaTag.name = 'google-site-verification';
      metaTag.content = 'YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE'; // Replace with your actual verification code
      document.head.appendChild(metaTag);
    };

    // Add the verification tag
    addVerificationTag();

    // Google Search Console tracking (optional - for enhanced analytics)
    const addGSCScript = () => {
      // This is optional - Google Search Console doesn't require a script tag
      // But you can add additional tracking if needed
      console.log('Google Search Console integration initialized');
    };

    addGSCScript();
  }, []);

  return null; // This component doesn't render anything
};

export default GoogleSearchConsole;
