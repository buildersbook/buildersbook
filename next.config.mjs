import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  agentRules: false,
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/book/:path*.md', destination: '/llms.mdx/book/:path*' },
      { source: '/essays/:path*.md', destination: '/llms.mdx/essays/:path*' },
    ];
  },
};

export default withMDX(config);
