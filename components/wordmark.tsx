import Link from 'next/link';

export function Wordmark({ showIcon = false }: { showIcon?: boolean }) {
  return (
    <Link className="wordmark" href="/" aria-label="The Builder’s Book home">
      {showIcon ? (
        <svg
          aria-hidden="true"
          focusable="false"
          className="header-mark"
          viewBox="0 0 60.5 57.7"
          fill="currentColor"
        >
          <path d="M26.2 16.5H34.6V43H26.2Z" />
          <path d="M19.5 17.6H24.4V10.4H11.1V49H24.4V41.8H19.5Z" />
          <path d="M41.2 41.8H36.4V49H49.7V10.4H36.4V17.6H41.2Z" />
        </svg>
      ) : null}
      The Builder&rsquo;s Book
    </Link>
  );
}
