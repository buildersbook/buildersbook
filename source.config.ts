import { defineCollections, defineConfig } from 'fumadocs-mdx/config';

import { MDX_COMPONENT_ALLOWLIST, remarkConstrainedMdx } from './lib/content/constrained-mdx';
import { blogFrontmatterSchema, bookFrontmatterSchema } from './lib/content/schemas';

const postprocess = {
  includeMDAST: true,
  includeProcessedMarkdown: {
    mdxAsPlaceholder: [...MDX_COMPONENT_ALLOWLIST],
  },
};

export const book = defineCollections({
  type: 'doc',
  dir: 'content/book',
  schema: bookFrontmatterSchema,
  postprocess,
});

export const blog = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: blogFrontmatterSchema,
  postprocess,
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkConstrainedMdx],
  },
});
