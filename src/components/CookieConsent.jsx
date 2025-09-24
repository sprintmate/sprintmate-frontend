import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, Check, AlertCircle } from 'lucide-react';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const checkConsent = () => {
      try {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
          setShowBanner(true);
          return;
        }
        
        const parsedConsent = JSON.parse(consent);
        if (parsedConsent && typeof parsedConsent === 'object' && parsedConsent.timestamp) {
          // Check if consent is not too old (optional: you can set an expiry)
          const consentDate = new Date(parsedConsent.timestamp);
          const now = new Date();
          const daysDiff = (now - consentDate) / (1000 * 60 * 60 * 24);
          
          // Consent is valid for 1 year (optional)
          if (daysDiff < 365) {
            setShowBanner(false);
            // Initialize tracking based on stored preferences
            initializeTracking(parsedConsent);
          } else {
            // Consent expired, show banner again
            localStorage.removeItem('cookieConsent');
            setShowBanner(true);
          }
        } else {
          // Invalid consent data, show banner
          localStorage.removeItem('cookieConsent');
          setShowBanner(true);
        }
      } catch (error) {
        console.error('Error checking cookie consent:', error);
        // If parsing fails, clear invalid data and show the banner
        localStorage.removeItem('cookieConsent');
        setShowBanner(true);
      }
    };

    // Add a small delay to ensure localStorage is available
    const timer = setTimeout(checkConsent, 100);
    return () => clearTimeout(timer);
  }, []);

  const saveConsentToStorage = (consentData) => {
    try {
      localStorage.setItem('cookieConsent', JSON.stringify(consentData));
      console.log('Cookie consent saved:', consentData);
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    saveConsentToStorage(allAccepted);
    setShowBanner(false);
    // Here you would typically initialize analytics and other tracking
    initializeTracking(allAccepted);
  };

  const handleDecline = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    saveConsentToStorage(onlyNecessary);
    setShowBanner(false);
    // Only initialize necessary cookies
    initializeTracking(onlyNecessary);
  };

  const handleSavePreferences = () => {
    const preferences = {
      ...cookiePreferences,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    saveConsentToStorage(preferences);
    setShowBanner(false);
    setShowSettings(false);
    initializeTracking(preferences);
  };

  const initializeTracking = (preferences) => {
    // Initialize analytics if accepted
    if (preferences.analytics) {
      // Initialize Google Analytics, PostHog, etc.
      console.log('Analytics tracking initialized');
    }
    
    // Initialize marketing cookies if accepted
    if (preferences.marketing) {
      // Initialize marketing pixels, etc.
      console.log('Marketing tracking initialized');
    }
    
    // Initialize functional cookies if accepted
    if (preferences.functional) {
      // Initialize functional features
      console.log('Functional features initialized');
    }
  };

  const togglePreference = (type) => {
    if (type === 'necessary') return; // Cannot toggle necessary cookies
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            {/* Cookie Icon and Main Content */}
            <div className="flex items-start gap-4 flex-1">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Cookie className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  We use cookies to enhance your experience
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We use cookies to improve your browsing experience, serve personalized content, 
                  and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. 
                  You can customize your preferences or learn more in our{' '}
                  <a href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Customize
              </button>
              <button
                onClick={handleDecline}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60"
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Cookie Preferences
                  </h2>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Necessary Cookies */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">Necessary Cookies</h3>
                        <p className="text-sm text-gray-600">Required for basic website functionality</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-500">Always Active</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      These cookies are essential for the website to function properly. They enable basic 
                      features like page navigation, access to secure areas, and form submissions.
                    </p>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">Analytics Cookies</h3>
                        <p className="text-sm text-gray-600">Help us understand how visitors interact with our website</p>
                      </div>
                      <button
                        onClick={() => togglePreference('analytics')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          cookiePreferences.analytics ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            cookiePreferences.analytics ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      These cookies collect information about how visitors use our website, such as which 
                      pages are visited most often and if they get error messages from web pages.
                    </p>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">Marketing Cookies</h3>
                        <p className="text-sm text-gray-600">Used to track visitors across websites for advertising</p>
                      </div>
                      <button
                        onClick={() => togglePreference('marketing')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          cookiePreferences.marketing ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            cookiePreferences.marketing ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      These cookies are used to track visitors across websites to display relevant and 
                      engaging advertisements.
                    </p>
                  </div>

                  {/* Functional Cookies */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">Functional Cookies</h3>
                        <p className="text-sm text-gray-600">Enable enhanced functionality and personalization</p>
                      </div>
                      <button
                        onClick={() => togglePreference('functional')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          cookiePreferences.functional ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            cookiePreferences.functional ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      These cookies enable enhanced functionality and personalization, such as remembering 
                      your preferences and login information.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="flex-1 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Preferences
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsent;
