import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { getRouteCacheKey } from 'next/dist/server/lib/route-cache-key.js';
import { selectAppPageEntry } from 'next/dist/shared/lib/router/utils/app-paths.js';

const siteTitle = 'The Builder’s Book';
const suffix = ` · ${siteTitle}`;
const routes = [
  ['/', siteTitle],
  ['/about'],
  ['/essays'],
  ['/book'],
  ['/essays/agent-enforcement-hooks'],
  ['/_not-found', `Page not found${suffix}`],
];

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function checkPageMetadata(buildDirectory) {
  const serverDirectory = join(buildDirectory, 'server');
  const prerenderManifestPath = join(buildDirectory, 'prerender-manifest.json');
  const prerenders = readJson(prerenderManifestPath).routes;
  // Next's export worker writes scoped artifacts when a build adapter is active.
  const { config } = readJson(join(buildDirectory, 'required-server-files.json'));
  const scoped = Boolean(config.adapterPath) && config.output !== 'export';
  const appManifestPath = join(serverDirectory, 'app-paths-manifest.json');
  const appEntries = scoped ? Object.keys(readJson(appManifestPath)) : [];

  for (const [route, expectedTitle] of routes) {
    const prerender = prerenders[route];
    assert.ok(
      prerender?.routeType === 'page' && prerender.dataRoute?.endsWith('.rsc'),
      `${route}: no prerendered App Router page recorded in ${prerenderManifestPath}`,
    );

    let htmlPath;
    if (scoped) {
      let sourceRoute;
      try {
        sourceRoute = selectAppPageEntry(prerender.srcRoute ?? route, appEntries);
      } catch (error) {
        throw new Error(`${route}: no source page entry found in ${appManifestPath}`, { cause: error });
      }
      const cacheKey = getRouteCacheKey(route, { kind: 'APP_PAGE', sourceRoute });
      htmlPath = join(serverDirectory, `${cacheKey}.html`);
    } else {
      htmlPath = join(serverDirectory, 'app', prerender.dataRoute.replace(/\.rsc$/, '.html'));
    }

    let html;
    try {
      html = readFileSync(htmlPath, 'utf8');
    } catch (error) {
      throw new Error(`${route}: could not read prerendered HTML. Tried ${htmlPath}`, { cause: error });
    }

    const openGraphTitles = [...html.matchAll(/<meta property="og:title" content="([^"]*)"\s*\/?>/g)];
    assert.equal(openGraphTitles.length, 1, `${route}: expected one prerendered og:title tag`);
    const openGraphTitle = openGraphTitles[0][1];
    if (expectedTitle !== undefined) {
      assert.equal(openGraphTitle, expectedTitle, `${route}: unexpected prerendered og:title`);
    } else {
      assert.ok(
        openGraphTitle.endsWith(suffix) && openGraphTitle.split(suffix).length === 2,
        `${route}: expected exactly one site-name suffix in og:title, got ${JSON.stringify(openGraphTitle)}`,
      );
    }

    // Next's built-in 404 uses a plain document title and a branded Open Graph title.
    if (route !== '/_not-found') {
      const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
      assert.equal(openGraphTitle, title, `${route}: og:title must match the document title`);
    }
  }
  console.log(`Prerendered Open Graph titles passed for ${routes.map(([route]) => route).join(', ')}.`);
}
