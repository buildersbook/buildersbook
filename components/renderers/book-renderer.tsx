import { getMDXComponents } from '@/components/mdx';
import type { bookSource } from '@/lib/source';

type BookPage = (typeof bookSource)['$inferPage'];

export function BookRenderer({ page }: { page: BookPage }) {
  const Body = page.data.body;

  return (
    <article className="content-page book-page">
      <p className="functional-label">{page.data.part} · Chapter {page.data.chapter}</p>
      <h1>{page.data.title}</h1>
      <p className="content-standfirst">{page.data.description}</p>
      <Body components={getMDXComponents()} />
    </article>
  );
}
