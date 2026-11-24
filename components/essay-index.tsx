import Link from 'next/link';

export type EssayIndexEntry = { date: string; title: string; href: string };

export function EssayIndex({ entries }: { entries: EssayIndexEntry[] }) {
  return (
    <ol className="essay-index" aria-label="Essays">
      {entries.map((entry) => (
        <li className="essay-index-row" key={entry.href}>
          <Link className="essay-index-title" href={entry.href}>{entry.title}</Link>
          <time className="essay-index-date mono" dateTime={entry.date}>{entry.date}</time>
        </li>
      ))}
    </ol>
  );
}
