import Link from 'next/link';
import type { Metadata } from 'next';

import { Wordmark } from '@/components/wordmark';
import { repositoryUrl } from '@/lib/navigation';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <main id="main-content" className="landing-page">
      <section className="landing-hero" aria-labelledby="landing-title">
        <h1 id="landing-title"><Wordmark /></h1>
        <p>An open curriculum for engineers who ship production software by orchestrating coding agents. Written in public. Failures included.</p>
        <span className="functional-label">Volume I · In progress</span>
      </section>
      <section className="landing-paths" aria-label="Start reading">
        <article>
          <p className="functional-label">The Book · Read in order</p>
          <h2><Link href="/book">Explore the curriculum →</Link></h2>
          <p>A serialized curriculum about specifications, review, failure, and working in public.</p>
        </article>
        <article>
          <p className="functional-label">The Essays · Standalone</p>
          <h2><Link href="/essays">Read field notes →</Link></h2>
          <p>Post-mortems and practical notes that keep the record visible.</p>
        </article>
      </section>
      <section className="landing-draft surface-strip">
        <span className="functional-label">Chapter planned · Not yet published</span>
        <a href={`${repositoryUrl}/blob/main/content/book/sample-chapter.mdx`}>View the sample chapter draft in the repository</a>
      </section>
    </main>
  );
}
