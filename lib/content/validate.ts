import { compile } from '@mdx-js/mdx';
import { applyMdxPreset } from 'fumadocs-mdx/config';
import { register } from 'fumadocs-mdx/node';
import type { Root } from 'mdast';
import { existsSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { Citation, Footnote, Footnotes } from '../../components/footnotes';
import { Marginalia } from '../../components/marginalia';
import sourceConfig, { book, essays } from '../../source.config';
import { deduplicateHeadingIds, MDX_COMPONENT_ALLOWLIST } from './constrained-mdx';
import { collectDiscoveryPaths } from './discovery-paths';
import { markdownFallbacks } from './markdown-fallbacks';
import { getProcessedMarkdown } from './processed-markdown';
import { bookFrontmatterSchema, essayFrontmatterSchema } from './schemas';

type GeneratedCollections = typeof import('../../.source/server');
type BookEntry = GeneratedCollections['book'][number];
type EssayEntry = GeneratedCollections['essays'][number];
type ContentEntry = BookEntry | EssayEntry;

type TreeNode = {
  children?: TreeNode[];
  data?: { hProperties?: { id?: unknown } };
  depth?: number;
  type: string;
};

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function slugFromPath(path: string): string {
  return path.replace(/\.(?:md|mdx)$/, '').replace(/\/index$/, '');
}

function normalizeInternalLink(href: string, currentUrl: string): string | null {
  const candidate = href.trim().replace(/^<|>$/g, '');
  if (!candidate || candidate.startsWith('#') || candidate.startsWith('//')) return null;

  try {
    const url = new URL(candidate, `https://buildersbook.dev${currentUrl}`);
    if (url.origin !== 'https://buildersbook.dev') return null;
    return url.pathname.replace(/\/$/, '') || '/';
  } catch {
    return null;
  }
}

function normalizeReferenceLabel(label: string): string {
  return label.trim().replace(/\s+/g, ' ').toLowerCase();
}

function collectInternalLinks(value: string, currentUrl: string): string[] {
  const links = new Set<string>();
  const destinations = [
    ...value.matchAll(/href=["']([^"']+)["']/g),
    ...value.matchAll(/(?<!!)\[[^\]]+\]\(\s*(<?[^\s)>]+>?)/g),
  ];

  for (const match of destinations) {
    const link = normalizeInternalLink(match[1], currentUrl);
    if (link) links.add(link);
  }

  const definitions = new Map<string, string>();
  for (const match of value.matchAll(/^\s{0,3}\[([^\]]+)\]:\s*(<?[^\s>]+>?)/gm)) {
    definitions.set(normalizeReferenceLabel(match[1]), match[2]);
  }

  for (const match of value.matchAll(/(?<!!)\[([^\]]+)\]\[([^\]]*)\]/g)) {
    const label = normalizeReferenceLabel(match[2] || match[1]);
    const destination = definitions.get(label);
    if (!destination) continue;
    const link = normalizeInternalLink(destination, currentUrl);
    if (link) links.add(link);
  }

  return [...links];
}

function collectTreeNodes(root: TreeNode): TreeNode[] {
  const nodes: TreeNode[] = [root];
  for (const child of root.children ?? []) nodes.push(...collectTreeNodes(child));
  return nodes;
}

function validateInternalLinkCollection(): void {
  const links = collectInternalLinks(
    [
      '<a href="./related?view=full#notes">Relative HTML link</a>',
      '[Relative Markdown link](../book)',
      '[Reference-style link][sample chapter]',
      '[sample chapter]: ../book/sample-chapter#opening',
    ].join('\n'),
    '/essays/sample-post',
  );

  invariant(links.includes('/essays/related'), 'Relative HTML links must be collected.');
  invariant(links.includes('/book'), 'Relative Markdown links must be collected.');
  invariant(links.includes('/book/sample-chapter'), 'Reference-style links must be collected.');
}

async function configuredMdxOptions() {
  const configured = typeof sourceConfig.mdxOptions === 'function'
    ? await sourceConfig.mdxOptions()
    : sourceConfig.mdxOptions;

  invariant(configured, 'source.config.ts must define the constrained MDX pipeline.');
  return applyMdxPreset(configured)('bundler');
}

async function compileConfiguredFixture(source: string, label: string) {
  return compile(
    { path: `lib/content/fixtures/${label}.mdx`, value: source },
    await configuredMdxOptions(),
  );
}

function validateCollectionGlobs(): void {
  const mdxOnly = JSON.stringify(['**/*.mdx']);
  invariant(
    JSON.stringify(book.files) === mdxOnly && JSON.stringify(essays.files) === mdxOnly,
    'The book and essay fixtures document that .md files are excluded from both collection globs.',
  );
}

async function expectDialectRejection(source: string, label: string): Promise<void> {
  let rejected = false;

  try {
    await compileConfiguredFixture(source, label.replaceAll(' ', '-'));
  } catch (error) {
    rejected = error instanceof Error && error.message.includes('FB-01');
  }

  invariant(rejected, `Constrained MDX failed to reject ${label}.`);
}

async function validateDialect(): Promise<void> {
  await compileConfiguredFixture('![Architecture diagram](/fig.png)', 'plain-markdown-image');
  await compileConfiguredFixture('[HTTPS](https://example.com) [mail](mailto:hello@example.com) [relative](../book)', 'allowed-link-schemes');
  await compileConfiguredFixture('<Marginalia condensed>Safe content.</Marginalia>', 'boolean-attribute');
  await compileConfiguredFixture('<Citation href="https://example.com">Safe source.</Citation>', 'allowed-component-href');
  await expectDialectRejection('<div>Raw HTML embedded in MDX.</div>', 'raw HTML embedded in an .mdx file');
  await expectDialectRejection("import Thing from './thing'", 'an import');
  await expectDialectRejection('export const value = 1', 'an export');
  await expectDialectRejection('The result is {1 + 1}.', 'an inline expression');
  await expectDialectRejection('<Unknown>content</Unknown>', 'a non-allowlisted component');
  await expectDialectRejection('<Marginalia label={value}>content</Marginalia>', 'an expression attribute');
  await expectDialectRejection('[Unsafe](javascript:alert)', 'a non-allowlisted Markdown URL scheme');
  await expectDialectRejection('<Citation href="http://example.com">Unsafe.</Citation>', 'a non-allowlisted component href scheme');

  const compiledCodeTab = await compileConfiguredFixture(
    '```bash tab="npm"\nnpm install example\n```',
    'disabled-code-tab-transform',
  );
  invariant(
    !String(compiledCodeTab.value).includes('CodeBlockTabs')
      && !String(compiledCodeTab.value).includes('Tabs'),
    'Fenced code with tab="npm" must compile without emitting Tabs components.',
  );

  const fallbackNames = Object.keys(markdownFallbacks).sort();
  invariant(
    JSON.stringify(fallbackNames) === JSON.stringify([...MDX_COMPONENT_ALLOWLIST].sort()),
    'Every approved MDX component must have exactly one Markdown fallback.',
  );
}

function validateSchemaContracts(): void {
  const localeFields = {
    contentId: 'fixture',
    locale: 'en',
    sourceRevision: '0',
    translationOf: null,
    translationStatus: 'source' as const,
  };
  const sharedFields = {
    ...localeFields,
    description: 'Fixture description.',
    title: 'Fixture',
  };
  const bookFixture = {
    ...sharedFields,
    chapter: '0.0',
    part: 'Fixture',
    prerequisites: [],
    publicationStatus: 'draft' as const,
  };
  const essayFixture = {
    ...sharedFields,
    category: 'essay' as const,
    publicationStatus: 'draft' as const,
    relatedBookChapter: null,
  };

  invariant(bookFrontmatterSchema.safeParse(bookFixture).success, 'A valid book fixture must parse.');
  invariant(!bookFrontmatterSchema.safeParse({ ...bookFixture, unknownField: true }).success, 'Book frontmatter must be strict.');
  invariant(essayFrontmatterSchema.safeParse(essayFixture).success, 'Draft essays must not require publishedAt.');
  invariant(!essayFrontmatterSchema.safeParse({ ...essayFixture, unknownField: true }).success, 'Essay frontmatter must be strict.');
  invariant(!essayFrontmatterSchema.safeParse({ ...essayFixture, publicationStatus: 'published' }).success, 'Published essays must require publishedAt.');
  invariant(!essayFrontmatterSchema.safeParse({ ...essayFixture, publicationStatus: 'published', publishedAt: '2026-13-45' }).success, 'Invalid calendar dates must fail.');
  invariant(essayFrontmatterSchema.safeParse({ ...essayFixture, publicationStatus: 'published', publishedAt: '2026-08-27' }).success, 'Real publication dates must parse.');
}

function validateHeadingFixture(): void {
  const tree: Root = {
    type: 'root',
    children: [
      { type: 'heading', depth: 2, children: [{ type: 'text', value: 'Repeated heading' }] },
      {
        type: 'blockquote',
        children: [{ type: 'heading', depth: 2, children: [{ type: 'text', value: 'Repeated heading' }] }],
      },
    ],
  };
  deduplicateHeadingIds(tree);
  const headings = collectTreeNodes(tree as TreeNode).filter((node) => node.type === 'heading');
  const ids = headings.map((node) => node.data?.hProperties?.id);
  invariant(ids[0] === 'repeated-heading', 'The first heading must receive its plain slug.');
  invariant(ids[1] === 'repeated-heading-1', 'Recursive duplicate headings must receive a counter suffix.');

  const hierarchyTree: TreeNode = {
    type: 'root',
    children: [
      { type: 'heading', depth: 2 },
      { type: 'blockquote', children: [{ type: 'heading', depth: 4 }] },
    ],
  };
  let nestedSkipRejected = false;
  try {
    assertHeadingHierarchy(collectTreeNodes(hierarchyTree), 'recursive-heading-fixture');
  } catch (error) {
    nestedSkipRejected = error instanceof Error && error.message.includes('skips from h2 to h4');
  }
  invariant(nestedSkipRejected, 'Heading hierarchy validation must recurse into blockquotes and other child containers.');
}

function assertHeadingHierarchy(nodes: TreeNode[], url: string): void {
  const headingDepths = nodes
    .filter((node) => node.type === 'heading')
    .map((node) => node.depth)
    .filter((depth): depth is number => typeof depth === 'number');
  let previousDepth = 1;
  for (const depth of headingDepths) {
    invariant(depth <= previousDepth + 1, `${url}: heading hierarchy skips from h${previousDepth} to h${depth}.`);
    previousDepth = depth;
  }
}

async function validateEntries(): Promise<void> {
  register();
  const collections = await import('../../.source/server');
  const groups = [
    { baseUrl: '/book', entries: collections.book },
    { baseUrl: '/essays', entries: collections.essays },
  ];
  const knownTargets = new Set(['/', '/about', '/book', '/essays']);
  const publicationByUrl = new Map<string, ContentEntry['publicationStatus']>();

  for (const group of groups) {
    for (const entry of group.entries) {
      const url = `${group.baseUrl}/${slugFromPath(entry.info.path)}`;
      knownTargets.add(url);
      publicationByUrl.set(url, entry.publicationStatus);
    }
  }

  const source = await import('../source');
  const { default: EssaysIndexPage } = await import('../../app/essays/page');
  const essaysIndexHtml = renderToStaticMarkup(createElement(EssaysIndexPage));
  for (const page of source.allPagesIncludingUnpublished.filter((page) => page.url.startsWith('/essays/'))) {
    // Compare escaped text against the actual page render, not only the source filter.
    const escapedTitle = renderToStaticMarkup(createElement('span', null, page.data.title)).slice(6, -7);
    if (page.data.publicationStatus === 'published') {
      invariant(essaysIndexHtml.includes(escapedTitle), `/essays: published title missing: ${page.data.title}`);
    } else {
      invariant(!essaysIndexHtml.includes(escapedTitle), `/essays: unpublished title leaked: ${page.data.title}`);
    }
  }
  const allSourceUrls = new Set(source.allPagesIncludingUnpublished.map((page) => page.url));
  const indexedUrls = new Set(source.publishedPages.map((page) => page.url));
  const draftUrls = [...publicationByUrl]
    .filter(([, status]) => status === 'draft')
    .map(([url]) => url);
  // Flip to false in the Phase 2 publish commit — this flag makes gate dormancy a declared state.
  const EXPECT_NO_PUBLISHED_PAGES = false;
  invariant(draftUrls.length > 0, 'The search exclusion test requires at least one draft fixture.');
  invariant(
    !EXPECT_NO_PUBLISHED_PAGES || source.publishedPages.length === 0,
    'Published pages exist while EXPECT_NO_PUBLISHED_PAGES is true.',
  );
  invariant(
    EXPECT_NO_PUBLISHED_PAGES || source.publishedPages.length > 0,
    'EXPECT_NO_PUBLISHED_PAGES is false, but the published page set is empty.',
  );
  for (const url of draftUrls) invariant(!indexedUrls.has(url), `Draft slug leaked into the search index: ${url}`);

  const identities = new Set<string>();
  const urls = new Set<string>();
  const bookContentIds = new Set(collections.book.map((entry) => entry.contentId));
  const contentById = new Map(
    [...collections.book, ...collections.essays].map((entry) => [entry.contentId, entry]),
  );

  for (const group of groups) {
    for (const entry of group.entries) {
      const url = `${group.baseUrl}/${slugFromPath(entry.info.path)}`;
      const identity = `${entry.contentId}:${entry.locale}`;
      invariant(!identities.has(identity), `Duplicate content identity: ${identity}`);
      invariant(!urls.has(url), `Duplicate content URL: ${url}`);
      identities.add(identity);
      urls.add(url);
      invariant(allSourceUrls.has(url), `${url}: orphaned content page is absent from its collection source.`);
      invariant(entry.description.trim().length > 0, `${url}: description is required.`);

      if (entry.locale === 'en') {
        invariant(entry.translationOf === null, `${url}: English source content cannot declare translationOf.`);
        invariant(entry.translationStatus === 'source', `${url}: English source content must be translationStatus=source.`);
      } else {
        invariant(entry.translationOf !== null, `${url}: translated content must declare translationOf.`);
        invariant(entry.translationStatus !== 'source', `${url}: translated content cannot be translationStatus=source.`);
      }

      invariant(entry.sourceRevision.length > 0, `${url}: sourceRevision is required.`);
      if ('prerequisites' in entry) {
        for (const prerequisite of entry.prerequisites) {
          invariant(bookContentIds.has(prerequisite), `${url}: unknown prerequisite contentId ${prerequisite}.`);
        }
      }
      if ('relatedBookChapter' in entry && entry.relatedBookChapter) {
        const target = contentById.get(entry.relatedBookChapter);
        invariant(target, `${url}: relatedBookChapter does not resolve to contentId ${entry.relatedBookChapter}.`);
        if (target.publicationStatus !== 'published') {
          console.warn(`${url}: relatedBookChapter target ${entry.relatedBookChapter} is unpublished.`);
        }
      }

      const html = renderToStaticMarkup(
        createElement(entry.body, { components: { Citation, Footnote, Footnotes, Marginalia } }),
      );
      const markdown = await getProcessedMarkdown(entry);
      const tree = await entry.getMDAST();
      const nodes = collectTreeNodes(tree as TreeNode);
      assertHeadingHierarchy(nodes, url);

      const headingIds = nodes
        .filter((node) => node.type === 'heading')
        .map((node) => node.data?.hProperties?.id);
      invariant(headingIds.every((id) => typeof id === 'string' && id.length > 0), `${url}: every heading must have an ID.`);
      invariant(new Set(headingIds).size === headingIds.length, `${url}: duplicate heading IDs detected.`);

      const documentIds = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
      invariant(new Set(documentIds).size === documentIds.length, `${url}: duplicate rendered document IDs detected.`);
      invariant(html.trim().length > 0, `${url}: rendered HTML is empty.`);
      invariant(!html.includes('<script'), `${url}: rendered HTML contains a script element.`);
      invariant(markdown.trim().length > 0, `${url}: processed Markdown export is empty.`);

      for (const link of [
        ...collectInternalLinks(html, url),
        ...collectInternalLinks(markdown, url),
      ]) {
        invariant(knownTargets.has(link), `${url}: broken internal link to ${link}`);
        const targetStatus = publicationByUrl.get(link);
        invariant(
          entry.publicationStatus !== 'published' || targetStatus === undefined || targetStatus === 'published',
          `${url}: published content links to unpublished target ${link}.`,
        );
      }
    }
  }

  for (const url of allSourceUrls) invariant(urls.has(url), `${url}: source page has no content entry.`);
  invariant(collections.book.length > 0, 'The book collection needs a pipeline fixture.');
  invariant(collections.essays.length > 0, 'The essays collection needs a pipeline fixture.');
}

async function validateDiscoverySurfaces(): Promise<void> {
  const discovery = await import('../discovery');
  const source = await import('../source');
  const indexNowRoute = new URL(`../../app/${discovery.INDEXNOW_KEY}.txt/route.ts`, import.meta.url);
  invariant(
    existsSync(indexNowRoute),
    `IndexNow key route is missing for the current INDEXNOW_KEY: ${discovery.INDEXNOW_KEY}`,
  );
  const draftUrls = source.allPagesIncludingUnpublished
    .filter((page) => page.data.publicationStatus !== 'published')
    .map((page) => page.url);
  const sitemapEntries = discovery.buildSitemapEntries();
  const sitemapUrls = new Set(sitemapEntries.map((entry) => new URL(entry.url).pathname));
  const llmsIndex = discovery.buildLlmsIndex();
  const llmsIndexUrls = collectDiscoveryPaths(llmsIndex);
  // Validate the HTTP handlers' bodies, not only the generators they call.
  const [rssRoute, atomRoute, llmsFullRoute, markdownRoute] = await Promise.all([
    import('../../app/rss.xml/route'),
    import('../../app/atom.xml/route'),
    import('../../app/llms-full.txt/route'),
    import('../../app/llms.mdx/[collection]/[[...slug]]/route'),
  ]);
  const [rss, atom, llmsFull] = await Promise.all([
    rssRoute.GET().text(),
    atomRoute.GET().text(),
    llmsFullRoute.GET().then((response) => response.text()),
  ]);
  const surfaceUrls = new Map([
    ['sitemap', sitemapUrls],
    ['RSS', collectDiscoveryPaths(rss)],
    ['Atom', collectDiscoveryPaths(atom)],
    ['llms.txt', llmsIndexUrls],
    ['llms-full.txt', collectDiscoveryPaths(llmsFull)],
  ]);

  // Feeds contain essays only. Populated-output gates are dormant for empty collections.
  const publishedEssays = source.publishedPages.filter((page) => page.url.startsWith('/essays/'));
  if (publishedEssays.length > 0) {
    invariant(rss.trim().length > 0, 'RSS: published essays exist, but the HTTP output is empty.');
    invariant(atom.trim().length > 0, 'Atom: published essays exist, but the HTTP output is empty.');
    const rssItems = [...rss.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => match[1]);
    const atomEntries = [...atom.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match) => match[1]);
    const rssMembers = collectDiscoveryPaths(rssItems.map((item) => item.match(/<link>([^<]+)<\/link>/)?.[1] ?? '').join('\n'));
    const atomMembers = collectDiscoveryPaths(atomEntries.map((entry) => entry.match(/<id>([^<]+)<\/id>/)?.[1] ?? '').join('\n'));
    const hasAuthor = (value: string) => /<author>\s*<name>\s*[^<\s][^<]*<\/name>\s*<\/author>/.test(value);
    const feedHasAuthor = hasAuthor(atom.split('<entry>')[0]);
    for (const page of publishedEssays) {
      invariant(rssMembers.has(page.url), `RSS: published essay is missing from feed items: ${page.url}`);
      invariant(atomMembers.has(page.url), `Atom: published essay is missing from feed entries: ${page.url}`);
    }
    invariant(
      feedHasAuthor || atomEntries.every(hasAuthor),
      'Atom: an author with a nonempty name is required at feed level or on every entry.',
    );
  }

  if (source.publishedPages.length > 0) {
    invariant(llmsFull.trim().length > 0, 'llms-full.txt: published pages exist, but the HTTP output is empty.');
  }

  for (const page of source.publishedPages) {
    const heading = `# ${page.data.title} (${discovery.absoluteUrl(page.url)})\n`;
    invariant(
      llmsFull.startsWith(heading) || llmsFull.includes(`\n${heading}`),
      `llms-full.txt: published page is missing from the HTTP output: ${page.url}`,
    );
    const [collection, ...slug] = page.url.split('/').filter(Boolean);
    const response = await markdownRoute.GET(new Request(discovery.absoluteUrl(`${page.url}.md`)), {
      params: Promise.resolve({ collection, slug }),
    });
    invariant(response.status === 200, `Markdown HTTP export: ${page.url}.md returned ${response.status}.`);
    const markdown = await response.text();
    invariant(markdown.trim().length > 0, `Markdown HTTP export: ${page.url}.md is empty.`);
    invariant(markdown.startsWith(heading), `Markdown HTTP export: published page is missing or incorrect: ${page.url}`);
    surfaceUrls.set(`Markdown HTTP export ${page.url}.md`, collectDiscoveryPaths(markdown));
  }

  for (const [surface, urls] of surfaceUrls) {
    for (const url of draftUrls) {
      invariant(!urls.has(url), `${surface}: draft URL leaked into discovery output: ${url}`);
    }
  }

  for (const page of source.publishedPages) {
    invariant(sitemapUrls.has(page.url), `sitemap: published URL is missing from discovery output: ${page.url}`);
    invariant(llmsIndexUrls.has(page.url), `llms.txt: published URL is missing from discovery output: ${page.url}`);
  }
}

validateInternalLinkCollection();
validateCollectionGlobs();
validateSchemaContracts();
validateHeadingFixture();
await validateDialect();
await validateEntries();
await validateDiscoverySurfaces();

console.log('Content validation passed: strict schemas, constrained URLs, recursive headings, unique IDs, references, HTML, Markdown, internal links, and draft-free discovery with populated HTTP export membership.');
