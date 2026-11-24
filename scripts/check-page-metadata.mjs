import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const routes = ['about', 'essays/agent-enforcement-hooks'];
const suffix = ' · The Builder’s Book';

export function checkPageMetadata(appDirectory) {
  for (const route of routes) {
    const html = readFileSync(join(appDirectory, `${route}.html`), 'utf8');
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
    const openGraphTitles = [...html.matchAll(/<meta property="og:title" content="([^"]*)"\s*\/?>/g)];
    assert.equal(openGraphTitles.length, 1, `/${route}: expected one prerendered og:title tag`);
    const openGraphTitle = openGraphTitles[0][1];
    assert.ok(
      openGraphTitle.endsWith(suffix) && openGraphTitle.split(suffix).length === 2,
      `/${route}: expected exactly one site-name suffix in og:title, got ${JSON.stringify(openGraphTitle)}`,
    );
    assert.equal(openGraphTitle, title, `/${route}: og:title must match the document title`);
  }
  console.log(`Prerendered Open Graph titles passed for ${routes.map((route) => '/' + route).join(' and ')}.`);
}
