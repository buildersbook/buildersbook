import Link from 'next/link';

export function Wordmark() {
  return (
    <Link className="wordmark" href="/" aria-label="The Builder’s Book home">
      The Builder&rsquo;s Book
    </Link>
  );
}
