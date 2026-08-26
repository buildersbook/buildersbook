import { defineCollections, defineConfig } from 'fumadocs-mdx/config';

export const book = defineCollections({
  type: 'doc',
  dir: 'content/book',
});

export const blog = defineCollections({
  type: 'doc',
  dir: 'content/blog',
});

export default defineConfig();
