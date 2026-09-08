import React, { useEffect } from 'react';

const SITE_URL = 'https://messiallgoals.com';
const DEFAULT_TITLE = 'Messi All Goals - Watch Every Lionel Messi Goal & Assist (2004-2026) | HD Videos';
const DEFAULT_DESC =
  'Messi All Goals: Watch all 900+ Lionel Messi goals and 400+ assists in HD quality. Messi total goals: Barcelona (672), PSG (32), Inter Miami (34+), Argentina (112). Complete timeline with coordinates, xG, and goalkeepers!';
const DEFAULT_KEYWORDS =
  'Messi 900 goals, Messi 400 assists, Messi total goals, Messi last goal, Messi career goals, Messi all goals, Messi goal counter, Messi goals list, Messi goals history, Messi goals timeline, Lionel Messi, Messi goals, Messi assists, Barcelona goals, PSG Messi, Inter Miami Messi, Argentina Messi, football highlights, Messi career, Messi statistics, Messi videos, Messi free kicks, Messi hat tricks, Messi Champions League goals';
const DEFAULT_IMAGE = 'https://messiallgoals.com/share/home.jpg?v=3';

interface SEOHeadProps {
  title?: string | null;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'video.other';
  goalData?: {
    title: string;
    opponent?: string;
    competition?: string;
    date?: string;
    videoUrl?: string;
  };
}

function setMeta(attr: 'name' | 'property', key: string, content?: string) {
  if (!content) return;
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    tag.setAttribute('data-seo', '');
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function setLink(rel: string, href?: string) {
  if (!href) return;
  let link = document.head.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    link.setAttribute('data-seo', '');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function setJsonLd(data: object) {
  document.head.querySelectorAll('script[data-seo-ld]').forEach((el) => el.remove());
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-seo-ld', '');
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = DEFAULT_DESC,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  goalData,
}) => {
  const finalTitle = title ? `${title} | Messi All Goals` : DEFAULT_TITLE;
  const finalUrl = url || window.location.href;

  useEffect(() => {
    document.title = finalTitle;
    setMeta('name', 'title', finalTitle);
    setMeta('name', 'description', description);
    setMeta('name', 'keywords', keywords);
    setMeta('name', 'author', 'Messi All Goals');
    setMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setLink('canonical', finalUrl);

    // OpenGraph
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', finalUrl);
    setMeta('property', 'og:title', finalTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:site_name', 'Messi All Goals');

    // Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', finalTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);

    // Schema.org Structured Data
    const schemaData: any = {
      '@context': 'https://schema.org',
      '@type': goalData ? 'VideoObject' : 'WebPage',
      name: finalTitle,
      url: finalUrl,
      image: image,
      description: description,
      inLanguage: 'en',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Messi All Goals',
        url: `${SITE_URL}/`,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Messi All Goals',
        url: `${SITE_URL}/`,
      },
    };

    if (goalData) {
      schemaData.uploadDate = goalData.date ? goalData.date.split('/').reverse().join('-') : '2024-01-01';
      schemaData.contentUrl = goalData.videoUrl || finalUrl;
      schemaData.embedUrl = finalUrl;
    }

    setJsonLd(schemaData);
  }, [finalTitle, description, keywords, image, finalUrl, type, goalData]);

  return null;
};
