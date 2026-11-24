import Link from 'next/link';

import { ContentShell } from '@/components/content-shell';
import { getMDXComponents } from '@/components/mdx';
import { siteAuthor } from '@/lib/navigation';
import type { essaysSource } from '@/lib/source';

type EssayPage = (typeof essaysSource)['$inferPage'];

export function EssayRenderer({ page }: { page: EssayPage }) {
  const Body = page.data.body;

  return (
    <ContentShell
      description={page.data.description}
      eyebrow={page.data.category}
      metadata={(
        <>
          <span>By {siteAuthor.name}</span>
          <time dateTime={page.data.publishedAt}>{page.data.publishedAt}</time>
        </>
      )}
      title={page.data.title}
    >
      <Body components={getMDXComponents()} />
      <footer className="essay-end">
        <p>Written by <Link href="/about">{siteAuthor.name}</Link>.</p>
        <div className="essay-end-links">
          <Link href="/essays">More essays →</Link>
          <a href="/rss.xml">Subscribe via RSS</a>
        </div>
      </footer>
    </ContentShell>
  );
}
