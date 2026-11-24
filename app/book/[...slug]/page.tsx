import { BookRenderer } from '@/components/renderers/book-renderer';
import { articleJsonLd } from '@/lib/discovery';
import { bookSource } from '@/lib/source';
import { pageMetadata } from '@/lib/metadata';
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

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = bookSource.getPage(slug);
  if (!page || page.data.publicationStatus !== 'published') notFound();

  return pageMetadata({
    path: page.url,
    title: page.data.title,
    description: page.data.description,
    article: {},
  });
}

export function generateStaticParams() {
  return bookSource.getPages()
    .filter((page) => page.data.publicationStatus === 'published')
    .map((page) => ({ slug: page.slugs }));
}
