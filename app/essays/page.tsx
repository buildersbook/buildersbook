import { contentRegistry } from '@/lib/content/registry';

export default function EssaysIndexPage() {
  const posts = contentRegistry.filter((entry) => entry.collection === 'blog');

  return (
    <main className="stage-one-main">
      <p className="functional-label">Field notes and post-mortems</p>
      <h1>Essays</h1>
      <p>Standalone writing will appear here newest first.</p>
      <p className="functional-label">{posts.length} pipeline fixture</p>
    </main>
  );
}
