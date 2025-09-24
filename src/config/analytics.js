// Analytics and SEO Configuration
// Replace these placeholder values with your actual IDs and codes

export const ANALYTICS_CONFIG = {
  // Google Analytics 4 Measurement ID
  GA4_MEASUREMENT_ID: 'G-GM0H5V3L4X', // Replace with your actual GA4 ID
  
  // Google Tag Manager ID (optional)
  GTM_ID: 'GTM-XXXXXXX', // Replace with your actual GTM ID if you use it
  
  // Google Search Console Verification Code
  GSC_VERIFICATION_CODE: 'LjmgPcryNfZxX1PESbns1WFhDGbG-CsiUWSjpb9Gzzk', // Replace with your actual verification code
  
  // Website Configuration
  SITE_URL: 'https://codeforcontract.com',
  SITE_NAME: 'CodeForContract',
  
  // Analytics Events Configuration
  EVENTS: {
    // Custom event names for tracking
    BLOG_POST_VIEW: 'blog_post_view',
    LANDING_PAGE_VIEW: 'landing_page_view',
    PROJECT_POSTING_VIEW: 'project_posting_page_view',
    DEVELOPER_SIGNUP: 'developer_signup',
    COMPANY_SIGNUP: 'company_signup',
    CONTACT_FORM_SUBMIT: 'contact_form_submit',
    COOKIE_CONSENT_ACCEPT: 'cookie_consent_accept',
    COOKIE_CONSENT_DECLINE: 'cookie_consent_decline'
  }
};

// Cookie consent configuration
export const COOKIE_CONFIG = {
  CONSENT_EXPIRY_DAYS: 365, // How long consent is valid
  VERSION: '1.0', // Version for consent tracking
  CATEGORIES: {
    NECESSARY: 'necessary',
    ANALYTICS: 'analytics',
    MARKETING: 'marketing',
    FUNCTIONAL: 'functional'
  }
};

// SEO Configuration
export const SEO_CONFIG = {
  DEFAULT_TITLE: 'CodeForContract - Freelance Software Engineers Marketplace',
  DEFAULT_DESCRIPTION: 'Connect with top-tier freelance software engineers and developers. Post projects, find talent, and collaborate securely with our AI-powered matching platform.',
  DEFAULT_KEYWORDS: 'freelance developers, software engineers, hire developers, project outsourcing, remote development, freelance marketplace',
  DEFAULT_OG_IMAGE: 'https://codeforcontract.com/og-image.jpg',
  DEFAULT_TWITTER_HANDLE: '@codeforcontract'
};

export default ANALYTICS_CONFIG;
