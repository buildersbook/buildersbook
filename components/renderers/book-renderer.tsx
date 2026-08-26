import { getMDXComponents } from '@/components/mdx';
import { ContentShell } from '@/components/content-shell';
import type { bookSource } from '@/lib/source';

type BookPage = (typeof bookSource)['$inferPage'];

export function BookRenderer({ page }: { page: BookPage }) {
  const Body = page.data.body;

  return (
    <ContentShell
      description={page.data.description}
      eyebrow={`${page.data.part} · Chapter ${page.data.chapter}`}
      title={page.data.title}
    >
      <Body components={getMDXComponents()} />
    </ContentShell>
  );
}
