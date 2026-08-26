import type { ReactNode } from 'react';

function safeId(id: string): string {
  return id.toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

export function Footnote({ id, number = '1' }: { id: string; number?: string }) {
  const anchorId = safeId(id);
  return (
    <sup className="footnote-ref" id={`fnref-${anchorId}`}>
      <a href={`#fn-${anchorId}`} aria-label={`Go to footnote ${number}`}>
        {number}
      </a>
    </sup>
  );
}

export function Footnotes({ children }: { children: ReactNode }) {
  return (
    <section className="footnotes" aria-labelledby="footnotes-heading">
      <h2 id="footnotes-heading">Notes</h2>
      <ol>{children}</ol>
    </section>
  );
}

export function Citation({ children, href, id }: { children: ReactNode; href: string; id: string }) {
  const anchorId = safeId(id);
  return (
    <li className="citation" id={`fn-${anchorId}`} tabIndex={-1}>
      <a className="footnote-url" href={href}>{children}</a>{' '}
      <a className="footnote-backlink" href={`#fnref-${anchorId}`} aria-label={`Return from footnote ${id}`}>
        <span aria-hidden="true">↩</span>
      </a>
    </li>
  );
}
