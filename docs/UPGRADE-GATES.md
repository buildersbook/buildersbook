# Upgrade Gates

## fumadocs-mdx Turbopack support

At every `fumadocs-mdx` version bump, re-test the production build without `--webpack`. Remove the webpack override only when the full local gate suite passes on the native Turbopack path.

- Current package: `fumadocs-mdx` 15.3.1.
- Current command: `next build --webpack`.
- Re-test command: `pnpm exec next build`.
- Passing evidence required: lint, typecheck, tests, content generation, all routes, and the hard JavaScript budget.
