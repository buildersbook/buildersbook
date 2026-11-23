import assert from 'node:assert/strict';
import test from 'node:test';

import { register } from 'fumadocs-mdx/node';

import nextConfig from '../next.config.mjs';

test('next.config.mjs configures the exact three security header policies on every route', async () => {
  assert.equal(typeof nextConfig.headers, 'function');
  const rules = await nextConfig.headers();
  assert.equal(rules.length, 1);

  const [rule] = rules;
  assert.equal(rule.source, '/:path*');
  assert.deepEqual(rule.headers, [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
  ]);

  const csp = rule.headers.find((header) => header.key === 'Content-Security-Policy');
  assert.equal(csp?.value, "frame-ancestors 'none'");
  assert.ok(!csp.value.includes(';'), 'CSP must contain only frame-ancestors and no additional directives');
});

test('alternate .md headers remain intact and do not collide with global security headers', async () => {
  register();
  const { alternateHeaders } = await import('../lib/discovery.ts');
  const [rule] = await nextConfig.headers();
  const globalKeys = new Set(rule.headers.map((header) => header.key.toLowerCase()));

  const alt = alternateHeaders('/essays/agent-enforcement-hooks');
  assert.equal(alt['X-Robots-Tag'], 'noindex, follow');
  assert.equal(alt.Link, '<https://buildersbook.dev/essays/agent-enforcement-hooks>; rel="canonical"');
  for (const key of Object.keys(alt)) {
    assert.ok(!globalKeys.has(key.toLowerCase()), `Global security headers must not overwrite ${key}`);
  }
});
