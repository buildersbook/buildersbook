import { StaticPage } from '@/components/static-page';
import { pageMetadata } from '@/lib/metadata';
import { siteAuthor } from '@/lib/navigation';

export const metadata = pageMetadata({
  path: '/about',
  title: 'About',
  description: "About Builder's Book and its evidence-led curriculum.",
});

export default function AboutPage() {
  return (
    <StaticPage
      title="About"
      lede="An open curriculum for engineers who build production software by orchestrating coding agents."
    >
      <p className="static-page-byline"><a href={siteAuthor.url}>Written by {siteAuthor.name}.</a></p>
      <h2>Built from project evidence</h2>
      <p>The book turns implementation failures, review findings, and operating decisions into material that another engineer can apply.</p>
      <h2>Published in order</h2>
      <p>Chapters form the curriculum. Essays stand alone, and the strongest ones eventually become part of the book.</p>
    </StaticPage>
  );
}
