import { BookIndex, type BookIndexEntry } from '@/components/book-index';
import { repositoryUrl } from '@/lib/navigation';
import { essaysSource } from '@/lib/source';

function assertNever(value: never): never {
  throw new Error(`Unhandled publication status: ${String(value)}`);
}

export default function EssaysIndexPage() {
  const essays = essaysSource.getPages().map((page): BookIndexEntry => {
    const entry = {
      number: page.data.publishedAt ?? 'Unscheduled',
      title: page.data.title,
    };

    const status = page.data.publicationStatus;
    switch (status) {
      case 'published':
        return { ...entry, href: `/essays/${page.slugs.join('/')}`, state: 'published' };
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
      <p className="functional-label">Field notes and post-mortems</p>
      <h1>Essays</h1>
      <p>Published essays link to the site. Visible drafts link explicitly to their repository source.</p>
      <BookIndex ariaLabel="Essays" entries={essays} />
    </main>
  );
}
