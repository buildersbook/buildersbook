import Link from 'next/link';

type IndexEntryBase = {
  number: string;
  title: string;
};

export type BookIndexEntry = IndexEntryBase & ({
  href: string;
  repositoryUrl?: never;
  state: 'published';
} | {
  href?: never;
  repositoryUrl: string;
  state: 'draft';
} | {
  href?: never;
  repositoryUrl?: never;
  state: 'planned';
});

type BookIndexProps = {
  ariaLabel?: string;
  entries: BookIndexEntry[];
  variant?: 'book' | 'essays';
};

function ChapterTitle({ entry }: { entry: BookIndexEntry }) {
  if (entry.state === 'published') return <Link href={entry.href}>{entry.title}</Link>;
  if (entry.state === 'draft') return <a href={entry.repositoryUrl}>{entry.title}</a>;
  return <span>{entry.title}</span>;
}

export function BookIndex({ ariaLabel = 'Book chapters', entries, variant = 'book' }: BookIndexProps) {
  return (
    <ol className={variant === 'essays' ? 'book-index essay-index' : 'book-index'} aria-label={ariaLabel}>
      {entries.map((entry) => (
        <li className="book-index-row" key={`${entry.number}-${entry.title}`}>
          {variant === 'book' ? <span className="book-index-number mono">{entry.number}</span> : null}
          <span className="book-index-title"><ChapterTitle entry={entry} /></span>
          {variant === 'essays' ? <time className="book-index-number mono" dateTime={entry.number}>{entry.number}</time> : null}
          <span className="book-index-state functional-label">
            {entry.state === 'draft' ? 'Draft · in the repository' : entry.state}
          </span>
        </li>
      ))}
    </ol>
  );
}
