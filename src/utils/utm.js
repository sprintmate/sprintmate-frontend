// src/utils/utm.js
export const getUTMParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get('utm_source') || 'direct',
      utm_medium: urlParams.get('utm_medium') || 'none',
      utm_campaign: urlParams.get('utm_campaign') || 'none',
      utm_term: urlParams.get('utm_term') || 'none',
      utm_content: urlParams.get('utm_content') || 'none',
    };
  };
  