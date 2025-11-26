import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ 
  title = 'INMEDT - Equipamiento Médico Profesional',
  description = 'Proveedor confiable de equipamiento médico profesional en Ecuador. Calidad garantizada para tu práctica.',
  keywords = 'equipamiento médico, productos médicos Ecuador, instrumental médico',
  image = '/og-image.jpg',
  type = 'website',
  canonicalPath
}) => {
  const location = useLocation();
  const currentUrl = `https://inmedt.vercel.app${location.pathname}`;
  const canonicalUrl = canonicalPath ? `https://inmedt.vercel.app${canonicalPath}` : currentUrl;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to update or create meta tag
    const updateMetaTag = (selector, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${selector}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, selector);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update or create canonical link
    const updateCanonical = (href) => {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', href);
    };

    // Primary Meta Tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Open Graph / Facebook
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', `https://inmedt.vercel.app${image}`, true);

    // Twitter
    updateMetaTag('twitter:url', currentUrl, true);
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', `https://inmedt.vercel.app${image}`, true);

    // Canonical URL
    updateCanonical(canonicalUrl);

  }, [title, description, keywords, image, type, currentUrl, canonicalUrl]);

  return null;
};

export default SEO;

