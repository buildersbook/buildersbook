import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import test from 'node:test';

import { register } from 'fumadocs-mdx/node';
import { PathnameContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime.js';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

register();

const [home, about, book, essays, essay, bookChapter, notFound, search, sitemap, discovery, navigation, links] =
  await Promise.all([
    import('../app/page.tsx'),
    import('../app/about/page.tsx'),
    import('../app/book/page.tsx'),
    import('../app/essays/page.tsx'),
    import('../app/essays/[...slug]/page.tsx'),
    import('../app/book/[...slug]/page.tsx'),
    import('../app/not-found.tsx'),
    import('../app/api/search/route.ts'),
    import('../app/sitemap.ts'),
    import('../lib/discovery.ts'),
    import('../lib/navigation.ts'),
    import('../components/current-page-link.tsx'),
  ]);

const routes = [
  ['/', home.metadata],
  ['/about', about.metadata],
  ['/book', book.metadata],
  ['/essays', essays.metadata],
];

for (const page of discovery.publishedPages) {
  const routeModule = page.url.startsWith('/essays/') ? essay : bookChapter;
  routes.push([page.url, await routeModule.generateMetadata({ params: Promise.resolve({ slug: page.slugs }) })]);
}

const feedTypes = {
  'application/atom+xml': '/atom.xml',
  'application/rss+xml': '/rss.xml',
};

for (const [path, metadata] of routes) {
  test(path + ' keeps canonical, social URL and feed links aligned', () => {
    const canonical = discovery.absoluteUrl(path);
    assert.equal(metadata.alternates.canonical, canonical);
    assert.equal(metadata.openGraph.url, canonical);
    assert.equal(metadata.openGraph.siteName, "The Builder's Book");
    assert.equal(metadata.openGraph.locale, 'en_US');
    assert.equal(metadata.twitter.card, 'summary_large_image');
    assert.deepEqual(metadata.alternates.types, feedTypes);
  });
}

test('404 has its own title and feed links', () => {
  assert.equal(notFound.metadata.title.absolute, 'Page not found');
  assert.equal(notFound.metadata.alternates.canonical, undefined);
  assert.equal(notFound.metadata.openGraph.url, undefined);
  assert.deepEqual(notFound.metadata.alternates.types, feedTypes);
});

test('navigation marks only the link to the current page', () => {
  const linksHtml = renderToStaticMarkup(createElement(
    PathnameContext.Provider,
    { value: '/essays' },
    navigation.siteNavigation.map(({ href, label }) => createElement(
      links.CurrentPageLink, { key: href, href }, label,
    )),
  ));
  assert.equal(linksHtml.match(/aria-current="page"/g)?.length, 1);
  assert.match(linksHtml, /<a(?=[^>]*href="\/essays")(?=[^>]*aria-current="page")[^>]*>/);
});

const samplePath = '/book/sample-chapter';

for (const [path, routeModule] of [['/', home], ['/book', book]]) {
  test(path + ' omits the sample chapter and its repository link', () => {
    const html = renderToStaticMarkup(createElement(routeModule.default));
    assert.doesNotMatch(html, /sample-chapter|sample chapter/i);
  });
}

test('the sitemap excludes the draft sample chapter', () => {
  const paths = sitemap.default().map(({ url }) => new URL(url).pathname);
  assert.ok(paths.includes('/essays/agent-enforcement-hooks'));
  assert.ok(!paths.includes(samplePath));
});

test('the exported search index excludes the draft sample chapter', async () => {
  const response = await search.GET();
  assert.equal(response.status, 200);
  const index = await response.text();
  assert.match(index, /agent-enforcement-hooks/);
  assert.doesNotMatch(index, /sample-chapter/);
});

test('article JSON-LD identifies the individual author and organization publisher', () => {
  const pages = discovery.publishedPages.filter((page) => page.url.startsWith('/essays/'));
  assert.ok(pages.length > 0);
  for (const page of pages) {
    const article = JSON.parse(discovery.articleJsonLd(page))['@graph'].find((entry) => entry['@type'] === 'Article');
    assert.deepEqual(article.author, { '@type': 'Person', name: 'Dustin Matlock', url: 'https://github.com/dustinmatlock' });
    assert.deepEqual(article.publisher, { '@type': 'Organization', name: "The Builder's Book" });
  }
});


test('the retired layout switch is absent from source and configuration', () => {
  const missing = [
    ['BUILDERSBOOK', 'LAYOUT', 'PREVIEW'].join('_'),
    ['data', 'layout', 'preview'].join('-'),
  ];
  const generated = new Set([
    '.git', '.next', '.source', '.pnpm-store', '.lighthouseci', '.vercel', 'dist', 'node_modules', 'out',
  ]);
  const pending = [resolve(import.meta.dirname, '..')];
  while (pending.length > 0) {
    const directory = pending.pop();
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory() && !generated.has(entry.name)) {
        pending.push(path);
      } else if (entry.isFile() && /(?:\.(?:[cm]?[jt]sx?|css|json|mdx?|toml|ya?ml)$|^\.env(?:\.|$))/i.test(entry.name)) {
        const source = readFileSync(path, 'utf8');
        for (const marker of missing) assert.ok(!source.includes(marker), path + ' still contains ' + marker);
      }
    }
  }
});

test('static pages and articles without marginalia use the centred reading measure', () => {
  const css = readFileSync(new URL('../styles/site.css', import.meta.url), 'utf8');
  const tokens = readFileSync(new URL('../styles/tokens.css', import.meta.url), 'utf8');
  assert.match(css, /\.static-page,\s*\.not-found-page\s*\{[^}]*width: min\(100% - 2 \* var\(--static-gutter\), var\(--reading-measure\)\);[^}]*margin: 0 auto;/);
  assert.match(css, /:where\(\.content-article:not\(:has\(\.marginalia\)\)\) :is\(\.content-header, \.content-body\)\s*\{[^}]*var\(--reading-measure\)[^}]*margin-inline: auto;/);
  const shell = /--reading-shell:\s*([^;]+);/.exec(tokens);
  assert.ok(shell);
  assert.ok(css.includes('@media (width < ' + shell[1] + ')'));
  assert.match(css, /\.content-shell\s*\{\s*width: var\(--reading-shell\);/);
});

test('the server renders both theme actions with each label in the button', async () => {
  const { ThemeToggle } = await import('../components/theme-toggle.tsx');
  const html = renderToStaticMarkup(createElement(ThemeToggle));
  assert.match(html, /^<button[^>]*class="theme-toggle functional-label"/);
  assert.match(html, /<span class="theme-action theme-action-dark"><span class="theme-action-label">Dark mode<\/span>/);
  assert.match(html, /<span class="theme-action theme-action-light"><span class="theme-action-label">Light mode<\/span>/);
  assert.doesNotMatch(html, /aria-label=|aria-pressed=/);
});
