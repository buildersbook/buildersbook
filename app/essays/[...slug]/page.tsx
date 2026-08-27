import { EssayRenderer } from '@/components/renderers/essay-renderer';
import { articleJsonLd } from '@/lib/discovery';
import { essaysSource } from '@/lib/source';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function EssayContentPage({ params }: PageProps) {
  const { slug } = await params;
  const page = essaysSource.getPage(slug);
  if (!page || page.data.publicationStatus !== 'published') notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleJsonLd(page) }} />
      <EssayRenderer page={page} />
    </>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = essaysSource.getPage(slug);
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
      publishedTime: page.data.publishedAt,
    },
  };
}

export function generateStaticParams() {
  return essaysSource.getPages()
    .filter((page) => page.data.publicationStatus === 'published')
    .map((page) => ({ slug: page.slugs }));
}
