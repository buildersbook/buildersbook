import { contentRegistry } from '@/lib/content/registry';

export default function BookIndexPage() {
  const chapters = contentRegistry.filter((entry) => entry.collection === 'book');

  return (
    <main className="stage-one-main">
      <p className="functional-label">Volume I</p>
      <h1>The Book</h1>
      <p>Published chapters will appear here in reading order.</p>
      <p className="functional-label">{chapters.length} pipeline fixture</p>
    </main>
  );
}
