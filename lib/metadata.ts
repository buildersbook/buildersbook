import type { Metadata } from 'next';

import { absoluteUrl, SITE_URL } from './discovery';

export const siteName = "The Builder's Book";
export const siteTitle = 'The Builder’s Book';
export const siteDescription = 'An open curriculum for engineers who build production software with coding agents.';

const titleTemplate = `%s · ${siteTitle}`;
const feedTypes = {
  'application/atom+xml': '/atom.xml',
  'application/rss+xml': '/rss.xml',
};

function pageAlternates(canonical?: string): Metadata['alternates'] {
  return { canonical, types: feedTypes };
}

const openGraphDefaults = {
  siteName,
  locale: 'en_US',
};

// See the share-card image open item in PROJECT_STATE.md.
const twitterCard = 'summary';

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: siteTitle, template: titleTemplate },
  description: siteDescription,
  alternates: pageAlternates(),
  openGraph: {
    ...openGraphDefaults,
    title: siteTitle,
    description: siteDescription,
    type: 'website',
  },
  twitter: { card: twitterCard },
};

type PageMetadataOptions = {
  path?: string;
  title?: string;
  description?: string;
  article?: { publishedTime?: string };
};

export function pageMetadata({ path, title, description = siteDescription, article }: PageMetadataOptions): Metadata {
  const canonical = path === undefined ? undefined : absoluteUrl(path);
  const socialTitle = title ? titleTemplate.replace('%s', title) : siteTitle;
  const social = { ...openGraphDefaults, title: socialTitle, description, url: canonical };

  return {
    ...(title ? { title } : {}),
    description,
    alternates: pageAlternates(canonical),
    openGraph: article
      ? { ...social, type: 'article', publishedTime: article.publishedTime }
      : { ...social, type: 'website' },
    twitter: { card: twitterCard, title: socialTitle, description },
  };
}
