import { buildRssFeed } from '@/lib/discovery';

export const revalidate = false;

export function GET() {
  return new Response(buildRssFeed(), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
