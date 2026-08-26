import Link from 'next/link';

type BookIndexEntry = {
  href?: string;
  number: string;
  repositoryUrl?: string;
  state: 'draft' | 'planned' | 'published';
  title: string;
};

function ChapterTitle({ entry }: { entry: BookIndexEntry }) {
  if (entry.state === 'published' && entry.href) return <Link href={entry.href}>{entry.title}</Link>;
  if (entry.state === 'draft' && entry.repositoryUrl) {
    return <a href={entry.repositoryUrl}>{entry.title}</a>;
  }
  return <span>{entry.title}</span>;
}

export function BookIndex({ entries }: { entries: BookIndexEntry[] }) {
  return (
    <ol className="book-index" aria-label="Book chapters">
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
