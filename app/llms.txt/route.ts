import { alternateHeaders, buildLlmsIndex } from '@/lib/discovery';

export const revalidate = false;

export function GET() {
  return new Response(buildLlmsIndex(), {
    headers: alternateHeaders('/'),
  });
}
