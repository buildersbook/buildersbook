import { INDEXNOW_KEY } from '@/lib/discovery';

export const revalidate = false;

export function GET() {
  return new Response(INDEXNOW_KEY, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
