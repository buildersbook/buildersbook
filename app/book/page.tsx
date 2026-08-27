import { BookIndex, type BookIndexEntry } from '@/components/book-index';
import { repositoryUrl } from '@/lib/navigation';
import { allPagesIncludingUnpublished } from '@/lib/source';

function assertNever(value: never): never {
  throw new Error(`Unhandled publication status: ${String(value)}`);
}

export default function BookIndexPage() {
  const chapters = allPagesIncludingUnpublished
    .filter((page) => page.url.startsWith('/book/'))
    .map((page): BookIndexEntry => {
    if (!('chapter' in page.data)) throw new Error(`${page.url}: expected book frontmatter.`);
    const entry = {
      number: page.data.chapter,
      title: page.data.title,
    };

    const status = page.data.publicationStatus;
    switch (status) {
      case 'published':
        return { ...entry, href: `/book/${page.slugs.join('/')}`, state: 'published' };
      case 'draft':
        return {
          ...entry,
          repositoryUrl: `${repositoryUrl}/blob/main/${page.data.info.fullPath}`,
          state: 'draft',
        };
      case 'planned':
        return { ...entry, state: 'planned' };
      default:
        return assertNever(status);
    }
    });

  return (
    <main id="main-content" className="stage-one-main">
      <p className="functional-label">Volume I</p>
      <h1>The Book</h1>
      <p>Published chapters link to the site. Visible drafts link explicitly to their repository source.</p>
      <BookIndex entries={chapters} />
    </main>
  );
}
