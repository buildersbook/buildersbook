import { isValidElement, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { CodeCopyButton } from './code-copy-button';

type CodeBlockProps = ComponentPropsWithoutRef<'pre'> & {
  title?: string;
};

function codeText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(codeText).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) return codeText(node.props.children);
  return '';
}

export function CodeBlock({ children, title, ...props }: CodeBlockProps) {
  const value = codeText(children).replace(/\n$/, '');

  return (
    <figure className="code-block">
      <figcaption className="code-block-header">
        <span className="code-block-filename functional-label">{title ?? 'Code'}</span>
        <CodeCopyButton value={value} />
      </figcaption>
      <pre {...props} tabIndex={0} aria-label={title ? `Code: ${title}` : 'Code sample'}>
        {children}
      </pre>
    </figure>
  );
}
