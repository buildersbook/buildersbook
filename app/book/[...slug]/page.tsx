import { BookRenderer } from '@/components/renderers/book-renderer';
import { articleJsonLd } from '@/lib/discovery';
import { bookSource } from '@/lib/source';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function BookContentPage({ params }: PageProps) {
  const { slug } = await params;
  const page = bookSource.getPage(slug);
  if (!page || page.data.publicationStatus !== 'published') notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleJsonLd(page) }} />
      <BookRenderer page={page} />
    </>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = bookSource.getPage(slug);
  if (!page || page.data.publicationStatus !== 'published') notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: page.url },
    openGraph: {
      type: 'article',
      title: page.data.title,
      description: page.data.description,
      url: page.url,
    },
  };
}

export function generateStaticParams() {
  return bookSource.getPages()
    .filter((page) => page.data.publicationStatus === 'published')
    .map((page) => ({ slug: page.slugs }));
}
