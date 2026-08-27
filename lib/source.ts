import { book, essays } from '@/.source/server';
import { loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';

const englishBook = book.filter((entry) => entry.locale === 'en');
const englishEssays = essays.filter((entry) => entry.locale === 'en');

export const bookSource = loader({
  baseUrl: '/book',
  source: toFumadocsSource(englishBook, []),
});

export const essaysSource = loader({
  baseUrl: '/essays',
  source: toFumadocsSource(englishEssays, []),
});

export const allPagesIncludingUnpublished = [...bookSource.getPages(), ...essaysSource.getPages()];

export const publishedPages = allPagesIncludingUnpublished.filter(
  (page) => page.data.publicationStatus === 'published',
);
