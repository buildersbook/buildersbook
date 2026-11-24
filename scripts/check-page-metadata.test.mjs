import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';

import { checkPageMetadata } from './check-page-metadata.mjs';

const siteTitle = 'The Builder’s Book';
const suffix = ` · ${siteTitle}`;
const pages = [
  ['/', '/page', '/index.rsc', siteTitle],
  ['/about', '/about/page', '/about.rsc', `About${suffix}`],
  ['/essays', '/essays/page', '/essays.rsc', `Essays${suffix}`],
  ['/book', '/book/page', '/book.rsc', `The Book${suffix}`],
  ['/essays/agent-enforcement-hooks', '/essays/[...slug]/page', '/essays/agent-enforcement-hooks.rsc', `An essay${suffix}`],
  ['/_not-found', '/_not-found/page', '/_not-found.rsc', `Page not found${suffix}`, 'Page not found'],
];

function writeHtml(file, openGraphTitle, title = openGraphTitle) {
  const openGraphTag = openGraphTitle === undefined ? '' : `<meta property="og:title" content="${openGraphTitle}"/>`;
  writeFileSync(file, `<title>${title}</title>${openGraphTag}`);
}

function makeBuild(t, scoped) {
  const build = mkdtempSync(join(tmpdir(), 'check-page-metadata-'));
  t.after(() => rmSync(build, { recursive: true, force: true }));
  const routes = {};
  const appEntries = {};
  const files = {};
  for (const [route, entry, dataRoute, openGraphTitle, title] of pages) {
    routes[route] = { routeType: 'page', dataRoute, srcRoute: entry.slice(0, -'/page'.length) || '/' };
    appEntries[entry] = `app${entry}.js`;
    const stem = dataRoute.replace(/\.rsc$/, '.html');
    const hash = createHash('sha256').update(entry).digest('hex');
    const file = scoped
      ? join(build, 'server/route-cache/APP_PAGE', hash, '$', stem)
      : join(build, 'server/app', stem);
    mkdirSync(dirname(file), { recursive: true });
    writeHtml(file, openGraphTitle, title);
    files[route] = file;
  }
  writeFileSync(join(build, 'prerender-manifest.json'), JSON.stringify({ routes }));
  writeFileSync(join(build, 'required-server-files.json'), JSON.stringify({
    config: scoped ? { adapterPath: 'fixture-adapter.cjs' } : {},
  }));
  writeFileSync(join(build, 'server/app-paths-manifest.json'), JSON.stringify(appEntries));
  return { build, files };
}

for (const scoped of [false, true]) {
  const layout = scoped ? 'adapter' : 'local';

  test(`checks all six page types in the ${layout} build layout`, (t) => {
    const { build } = makeBuild(t, scoped);
    assert.doesNotThrow(() => checkPageMetadata(build));
  });

  test(`rejects a doubled suffix and a missing og:title in the ${layout} build layout`, (t) => {
    const { build, files } = makeBuild(t, scoped);
    writeHtml(files['/about'], `About${suffix}${suffix}`);
    assert.throws(() => checkPageMetadata(build), /\/about: expected exactly one site-name suffix/);
    writeHtml(files['/about'], undefined, `About${suffix}`);
    assert.throws(() => checkPageMetadata(build), /\/about: expected one prerendered og:title tag/);
  });
}

test('reports the route and attempted path when an adapter artifact is missing', (t) => {
  const { build, files } = makeBuild(t, true);
  const stalePath = join(build, 'server/app/about.html');
  mkdirSync(dirname(stalePath), { recursive: true });
  writeHtml(stalePath, `About${suffix}`);
  unlinkSync(files['/about']);
  assert.throws(
    () => checkPageMetadata(build),
    { message: `/about: could not read prerendered HTML. Tried ${files['/about']}` },
  );
});

test('requires the exact home and 404 Open Graph titles', (t) => {
  const { build, files } = makeBuild(t, false);
  writeHtml(files['/'], `${siteTitle}${suffix}`);
  assert.throws(() => checkPageMetadata(build), /\/: unexpected prerendered og:title/);
  writeHtml(files['/'], siteTitle);
  writeHtml(files['/_not-found'], 'Page not found');
  assert.throws(() => checkPageMetadata(build), /\/_not-found: unexpected prerendered og:title/);
});
