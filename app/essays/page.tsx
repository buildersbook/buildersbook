import { pageMetadata } from '@/lib/metadata';

import { BookIndex, type BookIndexEntry } from '@/components/book-index';
import { publishedPages } from '@/lib/source';

export const metadata = pageMetadata({
  path: '/essays',
  title: 'Essays',
  description: "Builder's Book field notes and post-mortems.",
});

export default function EssaysIndexPage() {
  const essays = publishedPages
    .filter((page) => page.url.startsWith('/essays/'))
    .map((page): BookIndexEntry => {
      if (!('category' in page.data) || page.data.publicationStatus !== 'published') {
        throw new Error(`${page.url}: expected published essay frontmatter.`);
      }
      return {
        number: page.data.publishedAt,
        title: page.data.title,
        href: page.url,
        state: 'published',
      };
    });

  return (
    <main id="main-content" className="stage-one-main">
      <p className="functional-label">Field notes and post-mortems</p>
      <h1>Essays</h1>
      <p>Essays from the work of building production software with coding agents.</p>
      <BookIndex ariaLabel="Essays" entries={essays} variant="essays" />
    </main>
  );
}
