import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main id="main-content" className="not-found-page">
      <p className="functional-label">404 · Page not found</p>
      <h1>This page isn&rsquo;t in the book.</h1>
      <p>The address may have changed, or the chapter may not be published yet.</p>
      <nav aria-label="404 recovery">
        <Link href="/">Home</Link>
        <Link href="/book">Book</Link>
        <Link href="/essays">Essays</Link>
      </nav>
    </main>
  );
}
