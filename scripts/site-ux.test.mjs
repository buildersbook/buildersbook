import assert from 'node:assert/strict';
import test from 'node:test';

import { register } from 'fumadocs-mdx/node';

register();

const [home, about, book, essays, essay, bookChapter, notFound, discovery] =
  await Promise.all([
    import('../app/page.tsx'),
    import('../app/about/page.tsx'),
    import('../app/book/page.tsx'),
    import('../app/essays/page.tsx'),
    import('../app/essays/[...slug]/page.tsx'),
    import('../app/book/[...slug]/page.tsx'),
    import('../app/not-found.tsx'),
    import('../lib/discovery.ts'),
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
