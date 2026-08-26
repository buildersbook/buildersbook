import { BookIndex } from '@/components/book-index';
import { book } from '@/.source/server';

export default function BookIndexPage() {
  const chapters = book.map((entry) => ({
    number: entry.chapter,
    repositoryUrl: `https://github.com/buildersbook/buildersbook/blob/main/${entry.info.fullPath}`,
    state: entry.publicationStatus,
    title: entry.title,
  }));

  return (
    <main id="main-content" className="stage-one-main">
      <p className="functional-label">Volume I</p>
      <h1>The Book</h1>
      <p>Published chapters link to the site. Visible drafts link explicitly to their repository source.</p>
      <BookIndex entries={chapters} />
    </main>
  );
}
