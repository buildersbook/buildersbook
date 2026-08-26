import { getMDXComponents } from '@/components/mdx';
import { ContentShell } from '@/components/content-shell';
import type { blogSource } from '@/lib/source';

type BlogPage = (typeof blogSource)['$inferPage'];

export function BlogRenderer({ page }: { page: BlogPage }) {
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
