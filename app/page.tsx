import Link from 'next/link';

import { Wordmark } from '@/components/wordmark';
import { pageMetadata } from '@/lib/metadata';
import { siteAuthor } from '@/lib/navigation';

export const metadata = pageMetadata({ path: '/' });

export default function HomePage() {
  return (
    <main id="main-content" className="landing-page">
      <section className="landing-hero" aria-labelledby="landing-title">
        <h1 id="landing-title"><Wordmark /></h1>
        <p className="landing-description">An open curriculum for engineers who ship production software by orchestrating coding agents. Written in public. Failures included.</p>
        <p className="landing-byline"><Link href="/about">Written by {siteAuthor.name}.</Link></p>
        <span className="landing-status functional-label">
          <span>The book is in planning.</span>{' '}
          <span>Essays come first.</span>
        </span>
      </section>
      <nav className="landing-paths" aria-label="Start reading">
        <Link className="landing-first-read" href="/essays/agent-enforcement-hooks">Start here: We Built Agent Enforcement Hooks and Then Killed Them →</Link>
        <Link href="/essays">All essays →</Link>
      </nav>
    </main>
  );
}
