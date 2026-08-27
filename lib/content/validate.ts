import { compile } from '@mdx-js/mdx';
import { applyMdxPreset } from 'fumadocs-mdx/config';
import { register } from 'fumadocs-mdx/node';
import type { MDXContent } from 'mdx/types';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { Citation, Footnote, Footnotes } from '../../components/footnotes';
import { Marginalia } from '../../components/marginalia';
import sourceConfig, { book, essays } from '../../source.config';
import { MDX_COMPONENT_ALLOWLIST } from './constrained-mdx';
import { markdownFallbacks } from './markdown-fallbacks';
import { getProcessedMarkdown } from './processed-markdown';

type ContentEntry = {
  body: MDXContent;
  contentId: string;
  getText: (type: 'processed') => Promise<string>;
  getMDAST: () => Promise<{ children: Array<{ depth?: number; type: string }> }>;
  info: { path: string };
  locale: string;
  publicationStatus: 'published' | 'draft' | 'planned';
  sourceRevision: string;
  title: string;
  translationOf: string | null;
  translationStatus: string;
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
  await compileConfiguredFixture('<Marginalia condensed>Safe content.</Marginalia>', 'boolean-attribute');
  await expectDialectRejection('<div>Raw HTML embedded in MDX.</div>', 'raw HTML embedded in an .mdx file');
  await expectDialectRejection("import Thing from './thing'", 'an import');
  await expectDialectRejection('export const value = 1', 'an export');
  await expectDialectRejection('The result is {1 + 1}.', 'an inline expression');
  await expectDialectRejection('<Unknown>content</Unknown>', 'a non-allowlisted component');
  await expectDialectRejection('<Marginalia label={value}>content</Marginalia>', 'an expression attribute');

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

async function validateEntries(): Promise<void> {
  register();
  const collections = await import('../../.source/server');
  const groups = [
    { baseUrl: '/book', entries: collections.book as ContentEntry[] },
    { baseUrl: '/essays', entries: collections.essays as ContentEntry[] },
  ];
  const knownTargets = new Set(['/', '/about', '/book', '/essays']);

  for (const group of groups) {
    for (const entry of group.entries) {
      knownTargets.add(`${group.baseUrl}/${slugFromPath(entry.info.path)}`);
    }
  }

  const { contentPages } = await import('../source');
  const indexedUrls = new Set(contentPages.map((page) => page.url));
  const draftUrls = groups.flatMap((group) => group.entries
    .filter((entry) => entry.publicationStatus === 'draft')
    .map((entry) => `${group.baseUrl}/${slugFromPath(entry.info.path)}`));
  invariant(draftUrls.length > 0, 'The search exclusion test requires at least one draft fixture.');
  for (const url of draftUrls) {
    invariant(!indexedUrls.has(url), `Draft slug leaked into the search index: ${url}`);
  }

  const identities = new Set<string>();
  const urls = new Set<string>();

  for (const group of groups) {
    for (const entry of group.entries) {
      const url = `${group.baseUrl}/${slugFromPath(entry.info.path)}`;
      const identity = `${entry.contentId}:${entry.locale}`;
      invariant(!identities.has(identity), `Duplicate content identity: ${identity}`);
      invariant(!urls.has(url), `Duplicate content URL: ${url}`);
      identities.add(identity);
      urls.add(url);

      if (entry.locale === 'en') {
        invariant(entry.translationOf === null, `${url}: English source content cannot declare translationOf.`);
        invariant(entry.translationStatus === 'source', `${url}: English source content must be translationStatus=source.`);
      } else {
        invariant(entry.translationOf !== null, `${url}: translated content must declare translationOf.`);
        invariant(entry.translationStatus !== 'source', `${url}: translated content cannot be translationStatus=source.`);
      }

      invariant(entry.sourceRevision.length > 0, `${url}: sourceRevision is required.`);
      const html = renderToStaticMarkup(
        createElement(entry.body, { components: { Citation, Footnote, Footnotes, Marginalia } }),
      );
      const markdown = await getProcessedMarkdown(entry);
      const tree = await entry.getMDAST();
      const headingDepths = tree.children
        .filter((node) => node.type === 'heading')
        .map((node) => node.depth)
        .filter((depth): depth is number => typeof depth === 'number');
      let previousDepth = 1;
      for (const depth of headingDepths) {
        invariant(depth <= previousDepth + 1, `${url}: heading hierarchy skips from h${previousDepth} to h${depth}.`);
        previousDepth = depth;
      }
      invariant(html.trim().length > 0, `${url}: rendered HTML is empty.`);
      invariant(!html.includes('<script'), `${url}: rendered HTML contains a script element.`);
      invariant(markdown.trim().length > 0, `${url}: processed Markdown export is empty.`);

      for (const link of [
        ...collectInternalLinks(html, url),
        ...collectInternalLinks(markdown, url),
      ]) {
        invariant(knownTargets.has(link), `${url}: broken internal link to ${link}`);
      }
    }
  }

  invariant(collections.book.length > 0, 'The book collection needs a pipeline fixture.');
  invariant(collections.essays.length > 0, 'The essays collection needs a pipeline fixture.');
}

validateInternalLinkCollection();
validateCollectionGlobs();
await validateDialect();
await validateEntries();

console.log('Content validation passed: schemas, constrained MDX, HTML, processed Markdown, and internal links.');
