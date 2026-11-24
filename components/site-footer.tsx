import Link from 'next/link';

import { repositoryUrl, siteAuthor } from '@/lib/navigation';
import { siteName } from '@/lib/metadata';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p>{siteName} · by {siteAuthor.name}</p>
        <nav aria-label="Footer">
          <Link href="/about">About</Link>
          <Link href="/essays">Essays</Link>
          <a href="/rss.xml">RSS</a>
          <a href={repositoryUrl}>GitHub</a>
        </nav>
        <p>Code MIT · Content CC BY-SA 4.0</p>
      </div>
    </footer>
  );
}
