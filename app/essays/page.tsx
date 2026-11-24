import { EssayIndex, type EssayIndexEntry } from '@/components/essay-index';
import { StaticPage } from '@/components/static-page';
import { pageMetadata } from '@/lib/metadata';
import { publishedPages } from '@/lib/source';

export const metadata = pageMetadata({
  path: '/essays',
  title: 'Essays',
  description: "Builder's Book field notes and post-mortems.",
});

export default function EssaysIndexPage() {
  const essays = publishedPages
    .filter((page) => page.url.startsWith('/essays/'))
    .map((page): EssayIndexEntry => {
      if (!('category' in page.data) || page.data.publicationStatus !== 'published') {
        throw new Error(`${page.url}: expected published essay frontmatter.`);
      }
      return { date: page.data.publishedAt, title: page.data.title, href: page.url };
    });

  return (
    <StaticPage
      title="Essays"
      kicker="Field notes and post-mortems"
      lede="Essays from the work of building production software with coding agents."
    >
      <EssayIndex entries={essays} />
    </StaticPage>
  );
}
