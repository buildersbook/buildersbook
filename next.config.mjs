import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  agentRules: false,
  // Opt in to one LAN host for device testing; enforced only by the dev server.
  allowedDevOrigins: process.env.BUILDERSBOOK_DEV_ORIGIN ? [process.env.BUILDERSBOOK_DEV_ORIGIN] : [],
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      { source: '/book/:path*.md', destination: '/llms.mdx/book/:path*' },
      { source: '/essays/:path*.md', destination: '/llms.mdx/essays/:path*' },
    ];
  },
};

export default withMDX(config);
