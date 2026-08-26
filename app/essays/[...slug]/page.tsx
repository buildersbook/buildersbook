import { BlogRenderer } from '@/components/renderers/blog-renderer';
import { blogSource } from '@/lib/source';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function EssayContentPage({ params }: PageProps) {
  const { slug } = await params;
  const page = blogSource.getPage(slug);
  if (!page) notFound();

  return <BlogRenderer page={page} />;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = blogSource.getPage(slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    robots: page.data.publicationStatus === 'published' ? undefined : { index: false, follow: false },
  };
}

export function generateStaticParams() {
  return blogSource.generateParams();
}
