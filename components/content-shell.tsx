import type { ReactNode } from 'react';

type ContentShellProps = {
  children: ReactNode;
  description: string;
  eyebrow: ReactNode;
  metadata?: ReactNode;
  title: string;
};

export function ContentShell({
  children,
  description,
  eyebrow,
  metadata,
  title,
}: ContentShellProps) {
  return (
    <main id="main-content" className="content-shell">
      <article className="content-article">
        <header className="content-header">
          <div className="functional-label">{eyebrow}</div>
          <h1>{title}</h1>
          <p className="content-standfirst">{description}</p>
          {metadata ? <div className="content-metadata functional-label">{metadata}</div> : null}
        </header>
        <div className="content-body">{children}</div>
      </article>
    </main>
  );
}
