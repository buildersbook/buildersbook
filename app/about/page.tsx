import type { Metadata } from 'next';

import { Wordmark } from '@/components/wordmark';

export const metadata: Metadata = {
  title: 'About',
  description: "About Builder's Book and its evidence-led curriculum.",
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <main id="main-content" className="static-page">
      <p className="functional-label">About</p>
      <h1><Wordmark /></h1>
      <p className="static-page-lede">An open curriculum for engineers who build production software by orchestrating coding agents.</p>
      <h2>Built from project evidence</h2>
      <p>The book turns implementation failures, review findings, and operating decisions into material that another engineer can apply.</p>
      <h2>Published in order</h2>
      <p>Chapters form the curriculum. Essays stand alone, and the strongest ones eventually become part of the book.</p>
    </main>
  );
}
