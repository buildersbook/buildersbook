import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';

const scanner = resolve(import.meta.dirname, 'check-private.sh');

function scanFixture(t, manifest, content = 'Ordinary public text.\n') {
  const root = mkdtempSync(join(tmpdir(), 'buildersbook-private-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const scanRoot = join(root, 'worktree');
  mkdirSync(scanRoot);
  writeFileSync(join(scanRoot, 'content.txt'), content);
  const manifestPath = join(root, 'manifest.txt');
  if (manifest !== undefined) writeFileSync(manifestPath, manifest);
  return spawnSync('sh', [scanner], {
    cwd: scanRoot,
    env: { ...process.env, BUILDERSBOOK_PRIVATE_MANIFEST: manifestPath },
    encoding: 'utf8',
  });
}

for (const [label, manifest] of [
  ['empty', ''],
  ['whitespace-only', ' \t\r\n\n\t \n\v\f\n'],
]) {
  test(`D3: ${label} manifests fail closed with a distinct status and no contents`, (t) => {
    const result = scanFixture(t, manifest);
    assert.equal(result.status, 3);
    assert.equal(result.stdout, '');
    assert.equal(result.stderr, 'check-private: manifest has no nonblank identifiers; refusing to scan\n');
  });
}

test('D3: missing manifests retain the configuration-error status', (t) => {
  const result = scanFixture(t, undefined);
  assert.equal(result.status, 2);
  assert.equal(result.stdout, '');
  assert.match(result.stderr, /check-private: manifest not found/);
});

test('D3: blank lines around a real identifier do not cause false matches', (t) => {
  const result = scanFixture(t, ' \nscanner-fixture-marker\n\t\n');
  assert.equal(result.status, 0);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, '');
});

test('D3: nonblank identifiers still detect matching text', (t) => {
  const result = scanFixture(t, ' \nscanner-fixture-marker\n\t\n', 'SCANNER-FIXTURE-MARKER\n');
  assert.equal(result.status, 1);
  assert.match(result.stdout, /content\.txt:1:SCANNER-FIXTURE-MARKER/);
  assert.equal(result.stderr, '');
});
