import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmodSync, copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';

const scanner = resolve(import.meta.dirname, 'check-private.sh');
const prePushHook = resolve(import.meta.dirname, 'hooks/pre-push');

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, { encoding: 'utf8', ...options });
  if (result.error) throw result.error;
  return result;
}

function git(cwd, args, extraEnv = {}) {
  const result = run('git', args, {
    cwd,
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: 'Test Author',
      GIT_AUTHOR_EMAIL: 'test@example.com',
      GIT_COMMITTER_NAME: 'Test Author',
      GIT_COMMITTER_EMAIL: 'test@example.com',
      ...extraEnv,
    },
  });
  return result;
}

function mustGit(cwd, args, extraEnv = {}) {
  const result = git(cwd, args, extraEnv);
  assert.equal(result.status, 0, `git ${args.join(' ')} failed: ${result.stderr}`);
  return result.stdout.trim();
}

function createRepoFixture(t, { manifest, initialFiles = { 'content.txt': 'Ordinary public text.\n' }, withRemote = false } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'buildersbook-private-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));

  const worktree = join(root, 'worktree');
  mkdirSync(worktree);

  // Install copies of scripts/check-private.sh and scripts/hooks/pre-push so the
  // hook resolves repo_root/scripts/check-private.sh inside the fixture repo.
  mkdirSync(join(worktree, 'scripts', 'hooks'), { recursive: true });
  copyFileSync(scanner, join(worktree, 'scripts', 'check-private.sh'));
  copyFileSync(prePushHook, join(worktree, 'scripts', 'hooks', 'pre-push'));
  chmodSync(join(worktree, 'scripts', 'check-private.sh'), 0o755);
  chmodSync(join(worktree, 'scripts', 'hooks', 'pre-push'), 0o755);

  mustGit(worktree, ['init', '-b', 'main']);
  mustGit(worktree, ['config', 'core.hooksPath', 'scripts/hooks']);

  for (const [relPath, content] of Object.entries(initialFiles)) {
    const full = join(worktree, relPath);
    mkdirSync(join(full, '..'), { recursive: true });
    writeFileSync(full, content);
  }
  mustGit(worktree, ['add', '.']);
  mustGit(worktree, ['commit', '-m', 'Initial clean commit']);

  let remoteDir = null;
  if (withRemote) {
    remoteDir = join(root, 'remote.git');
    mkdirSync(remoteDir);
    mustGit(remoteDir, ['init', '--bare', '-b', 'main']);
    mustGit(worktree, ['remote', 'add', 'origin', remoteDir]);
  }

  let manifestPath;
  if (manifest !== undefined) {
    manifestPath = join(root, 'manifest.txt');
    writeFileSync(manifestPath, manifest);
  }

  return { root, worktree, remoteDir, manifestPath };
}

function runScanner(worktree, manifestPath, extraArgs = [], extraEnv = {}) {
  const env = { ...process.env, ...extraEnv };
  if (manifestPath === null) {
    delete env.BUILDERSBOOK_PRIVATE_MANIFEST;
  } else {
    env.BUILDERSBOOK_PRIVATE_MANIFEST = manifestPath;
  }
  return run('sh', [scanner, ...extraArgs], { cwd: worktree, env });
}

for (const [label, manifest] of [
  ['empty', ''],
  ['whitespace-only', ' \t\r\n\n\t \n\v\f\n'],
]) {
  test(`fail-closed: ${label} manifests exit 3 with no contents`, (t) => {
    const { worktree, manifestPath } = createRepoFixture(t, { manifest });
    const result = runScanner(worktree, manifestPath);
    assert.equal(result.status, 3);
    assert.equal(result.stdout, '');
    assert.equal(result.stderr, 'check-private: manifest has no nonblank identifiers; refusing to scan\n');
  });
}

test('fail-closed: missing manifest exits 2', (t) => {
  const { root, worktree } = createRepoFixture(t);
  const result = runScanner(worktree, join(root, 'does-not-exist.txt'));
  assert.equal(result.status, 2);
  assert.equal(result.stdout, '');
  assert.match(result.stderr, /check-private: manifest not found/);
});

test('fail-closed: unset manifest exits 2 for scanner and pre-push hook', (t) => {
  const { worktree } = createRepoFixture(t, { withRemote: true });

  const scanRes = runScanner(worktree, null);
  assert.equal(scanRes.status, 2);
  assert.equal(scanRes.stdout, '');
  assert.match(scanRes.stderr, /BUILDERSBOOK_PRIVATE_MANIFEST is unset/);

  const pushEnv = { ...process.env };
  delete pushEnv.BUILDERSBOOK_PRIVATE_MANIFEST;
  const pushRes = run('git', ['push', 'origin', 'main'], { cwd: worktree, env: pushEnv });
  assert.notEqual(pushRes.status, 0);
  assert.match(pushRes.stderr, /pre-push: BUILDERSBOOK_PRIVATE_MANIFEST is unset/);
});

test('falsification control: planted word exits 1 and never echoes matched text or term', (t) => {
  const term = 'synthetic-canary-token';
  const planted = 'SYNTHETIC-CANARY-TOKEN';
  const { worktree, manifestPath } = createRepoFixture(t, {
    manifest: ` \n${term}\n\t\n`,
    initialFiles: { 'content.txt': `Safe line\n${planted} here\n` },
  });

  const result = runScanner(worktree, manifestPath);
  assert.equal(result.status, 1);
  assert.equal(result.stderr, '');
  assert.match(result.stdout, /content\.txt:2 \(manifest line 2\)/);
  assert.ok(!result.stdout.toLowerCase().includes(term), 'stdout must not leak manifest term');
  assert.ok(!result.stdout.includes(planted), 'stdout must not leak matched text');
});

test('separator variants and literal regex metacharacters match case-insensitively', (t) => {
  const manifest = [
    '',
    'alpha-beta_gamma delta',
    '~/path/with.dots+plus(1)/[a-z]*$end',
  ].join('\n');
  const { worktree, manifestPath } = createRepoFixture(t, {
    manifest,
    initialFiles: {
      'variants.txt': [
        'clean line',
        'ALPHA_BETA GAMMA-DELTA',
        'see ~/PATH/WITH.DOTS+PLUS(1)/[A-Z]*$END in prose',
      ].join('\n') + '\n',
    },
  });

  const result = runScanner(worktree, manifestPath);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /variants\.txt:2 \(manifest line 2\)/);
  assert.match(result.stdout, /variants\.txt:3 \(manifest line 3\)/);
  assert.ok(!result.stdout.toLowerCase().includes('alpha'));
  assert.ok(!result.stdout.toLowerCase().includes('dots'));
});

test('untracked and gitignored files do not trigger tree scan or pre-push hits', (t) => {
  const term = 'synthetic-ignored-secret';
  const { worktree, manifestPath } = createRepoFixture(t, {
    manifest: `${term}\n`,
    initialFiles: {
      '.gitignore': 'ignored-dir/\n*.local\n',
      'content.txt': 'Public content only.\n',
    },
    withRemote: true,
  });

  mkdirSync(join(worktree, 'ignored-dir'), { recursive: true });
  writeFileSync(join(worktree, 'ignored-dir', 'leak.txt'), `${term}\n`);
  writeFileSync(join(worktree, 'notes.local'), `${term}\n`);
  writeFileSync(join(worktree, 'untracked.txt'), `${term}\n`);

  const scanRes = runScanner(worktree, manifestPath);
  assert.equal(scanRes.status, 0, scanRes.stdout + scanRes.stderr);
  assert.equal(scanRes.stdout, '');

  const pushRes = git(worktree, ['push', '-u', 'origin', 'main'], {
    BUILDERSBOOK_PRIVATE_MANIFEST: manifestPath,
  });
  assert.equal(pushRes.status, 0, pushRes.stdout + pushRes.stderr);
});

test('pre-push end to end: added diff line in pushed range fails even when later commit removes it', (t) => {
  const term = 'synthetic-range-leak';
  const { worktree, manifestPath } = createRepoFixture(t, {
    manifest: `first-unused\n${term}\n`,
    withRemote: true,
  });

  // Establish clean baseline on origin/main.
  mustGit(worktree, ['push', '-u', 'origin', 'main'], {
    BUILDERSBOOK_PRIVATE_MANIFEST: manifestPath,
  });

  // Commit 1 adds the term (using a separator variant), commit 2 removes it so working tree is clean.
  writeFileSync(join(worktree, 'content.txt'), 'Ordinary public text.\nsynthetic_range leak\n');
  mustGit(worktree, ['add', 'content.txt']);
  mustGit(worktree, ['commit', '-m', 'Add temporary note']);
  const dirtyCommit = mustGit(worktree, ['rev-parse', 'HEAD']);

  writeFileSync(join(worktree, 'content.txt'), 'Ordinary public text.\n');
  mustGit(worktree, ['add', 'content.txt']);
  mustGit(worktree, ['commit', '-m', 'Remove temporary note']);

  // Working tree scan passes, but pre-push catches the added diff line in the pushed range.
  const treeRes = runScanner(worktree, manifestPath);
  assert.equal(treeRes.status, 0);

  const pushRes = git(worktree, ['push', 'origin', 'main'], {
    BUILDERSBOOK_PRIVATE_MANIFEST: manifestPath,
  });
  assert.notEqual(pushRes.status, 0);
  const combined = pushRes.stdout + pushRes.stderr;
  assert.match(combined, new RegExp(`${dirtyCommit}:content\\.txt:2 \\(manifest line 2\\)`));
  assert.ok(!combined.toLowerCase().includes('synthetic'));
});

test('pre-push end to end: commit message hit fails push without echoing term', (t) => {
  const term = 'synthetic-message-term';
  const { worktree, manifestPath } = createRepoFixture(t, {
    manifest: `${term}\n`,
    withRemote: true,
  });

  mustGit(worktree, ['push', '-u', 'origin', 'main'], {
    BUILDERSBOOK_PRIVATE_MANIFEST: manifestPath,
  });

  writeFileSync(join(worktree, 'content.txt'), 'Still clean text.\n');
  mustGit(worktree, ['add', 'content.txt']);
  mustGit(worktree, ['commit', '-m', 'Update mentioning SYNTHETIC MESSAGE_TERM']);
  const badCommit = mustGit(worktree, ['rev-parse', 'HEAD']);

  const pushRes = git(worktree, ['push', 'origin', 'main'], {
    BUILDERSBOOK_PRIVATE_MANIFEST: manifestPath,
  });
  assert.notEqual(pushRes.status, 0);
  const combined = pushRes.stdout + pushRes.stderr;
  assert.match(combined, new RegExp(`${badCommit}:message \\(manifest line 1\\)`));
  assert.ok(!combined.toLowerCase().includes('synthetic'));
});

test('pre-push end to end: removed lines never fail a push', (t) => {
  const term = 'synthetic-preexisting-term';
  const { worktree, manifestPath } = createRepoFixture(t, {
    manifest: `${term}\n`,
    initialFiles: { 'content.txt': `Keep this line.\n${term}\n` },
    withRemote: true,
  });

  // Simulate historical residue already present on origin/main.
  mustGit(worktree, ['push', '--no-verify', '-u', 'origin', 'main']);

  // Remove the private term in a new commit; pushing the removal must succeed.
  writeFileSync(join(worktree, 'content.txt'), 'Keep this line.\n');
  mustGit(worktree, ['add', 'content.txt']);
  mustGit(worktree, ['commit', '-m', 'Remove legacy line']);

  const pushRes = git(worktree, ['push', 'origin', 'main'], {
    BUILDERSBOOK_PRIVATE_MANIFEST: manifestPath,
  });
  assert.equal(pushRes.status, 0, pushRes.stdout + pushRes.stderr);
});

test('pre-push end to end: new ref with no remote counterpart scans new commits only', (t) => {
  const term = 'synthetic-branch-secret';
  const { worktree, manifestPath } = createRepoFixture(t, {
    manifest: `${term}\n`,
    initialFiles: { 'content.txt': 'Clean base.\n' },
    withRemote: true,
  });

  // Push a clean main first.
  mustGit(worktree, ['push', '-u', 'origin', 'main'], {
    BUILDERSBOOK_PRIVATE_MANIFEST: manifestPath,
  });

  // Create a brand-new branch with a dirty commit and push it (remote_sha is all zeros).
  mustGit(worktree, ['checkout', '-b', 'feature/new-ref']);
  writeFileSync(join(worktree, 'content.txt'), `Clean base.\n${term}\n`);
  mustGit(worktree, ['add', 'content.txt']);
  mustGit(worktree, ['commit', '-m', 'Feature commit']);
  const featureCommit = mustGit(worktree, ['rev-parse', 'HEAD']);

  const failPush = git(worktree, ['push', 'origin', 'feature/new-ref'], {
    BUILDERSBOOK_PRIVATE_MANIFEST: manifestPath,
  });
  assert.notEqual(failPush.status, 0);
  const combined = failPush.stdout + failPush.stderr;
  assert.match(combined, new RegExp(`${featureCommit}:content\\.txt:2 \\(manifest line 1\\)`));

  // Reset to clean and push the new branch cleanly.
  mustGit(worktree, ['reset', '--hard', 'origin/main']);
  writeFileSync(join(worktree, 'content.txt'), 'Clean base.\nClean addition.\n');
  mustGit(worktree, ['add', 'content.txt']);
  mustGit(worktree, ['commit', '-m', 'Clean feature commit']);

  const okPush = git(worktree, ['push', 'origin', 'feature/new-ref'], {
    BUILDERSBOOK_PRIVATE_MANIFEST: manifestPath,
  });
  assert.equal(okPush.status, 0, okPush.stdout + okPush.stderr);
});

test('pre-push end to end: initial push to an empty remote scans root commit', (t) => {
  const term = 'synthetic-root-leak';
  const { worktree, manifestPath } = createRepoFixture(t, {
    manifest: `${term}\n`,
    initialFiles: { 'content.txt': `${term}\n` },
    withRemote: true,
  });
  const rootCommit = mustGit(worktree, ['rev-parse', 'HEAD']);

  // Remove the term in commit 2 so only the root commit diff has it.
  writeFileSync(join(worktree, 'content.txt'), 'Cleaned.\n');
  mustGit(worktree, ['add', 'content.txt']);
  mustGit(worktree, ['commit', '-m', 'Clean tree']);

  const failPush = git(worktree, ['push', 'origin', 'main'], {
    BUILDERSBOOK_PRIVATE_MANIFEST: manifestPath,
  });
  assert.notEqual(failPush.status, 0);
  const combined = failPush.stdout + failPush.stderr;
  assert.match(combined, new RegExp(`${rootCommit}:content\\.txt:1 \\(manifest line 1\\)`));
});

test('range mode scans added lines and commit messages while ignoring removed lines', (t) => {
  const term = 'synthetic-range-only';
  const { worktree, manifestPath } = createRepoFixture(t, {
    manifest: `${term}\n`,
    initialFiles: { 'content.txt': `Keep.\n${term}\n` },
  });
  const base = mustGit(worktree, ['rev-parse', 'HEAD']);

  // Remove the term: range base..HEAD has only a removed line and must pass.
  writeFileSync(join(worktree, 'content.txt'), 'Keep.\n');
  mustGit(worktree, ['add', 'content.txt']);
  mustGit(worktree, ['commit', '-m', 'Drop old line']);

  const passRes = runScanner(worktree, manifestPath, ['--range', `${base}..HEAD`]);
  assert.equal(passRes.status, 0, passRes.stdout + passRes.stderr);
  assert.equal(passRes.stdout, '');

  // Add a commit whose message contains a separator variant: range must fail.
  writeFileSync(join(worktree, 'content.txt'), 'Keep.\nMore clean text.\n');
  mustGit(worktree, ['add', 'content.txt']);
  mustGit(worktree, ['commit', '-m', 'Note synthetic_range_only']);
  const head = mustGit(worktree, ['rev-parse', 'HEAD']);

  const failRes = runScanner(worktree, manifestPath, ['--range', `${base}..HEAD`]);
  assert.equal(failRes.status, 1);
  assert.match(failRes.stdout, new RegExp(`${head}:message \\(manifest line 1\\)`));
  assert.ok(!failRes.stdout.toLowerCase().includes('synthetic'));
});
