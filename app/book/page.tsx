import Link from 'next/link';

import { StaticPage } from '@/components/static-page';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  path: '/book',
  title: 'The Book',
  description: "The serialized Builder's Book curriculum.",
});

export default function BookIndexPage() {
  return (
    <StaticPage
      title="The Book"
      kicker="Volume I"
      lede="The Builder's Book is an open curriculum for engineers who build production software with AI coding agents. Chapters are in planning; the essays come first."
    >
      <p className="static-page-action"><Link href="/essays">Read the essays →</Link></p>
    </StaticPage>
  );
}
