import { buildAtomFeed } from '@/lib/discovery';

export const revalidate = false;

export function GET() {
  return new Response(buildAtomFeed(), {
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' },
  });
}
