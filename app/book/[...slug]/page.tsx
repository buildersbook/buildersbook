import { BookRenderer } from '@/components/renderers/book-renderer';
import { bookSource } from '@/lib/source';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function BookContentPage({ params }: PageProps) {
  const { slug } = await params;
  const page = bookSource.getPage(slug);
  if (!page) notFound();

  return <BookRenderer page={page} />;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = bookSource.getPage(slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    robots: page.data.publicationStatus === 'published' ? undefined : { index: false, follow: false },
  };
}

export function generateStaticParams() {
  return bookSource.generateParams();
}
