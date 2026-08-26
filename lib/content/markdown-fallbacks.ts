import type { PlaceholderData } from 'fumadocs-core/mdx-plugins/remark-llms.runtime';

type FallbackRenderer = (data: PlaceholderData) => string;

function stringAttribute(data: PlaceholderData, key: string): string | undefined {
  const value = data.attributes[key];
  return typeof value === 'string' ? value : undefined;
}

export const markdownFallbacks: Record<string, FallbackRenderer> = {
  Citation(data) {
    const href = stringAttribute(data, 'href');
    const label = data.children.trim() || stringAttribute(data, 'label') || 'Source';
    return href ? `[${label}](${href})` : label;
  },
  Footnote(data) {
    const id = stringAttribute(data, 'id') ?? 'note';
    return `[^${id}]`;
  },
  Footnotes(data) {
    return `\n\n${data.children.trim()}\n`;
  },
  Marginalia(data) {
    const label = stringAttribute(data, 'label') ?? 'Margin note';
    const body = data.children.trim().replaceAll('\n', '\n> ');
    return `\n\n> **${label}:** ${body}\n`;
  },
};
