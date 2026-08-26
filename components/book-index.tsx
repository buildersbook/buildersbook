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
};

function ChapterTitle({ entry }: { entry: BookIndexEntry }) {
  if (entry.state === 'published') return <Link href={entry.href}>{entry.title}</Link>;
  if (entry.state === 'draft') return <a href={entry.repositoryUrl}>{entry.title}</a>;
  return <span>{entry.title}</span>;
}

export function BookIndex({ ariaLabel = 'Book chapters', entries }: BookIndexProps) {
  return (
    <ol className="book-index" aria-label={ariaLabel}>
      {entries.map((entry) => (
        <li className="book-index-row" key={`${entry.number}-${entry.title}`}>
          <span className="book-index-number mono">{entry.number}</span>
          <span className="book-index-title"><ChapterTitle entry={entry} /></span>
          <span className="book-index-state functional-label">
            {entry.state === 'draft' ? 'Draft · in the repository' : entry.state}
          </span>
        </li>
      ))}
    </ol>
  );
}
