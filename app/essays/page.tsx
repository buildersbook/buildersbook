import { BookIndex, type BookIndexEntry } from '@/components/book-index';
import { repositoryUrl } from '@/lib/navigation';
import { blogSource } from '@/lib/source';

export default function EssaysIndexPage() {
  const posts = blogSource.getPages().map((page): BookIndexEntry => {
    const entry = {
      number: page.data.publishedAt,
      title: page.data.title,
    };

    if (page.data.publicationStatus === 'published') {
      return { ...entry, href: `/essays/${page.slugs.join('/')}`, state: 'published' };
    }

    if (page.data.publicationStatus === 'draft') {
      return {
        ...entry,
        repositoryUrl: `${repositoryUrl}/blob/main/${page.data.info.fullPath}`,
        state: 'draft',
      };
    }

    return { ...entry, state: 'planned' };
  });

  return (
    <main id="main-content" className="stage-one-main">
      <p className="functional-label">Field notes and post-mortems</p>
      <h1>Essays</h1>
      <p>Published essays link to the site. Visible drafts link explicitly to their repository source.</p>
      <BookIndex ariaLabel="Essays" entries={posts} />
    </main>
  );
}
