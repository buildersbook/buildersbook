import { getMDXComponents } from '@/components/mdx';
import type { blogSource } from '@/lib/source';

type BlogPage = (typeof blogSource)['$inferPage'];

export function BlogRenderer({ page }: { page: BlogPage }) {
  const Body = page.data.body;

  return (
    <article className="content-page blog-page">
      <p className="functional-label">{page.data.category}</p>
      <h1>{page.data.title}</h1>
      <p className="content-standfirst">{page.data.description}</p>
      <time className="functional-label" dateTime={page.data.publishedAt}>
        {page.data.publishedAt}
      </time>
      <Body components={getMDXComponents()} />
    </article>
  );
}
