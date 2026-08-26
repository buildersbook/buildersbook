import Link from 'next/link';

export function Wordmark() {
  return (
    <Link className="wordmark" href="/" aria-label="Builder’s Book home">
      Builder&rsquo;s Book
    </Link>
  );
}
