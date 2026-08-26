import { BookIndex, type BookIndexEntry } from '@/components/book-index';
import { repositoryUrl } from '@/lib/navigation';
import { bookSource } from '@/lib/source';

export default function BookIndexPage() {
  const chapters = bookSource.getPages().map((page): BookIndexEntry => {
    const entry = {
      number: page.data.chapter,
      title: page.data.title,
    };

    if (page.data.publicationStatus === 'published') {
      return { ...entry, href: `/book/${page.slugs.join('/')}`, state: 'published' };
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
      <p className="functional-label">Volume I</p>
      <h1>The Book</h1>
      <p>Published chapters link to the site. Visible drafts link explicitly to their repository source.</p>
      <BookIndex entries={chapters} />
    </main>
  );
}
