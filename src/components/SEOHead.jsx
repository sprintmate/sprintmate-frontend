import React, { useEffect } from 'react';

const SEOHead = ({
  title = "CodeForContract - Freelance Software Engineers Marketplace",
  description = "Connect with top-tier freelance software engineers and developers. Post projects, find talent, and collaborate securely with our AI-powered matching platform.",
  keywords = "freelance developers, software engineers, hire developers, project outsourcing, remote development, freelance marketplace",
  canonical = "",
  ogImage = "https://codeforcontract.com/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  noindex = false,
  structuredData = null
}) => {
  const baseUrl = "https://codeforcontract.com";
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : `${baseUrl}${window.location.pathname}`;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update or create meta tags
    const updateMetaTag = (name, content, property = false) => {
      const attribute = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update or create link tags
    const updateLinkTag = (rel, href) => {
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    // Basic Meta Tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateLinkTag('canonical', fullCanonical);
    
    // Robots
    if (noindex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow');
    }
    
    // Open Graph Meta Tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:url', fullCanonical, true);
    updateMetaTag('og:image', fullOgImage, true);
    updateMetaTag('og:image:width', '1200', true);
    updateMetaTag('og:image:height', '630', true);
    updateMetaTag('og:site_name', 'CodeForContract', true);
    updateMetaTag('og:locale', 'en_US', true);
    
    // Twitter Card Meta Tags
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', fullOgImage);
    updateMetaTag('twitter:site', '@codeforcontract');
    updateMetaTag('twitter:creator', '@codeforcontract');
    
    // Additional SEO Meta Tags
    updateMetaTag('author', 'CodeForContract');
    updateMetaTag('publisher', 'CodeForContract');
    updateMetaTag('copyright', 'CodeForContract');
    updateMetaTag('theme-color', '#2563eb');
    updateMetaTag('msapplication-TileColor', '#2563eb');

    // Structured Data
    if (structuredData) {
      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      // Add new structured data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [title, description, keywords, fullCanonical, fullOgImage, ogType, twitterCard, noindex, structuredData]);

  return null; // This component doesn't render anything
};

export default SEOHead;
