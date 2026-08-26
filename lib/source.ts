import { blog, book } from '@/.source/server';
import { loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';

const englishBook = book.filter((entry) => entry.locale === 'en');
const englishBlog = blog.filter((entry) => entry.locale === 'en');

export const bookSource = loader({
  baseUrl: '/book',
  source: toFumadocsSource(englishBook, []),
});

export const blogSource = loader({
  baseUrl: '/essays',
  source: toFumadocsSource(englishBlog, []),
});

export const contentPages = [...bookSource.getPages(), ...blogSource.getPages()].filter(
  (page) => page.data.publicationStatus === 'published',
);
