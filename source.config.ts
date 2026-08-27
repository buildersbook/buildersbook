import { defineCollections, defineConfig } from 'fumadocs-mdx/config';

import {
  MDX_COMPONENT_ALLOWLIST,
  remarkConstrainedMdx,
  remarkDeduplicateHeadingIds,
} from './lib/content/constrained-mdx';
import { bookFrontmatterSchema, essayFrontmatterSchema } from './lib/content/schemas';

const postprocess = {
  includeMDAST: true,
  includeProcessedMarkdown: {
    mdxAsPlaceholder: [...MDX_COMPONENT_ALLOWLIST],
  },
};

export const book = defineCollections({
  type: 'doc',
  dir: 'content/book',
  files: ['**/*.mdx'],
  schema: bookFrontmatterSchema,
  postprocess,
});

export const essays = defineCollections({
  type: 'doc',
  dir: 'content/essays',
  files: ['**/*.mdx'],
  schema: essayFrontmatterSchema,
  postprocess,
});

export default defineConfig({
  mdxOptions: {
    remarkCodeTabOptions: false,
    remarkNpmOptions: false,
    remarkPlugins: (plugins) => [remarkConstrainedMdx, ...plugins, remarkDeduplicateHeadingIds],
  },
});
