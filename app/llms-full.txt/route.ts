import { alternateHeaders, buildLlmsFull } from '@/lib/discovery';

export const revalidate = false;

export async function GET() {
  return new Response(await buildLlmsFull(), {
    headers: alternateHeaders('/'),
  });
}
