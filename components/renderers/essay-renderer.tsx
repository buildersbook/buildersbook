import { ContentShell } from '@/components/content-shell';
import { getMDXComponents } from '@/components/mdx';
import type { essaysSource } from '@/lib/source';

type EssayPage = (typeof essaysSource)['$inferPage'];

export function EssayRenderer({ page }: { page: EssayPage }) {
  const Body = page.data.body;

  return (
    <ContentShell
      description={page.data.description}
      eyebrow={page.data.category}
      metadata={<time dateTime={page.data.publishedAt}>{page.data.publishedAt}</time>}
      title={page.data.title}
    >
      <Body components={getMDXComponents()} />
    </ContentShell>
  );
}
