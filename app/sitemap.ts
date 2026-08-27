import type { MetadataRoute } from 'next';

import { buildSitemapEntries } from '@/lib/discovery';

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries();
}
