import type { Root } from 'mdast';
import type { VFile } from 'vfile';

export const MDX_COMPONENT_ALLOWLIST = [
  'Citation',
  'Footnote',
  'Footnotes',
  'Marginalia',
] as const;

type ConstrainedNode = {
  attributes?: Array<{ type: string; value?: unknown }>;
  children?: ConstrainedNode[];
  name?: string | null;
  position?: Root['position'];
  type: string;
};

const allowedComponents = new Set<string>(MDX_COMPONENT_ALLOWLIST);
const expressionNodeTypes = new Set([
  'mdxFlowExpression',
  'mdxTextExpression',
  'mdxjsEsm',
]);

export function validateConstrainedMdxTree(tree: Root, file: VFile): void {
  function visit(node: ConstrainedNode): void {
    if (expressionNodeTypes.has(node.type)) {
      file.fail('FB-01 forbids imports, exports, and inline JavaScript expressions.', node.position);
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
      }
    }

    for (const child of node.children ?? []) visit(child);
  }

  visit(tree as ConstrainedNode);
}

export function remarkConstrainedMdx() {
  return (tree: Root, file: VFile) => validateConstrainedMdxTree(tree, file);
}
