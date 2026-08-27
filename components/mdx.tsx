import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import type { AllowedMdxComponent } from '@/lib/content/constrained-mdx';

import { CodeBlock } from './code-block';
import { Citation, Footnote, Footnotes } from './footnotes';
import { Marginalia } from './marginalia';

function textContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textContent).join(' ');
  if (node && typeof node === 'object' && 'props' in node) {
    return textContent((node.props as { children?: ReactNode }).children);
  }
  return '';
}

function headingId(children: ReactNode): string {
  return textContent(children)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

function heading(level: 1 | 2 | 3 | 4) {
  const Tag = `h${level}` as const;

  return function Heading({ children, id, ...props }: ComponentPropsWithoutRef<typeof Tag>) {
    const anchorId = id ?? headingId(children);
    return (
      <Tag id={anchorId} {...props}>
        {children}
        <a className="heading-anchor" href={`#${anchorId}`} aria-label={`Link to ${textContent(children)}`}>
          <span aria-hidden="true">#</span>
        </a>
      </Tag>
    );
  };
}

const H1 = heading(1);
const H2 = heading(2);
const H3 = heading(3);
const H4 = heading(4);

const htmlElementRenderers = {
  a: defaultMdxComponents.a,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: defaultMdxComponents.h5,
  h6: defaultMdxComponents.h6,
  img: defaultMdxComponents.img,
  pre: CodeBlock,
  table: defaultMdxComponents.table,
} satisfies Pick<MDXComponents, 'a' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'img' | 'pre' | 'table'>;

const allowedMdxComponents = {
  Citation,
  Footnote,
  Footnotes,
  Marginalia,
} satisfies { [Name in AllowedMdxComponent]: MDXComponents[Name] };

export function getMDXComponents(): MDXComponents {
  return { ...htmlElementRenderers, ...allowedMdxComponents };
}
