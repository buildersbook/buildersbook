import { blog, book } from '@/.source/server';

import type { PublicationStatus } from './schemas';

export type ContentCollection = 'blog' | 'book';

export type ContentRegistryEntry = {
  collection: ContentCollection;
  contentId: string;
  locale: string;
  publicationStatus: PublicationStatus;
  slug: string;
  title: string;
  translationOf: string | null;
  translationStatus: string;
  url: string;
};

function slugFromPath(path: string): string {
  return path.replace(/\.(?:md|mdx)$/, '').replace(/\/index$/, '');
}

export const contentRegistry: ContentRegistryEntry[] = [
  ...book.map((entry) => {
    const slug = slugFromPath(entry.info.path);
    return {
      collection: 'book' as const,
      contentId: entry.contentId,
      locale: entry.locale,
      publicationStatus: entry.publicationStatus,
      slug,
      title: entry.title,
      translationOf: entry.translationOf,
      translationStatus: entry.translationStatus,
      url: `/book/${slug}`,
    };
  }),
  ...blog.map((entry) => {
    const slug = slugFromPath(entry.info.path);
    return {
      collection: 'blog' as const,
      contentId: entry.contentId,
      locale: entry.locale,
      publicationStatus: entry.publicationStatus,
      slug,
      title: entry.title,
      translationOf: entry.translationOf,
      translationStatus: entry.translationStatus,
      url: `/essays/${slug}`,
    };
  }),
];

export const englishContent = contentRegistry.filter((entry) => entry.locale === 'en');
export const publishedEnglishContent = englishContent.filter(
  (entry) => entry.publicationStatus === 'published',
);
