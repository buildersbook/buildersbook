import type { Root } from 'mdast';
import type { VFile } from 'vfile';

export const MDX_COMPONENT_ALLOWLIST = [
  'Citation',
  'Footnote',
  'Footnotes',
  'Marginalia',
] as const;

export type AllowedMdxComponent = (typeof MDX_COMPONENT_ALLOWLIST)[number];

type ConstrainedNode = {
  attributes?: Array<{ name?: string; type: string; value?: unknown }>;
  children?: ConstrainedNode[];
  data?: { hProperties?: { id?: unknown } };
  depth?: number;
  name?: string | null;
  position?: Root['position'];
  type: string;
  url?: string;
  value?: string;
};

const allowedComponents = new Set<string>(MDX_COMPONENT_ALLOWLIST);
const prohibitedNodeTypes = new Set([
  'html',
  'mdxFlowExpression',
  'mdxTextExpression',
  'mdxjsEsm',
]);

export function isAllowedLinkDestination(destination: string): boolean {
  const value = destination.trim();
  if (!value || value.startsWith('//')) return false;
  const scheme = value.match(/^([a-z][a-z\d+.-]*):/i)?.[1]?.toLowerCase();
  return scheme === undefined || scheme === 'https' || scheme === 'mailto';
}

function headingText(node: ConstrainedNode): string {
  if (typeof node.value === 'string') return node.value;
  return (node.children ?? []).map(headingText).join('');
}

function headingSlug(value: string): string {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
    .trim()
    .replace(/[\s-]+/g, '-') || 'section';
}

export function deduplicateHeadingIds(tree: Root): void {
  const counts = new Map<string, number>();

  function visit(node: ConstrainedNode): void {
    if (node.type === 'heading') {
      const slug = headingSlug(headingText(node));
      const count = counts.get(slug) ?? 0;
      counts.set(slug, count + 1);
      node.data ??= {};
      node.data.hProperties ??= {};
      node.data.hProperties.id = count === 0 ? slug : `${slug}-${count}`;
    }

    for (const child of node.children ?? []) visit(child);
  }

  visit(tree as ConstrainedNode);
}

export function validateConstrainedMdxTree(tree: Root, file: VFile): void {
  function visit(node: ConstrainedNode): void {
    if (prohibitedNodeTypes.has(node.type)) {
      file.fail('FB-01 forbids raw HTML, imports, exports, and inline JavaScript expressions.', node.position);
    }

    if ((node.type === 'link' || node.type === 'definition')
      && typeof node.url === 'string'
      && !isAllowedLinkDestination(node.url)) {
      file.fail('FB-01 permits only https, mailto, and relative link destinations.', node.position);
    }

    if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
      if (!node.name || !allowedComponents.has(node.name)) {
        file.fail(`FB-01 does not allow the MDX component <${node.name ?? 'fragment'}>.`, node.position);
      }

      for (const attribute of node.attributes ?? []) {
        const isLiteralAttribute = attribute.type === 'mdxJsxAttribute'
          && (attribute.value === null || typeof attribute.value === 'string');

        if (!isLiteralAttribute) {
          file.fail('FB-01 allows only literal string attributes on approved MDX components.', node.position);
        }

        if (attribute.name === 'href'
          && typeof attribute.value === 'string'
          && !isAllowedLinkDestination(attribute.value)) {
          file.fail('FB-01 permits only https, mailto, and relative href attributes.', node.position);
        }
      }
    }

    for (const child of node.children ?? []) visit(child);
  }

  visit(tree as ConstrainedNode);
}

export function remarkConstrainedMdx() {
  return (tree: Root, file: VFile) => validateConstrainedMdxTree(tree, file);
}

export function remarkDeduplicateHeadingIds() {
  return (tree: Root) => deduplicateHeadingIds(tree);
}
