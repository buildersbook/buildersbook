import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/lib/discovery';

const explicitlyAllowedBots = ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'PerplexityBot'] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...explicitlyAllowedBots.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
