import type { MetadataRoute } from 'next';

import { siteDescription, siteTitle } from '@/lib/metadata';
import { themeColors } from '@/lib/theme-colors';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteTitle,
    short_name: 'Builder’s Book',
    description: siteDescription,
    lang: 'en',
    start_url: '/',
    scope: '/',
    display: 'browser',
    background_color: themeColors.light,
    theme_color: themeColors.light,
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
