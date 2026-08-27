import { notFound } from 'next/navigation';

import {
  alternateHeaders,
  findPublishedPage,
  pageMarkdown,
  publishedPages,
} from '@/lib/discovery';

export const revalidate = false;

type RouteProps = {
  params: Promise<{ collection: string; slug?: string[] }>;
};

export async function GET(_request: Request, { params }: RouteProps) {
  const { collection, slug = [] } = await params;
  const page = findPublishedPage(collection, slug);
  if (!page) notFound();

  return new Response(await pageMarkdown(page), {
    headers: alternateHeaders(page.url, 'text/markdown; charset=utf-8'),
  });
}

export function generateStaticParams() {
  return publishedPages.map((page) => {
    const [collection, ...slug] = page.url.split('/').filter(Boolean);
    return { collection, slug };
  });
}
