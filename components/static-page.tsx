import type { ReactNode } from 'react';

type StaticPageProps = {
  title: string;
  kicker?: string;
  lede: string;
  children: ReactNode;
};

export function StaticPage({ title, kicker, lede, children }: StaticPageProps) {
  return (
    <main id="main-content" className="static-page">
      <header>
        {kicker ? <p className="functional-label">{kicker}</p> : null}
        <h1>{title}</h1>
        <p className="static-page-lede">{lede}</p>
      </header>
      {children}
    </main>
  );
}
