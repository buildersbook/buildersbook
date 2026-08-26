import { compile } from '@mdx-js/mdx';
import { register } from 'fumadocs-mdx/node';
import type { MDXContent } from 'mdx/types';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { MDX_COMPONENT_ALLOWLIST, remarkConstrainedMdx } from './constrained-mdx';
import { markdownFallbacks } from './markdown-fallbacks';
import { getProcessedMarkdown } from './processed-markdown';

type ContentEntry = {
  body: MDXContent;
  contentId: string;
  getText: (type: 'processed') => Promise<string>;
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

function collectInternalLinks(value: string): string[] {
  const links = new Set<string>();
  const patterns = [/href=["'](\/[^"'#?]*)/g, /\]\((\/[^)#?]*)/g];

  for (const pattern of patterns) {
    for (const match of value.matchAll(pattern)) links.add(match[1].replace(/\/$/, '') || '/');
  }

  return [...links];
}

async function expectDialectRejection(source: string, label: string): Promise<void> {
  let rejected = false;

  try {
    await compile(source, { remarkPlugins: [remarkConstrainedMdx] });
  } catch (error) {
    rejected = error instanceof Error && error.message.includes('FB-01');
  }

  invariant(rejected, `Constrained MDX failed to reject ${label}.`);
}

async function validateDialect(): Promise<void> {
  await compile('<Marginalia label="Context">Safe content.</Marginalia>', {
    remarkPlugins: [remarkConstrainedMdx],
  });
  await expectDialectRejection("import Thing from './thing'", 'an import');
  await expectDialectRejection('export const value = 1', 'an export');
  await expectDialectRejection('The result is {1 + 1}.', 'an inline expression');
  await expectDialectRejection('<Unknown>content</Unknown>', 'a non-allowlisted component');
  await expectDialectRejection('<Marginalia label={value}>content</Marginalia>', 'an expression attribute');

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
    { baseUrl: '/essays', entries: collections.blog as ContentEntry[] },
  ];
  const knownTargets = new Set(['/', '/about', '/book', '/essays']);

  for (const group of groups) {
    for (const entry of group.entries) {
      knownTargets.add(`${group.baseUrl}/${slugFromPath(entry.info.path)}`);
    }
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
      const html = renderToStaticMarkup(createElement(entry.body, { components: {} }));
      const markdown = await getProcessedMarkdown(entry);
      invariant(html.trim().length > 0, `${url}: rendered HTML is empty.`);
      invariant(!html.includes('<script'), `${url}: rendered HTML contains a script element.`);
      invariant(markdown.trim().length > 0, `${url}: processed Markdown export is empty.`);

      for (const link of [...collectInternalLinks(html), ...collectInternalLinks(markdown)]) {
        invariant(knownTargets.has(link), `${url}: broken internal link to ${link}`);
      }
    }
  }

  invariant(collections.book.length > 0, 'The book collection needs a pipeline fixture.');
  invariant(collections.blog.length > 0, 'The blog collection needs a pipeline fixture.');
}

await validateDialect();
await validateEntries();

console.log('Content validation passed: schemas, constrained MDX, HTML, processed Markdown, and internal links.');
