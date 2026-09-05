import { execFileSync } from 'node:child_process';

import { llms, loader } from 'fumadocs-core/source';

import { getProcessedMarkdown } from './content/processed-markdown';
import { publishedPages } from './source';

export { publishedPages };

export const SITE_URL = 'https://buildersbook.dev';
export const INDEXNOW_KEY = 'ed028cc6bfe99c09e25c88b51da41e70';
export const INDEXNOW_KEY_PATH = `/${INDEXNOW_KEY}.txt`;

export type PublishedPage = (typeof publishedPages)[number];

type SitemapEntry = {
  lastModified?: string;
  url: string;
};

const staticPages = [
  { path: '/', sourcePath: 'app/page.tsx' },
  { path: '/about', sourcePath: 'app/about/page.tsx' },
  { path: '/book', sourcePath: 'app/book/page.tsx' },
  { path: '/essays', sourcePath: 'app/essays/page.tsx' },
] as const;

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

function publishedAt(page: PublishedPage): string | undefined {
  return 'publishedAt' in page.data ? page.data.publishedAt : undefined;
}

export function gitLastModified(sourcePath: string, fallback?: string): string | undefined {
  try {
    const value = execFileSync('git', ['log', '-1', '--format=%cI', '--', sourcePath], {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return value || fallback;
  } catch {
    return fallback;
  }
}

export function buildSitemapEntries(): SitemapEntry[] {
  return [
    ...staticPages.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: gitLastModified(page.sourcePath),
    })),
    ...publishedPages.map((page) => ({
      url: absoluteUrl(page.url),
      lastModified: gitLastModified(page.data.info.fullPath, publishedAt(page)),
    })),
  ];
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function publishedEssays() {
  return publishedPages
    .filter((page) => page.url.startsWith('/essays/') && 'category' in page.data && page.data.publishedAt)
    .sort((left, right) => (publishedAt(right) ?? '').localeCompare(publishedAt(left) ?? ''));
}

export function buildRssFeed(): string {
  const items = publishedEssays().map((page) => {
    const date = publishedAt(page);
    return [
      '<item>',
      `<title>${escapeXml(page.data.title)}</title>`,
      `<link>${escapeXml(absoluteUrl(page.url))}</link>`,
      `<guid isPermaLink="true">${escapeXml(absoluteUrl(page.url))}</guid>`,
      `<description>${escapeXml(page.data.description)}</description>`,
      date ? `<pubDate>${new Date(`${date}T00:00:00Z`).toUTCString()}</pubDate>` : '',
      '</item>',
    ].filter(Boolean).join('');
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Builder&apos;s Book Essays</title><link>${SITE_URL}/essays</link><description>Field notes and post-mortems for engineers who build production software with coding agents.</description><language>en</language>${items}</channel></rss>`;
}

export function buildAtomFeed(): string {
  const essays = publishedEssays();
  const latestPublishedAt = essays[0] ? publishedAt(essays[0]) : undefined;
  const updated = latestPublishedAt
    ? `${latestPublishedAt}T00:00:00Z`
    : gitLastModified('app/essays/page.tsx', '2026-08-27T00:00:00Z');
  const entries = essays.map((page) => {
    const date = publishedAt(page);
    return [
      '<entry>',
      `<title>${escapeXml(page.data.title)}</title>`,
      `<id>${escapeXml(absoluteUrl(page.url))}</id>`,
      `<link href="${escapeXml(absoluteUrl(page.url))}"/>`,
      `<summary>${escapeXml(page.data.description)}</summary>`,
      date ? `<published>${date}T00:00:00Z</published><updated>${date}T00:00:00Z</updated>` : '',
      '</entry>',
    ].filter(Boolean).join('');
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>Builder&apos;s Book Essays</title><author><name>The Builder’s Book</name></author><id>${SITE_URL}/essays</id><updated>${updated}</updated><link href="${SITE_URL}/atom.xml" rel="self"/><link href="${SITE_URL}/essays"/>${entries}</feed>`;
}

function nativeLlmsSource() {
  return loader({
    baseUrl: '/',
    source: {
      files: publishedPages.map((page) => ({
        type: 'page' as const,
        path: `${page.url.replace(/^\//, '')}.mdx`,
        data: page.data,
      })),
    },
  });
}

export function buildLlmsIndex(): string {
  return llms(nativeLlmsSource(), {
    renderName(node) {
      if (node.type === 'root') return "Builder's Book";
      if (node.type === 'page') {
        const page = publishedPages.find((candidate) => candidate.url === node.url);
        if (page) return page.data.title;
      }
      return typeof node.name === 'string' ? node.name : '';
    },
  }).index();
}

export async function pageMarkdown(page: PublishedPage): Promise<string> {
  const markdown = await getProcessedMarkdown(page.data);
  return `# ${page.data.title} (${absoluteUrl(page.url)})\n\n> ${page.data.description}\n\n${markdown}`;
}

export async function buildLlmsFull(): Promise<string> {
  return (await Promise.all(publishedPages.map(pageMarkdown))).join('\n\n---\n\n');
}

export function findPublishedPage(collection: string, slug: string[]): PublishedPage | undefined {
  const url = `/${collection}/${slug.join('/')}`.replace(/\/$/, '');
  return publishedPages.find((page) => page.url === url);
}

export function alternateHeaders(canonicalPath: string, contentType = 'text/plain; charset=utf-8') {
  return {
    'Content-Type': contentType,
    Link: `<${absoluteUrl(canonicalPath)}>; rel="canonical"`,
    'X-Robots-Tag': 'noindex, follow',
  };
}

export function articleJsonLd(page: PublishedPage): string {
  const collectionName = page.url.startsWith('/book/') ? 'The Book' : 'Essays';
  const modified = gitLastModified(page.data.info.fullPath, publishedAt(page));
  const article = {
    '@type': 'Article',
    headline: page.data.title,
    description: page.data.description,
    mainEntityOfPage: absoluteUrl(page.url),
    author: { '@type': 'Organization', name: "The Builder’s Book" },
    publisher: { '@type': 'Organization', name: "The Builder’s Book" },
    ...(publishedAt(page) ? { datePublished: `${publishedAt(page)}T00:00:00Z` } : {}),
    ...(modified ? { dateModified: modified } : {}),
  };
  const breadcrumbs = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      {
        '@type': 'ListItem',
        position: 2,
        name: collectionName,
        item: absoluteUrl(page.url.startsWith('/book/') ? '/book' : '/essays'),
      },
      { '@type': 'ListItem', position: 3, name: page.data.title, item: absoluteUrl(page.url) },
    ],
  };

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': [article, breadcrumbs] }).replaceAll('<', '\\u003c');
}
