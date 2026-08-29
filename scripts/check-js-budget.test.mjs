import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import test from 'node:test';

import { classifyClientModule, extractJsChunks, isFirstPartyModuleKey } from './check-js-budget.mjs';

const projectRoot = resolve(import.meta.dirname, '..');
const siteHeaderPath = resolve(projectRoot, 'components/site-header.tsx');

test('isFirstPartyModuleKey requires an existing file for every accepted path', () => {
  assert.equal(
    isFirstPartyModuleKey(resolve(projectRoot, 'does-not-exist.tsx'), projectRoot),
    'rejected:unrecognized-path',
  );
  assert.equal(isFirstPartyModuleKey('components/ghost.tsx', projectRoot), 'rejected:unrecognized-path');
  assert.equal(isFirstPartyModuleKey('totally/made/up.tsx', projectRoot), 'rejected:unrecognized-path');
  assert.equal(isFirstPartyModuleKey('components/site-header.tsx', projectRoot), 'accepted');
  assert.equal(isFirstPartyModuleKey(siteHeaderPath, projectRoot), 'accepted');
  assert.equal(isFirstPartyModuleKey('[project]/components/site-header.tsx', projectRoot), 'accepted');
});

test('isFirstPartyModuleKey rejects unrecognized bracket aliases', () => {
  assert.equal(isFirstPartyModuleKey('[next]/dist/esm/client/x.js', projectRoot), 'rejected:bracket-alias');
});

test('isFirstPartyModuleKey rejects plain and pnpm virtual-store node_modules keys', () => {
  assert.equal(isFirstPartyModuleKey('node_modules/react/index.js', projectRoot), 'rejected:node_modules');
  assert.equal(
    isFirstPartyModuleKey(
      resolve(projectRoot, 'node_modules/.pnpm/react@19.2.8/node_modules/react/index.js'),
      projectRoot,
    ),
    'rejected:node_modules',
  );
});

test('isFirstPartyModuleKey suffix walk accepts only files', () => {
  assert.equal(isFirstPartyModuleKey('/opt/vendor/components/site-header.tsx', projectRoot), 'accepted');
  assert.equal(isFirstPartyModuleKey('/opt/vendor/dist/styles', projectRoot), 'rejected:unrecognized-path');
});

test('classifyClientModule distinguishes async manifest values', () => {
  assert.equal(classifyClientModule(siteHeaderPath, { async: true }, projectRoot), 'rejected:async');
  assert.equal(classifyClientModule(siteHeaderPath, { async: false }, projectRoot), 'accepted');
  assert.equal(classifyClientModule(siteHeaderPath, {}, projectRoot), 'rejected:async-unrecognized');
  assert.equal(classifyClientModule(siteHeaderPath, { async: 'false' }, projectRoot), 'rejected:async-unrecognized');
});

test('extractJsChunks identifies supported script chunks by suffix', () => {
  assert.deepEqual(
    extractJsChunks([
      '101',
      'static/chunks/first.js',
      '102',
      'static/chunks/first.js.map',
      '103',
      'static/chunks/second.js?v=1',
      '104',
      'static/chunks/third.mjs#fragment',
      '105',
      'static/chunks/fourth.cjs',
      null,
      106,
    ]),
    [
      'static/chunks/first.js',
      'static/chunks/second.js',
      'static/chunks/third.mjs',
      'static/chunks/fourth.cjs',
    ],
  );
});

test('extractJsChunks rejects undefined input with a clear TypeError', () => {
  assert.throws(
    () => extractJsChunks(undefined),
    (error) => error instanceof TypeError && error.message === 'extractJsChunks expected an array of chunk entries.',
  );
});
