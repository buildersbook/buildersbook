import assert from 'node:assert/strict';
import test from 'node:test';

import { collectDiscoveryPaths } from '../lib/content/discovery-paths.ts';

const essay = '/essays/agent-enforcement-hooks';

test('M-1: absolute discovery URLs shed trailing prose punctuation', () => {
  for (const suffix of ['.', ',', ';', ':', '!', '?', '…', ').', '”', '’']) {
    assert.deepEqual(collectDiscoveryPaths(`See https://buildersbook.dev${essay}${suffix}`), new Set([essay]), suffix);
  }
});

test('M-1: bare root-relative paths are collected in prose and on their own', () => {
  for (const value of [essay, `Read ${essay}.`, `Draft: (${essay});`, `\n${essay}\n`]) {
    assert.deepEqual(collectDiscoveryPaths(value), new Set([essay]), value);
  }
});

test('M-1: Markdown, XML, and quoted attribute destinations remain discoverable', () => {
  for (const value of [
    `[Essay](${essay})`,
    `[Essay](https://buildersbook.dev${essay})`,
    `<loc>https://buildersbook.dev${essay}</loc>`,
    `<link href="https://buildersbook.dev${essay}"/>`,
    `<a href="${essay}">Essay</a>`,
    `\`${essay}\``,
  ]) {
    assert.ok(collectDiscoveryPaths(value).has(essay), value);
  }
});

test('M-1: queries, fragments, trailing slashes, and duplicates normalize to the page path', () => {
  assert.deepEqual(
    collectDiscoveryPaths(`${essay}/ https://buildersbook.dev${essay}?view=full#notes ${essay}#notes`),
    new Set([essay]),
  );
  assert.deepEqual(collectDiscoveryPaths(`${essay}.md`), new Set([`${essay}.md`]));
  assert.deepEqual(collectDiscoveryPaths('https://buildersbook.dev/ /'), new Set(['/']));
});

test('M-1: external origins and relative path fragments do not impersonate local pages', () => {
  for (const value of [
    `https://example.com${essay}`,
    `https://buildersbook.dev.example.com${essay}`,
    `https://buildersbook.dev@evil.example${essay}`,
    `https://buildersbook.dev:8443${essay}`,
    `//example.com${essay}`,
    `relative${essay}`,
    `.${essay}`,
    `..${essay}`,
    'https://[malformed',
  ]) {
    assert.deepEqual(collectDiscoveryPaths(value), new Set(), value);
  }
});
