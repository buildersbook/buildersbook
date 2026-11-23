#!/bin/sh

# The private-identifier manifest lives OUTSIDE this repository, alongside the
# identity register. Never commit the manifest, its path, or its contents.

set -u

if [ -z "${BUILDERSBOOK_PRIVATE_MANIFEST:-}" ]; then
  echo "check-private: BUILDERSBOOK_PRIVATE_MANIFEST is unset; point it to the external private-identifier manifest" >&2
  exit 2
fi

if [ ! -f "$BUILDERSBOOK_PRIVATE_MANIFEST" ]; then
  echo "check-private: manifest not found" >&2
  exit 2
fi

exec node --input-type=module -e '
import { spawnSync } from "node:child_process";
import { lstatSync, readFileSync } from "node:fs";
import { join } from "node:path";

const manifestPath = process.env.BUILDERSBOOK_PRIVATE_MANIFEST;
let rawManifest;
try {
  rawManifest = readFileSync(manifestPath, "utf8");
} catch {
  process.stderr.write("check-private: manifest could not be read\n");
  process.exit(2);
}

function normalize(text) {
  return text.toLowerCase().replace(/[-_]/g, " ");
}

const entries = [];
const manifestLines = rawManifest.split(/\r?\n/);
for (let i = 0; i < manifestLines.length; i += 1) {
  const line = manifestLines[i];
  if (line.trim().length === 0) continue;
  entries.push({
    lineNumber: i + 1,
    normalized: normalize(line),
  });
}

if (entries.length === 0) {
  process.stderr.write("check-private: manifest has no nonblank identifiers; refusing to scan\n");
  process.exit(3);
}

const args = process.argv.slice(1);
let mode = "tree";
let rangeArg = null;
let remoteName = "";

if (args.length === 0) {
  mode = "tree";
} else if (args[0] === "--pre-push" && args.length <= 2) {
  mode = "pre-push";
  remoteName = args[1] ?? "";
} else if (args[0] === "--range" && args.length === 2 && args[1].length > 0) {
  mode = "range";
  rangeArg = args[1];
} else {
  process.stderr.write("check-private: usage: check-private.sh [--pre-push [remote] | --range <rev-range>]\n");
  process.exit(2);
}

function runGit(gitArgs, cwd = process.cwd()) {
  const result = spawnSync("git", gitArgs, {
    cwd,
    encoding: "utf8",
    maxBuffer: 128 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) {
    const detail = result.error ? result.error.message : (result.stderr || "").trim();
    process.stderr.write(`check-private: git ${gitArgs[0]} failed${detail ? `: ${detail}` : ""}\n`);
    process.exit(2);
  }
  return result.stdout;
}

const repoRoot = runGit(["rev-parse", "--show-toplevel"]).trim();
const hits = [];

function checkTextLine(location, text) {
  const normalized = normalize(text);
  for (const entry of entries) {
    if (normalized.includes(entry.normalized)) {
      hits.push(`${location} (manifest line ${entry.lineNumber})`);
    }
  }
}

function scanTree() {
  const trackedRaw = runGit(["ls-files", "-z"], repoRoot);
  const relPaths = trackedRaw.split("\0").filter(Boolean);

  for (const relPath of relPaths) {
    const fullPath = join(repoRoot, relPath);
    let stat;
    try {
      stat = lstatSync(fullPath);
    } catch {
      continue;
    }
    if (!stat.isFile()) continue;

    const buf = readFileSync(fullPath);
    if (buf.includes(0)) continue;

    const lines = buf.toString("utf8").split(/\r?\n/);
    for (let i = 0; i < lines.length; i += 1) {
      checkTextLine(`${relPath}:${i + 1}`, lines[i]);
    }
  }
}

function scanUnifiedDiff(commitHash, diff) {
  const lines = diff.split(/\r?\n/);
  let currentFile = null;
  let inHunk = false;
  let newLineNumber = 0;

  for (const line of lines) {
    if (line.startsWith("diff --git ")) {
      currentFile = null;
      inHunk = false;
      continue;
    }
    if (!inHunk) {
      if (line.startsWith("+++ b/")) {
        currentFile = line.slice(6);
        continue;
      }
      if (line.startsWith("+++ /dev/null")) {
        currentFile = null;
        continue;
      }
    }
    if (line.startsWith("@@ ")) {
      const match = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(line);
      if (match) {
        inHunk = true;
        newLineNumber = Number(match[1]);
        continue;
      }
    }
    if (!inHunk || !currentFile) continue;

    if (line.startsWith("+")) {
      checkTextLine(`${commitHash}:${currentFile}:${newLineNumber}`, line.slice(1));
      newLineNumber += 1;
    } else if (line.startsWith(" ")) {
      newLineNumber += 1;
    }
  }
}

function scanCombinedDiff(commitHash, diff, parentCount) {
  const lines = diff.split(/\r?\n/);
  let currentFile = null;
  let inHunk = false;
  let newLineNumber = 0;
  const hunkHeaderRe = new RegExp(`^@{${parentCount + 1}} .* \\+(\\d+)(?:,\\d+)? @{${parentCount + 1}}`);

  for (const line of lines) {
    if (line.startsWith("diff --cc ") || line.startsWith("diff --combined ") || line.startsWith("diff --git ")) {
      currentFile = null;
      inHunk = false;
      continue;
    }
    if (!inHunk) {
      if (line.startsWith("+++ b/")) {
        currentFile = line.slice(6);
        continue;
      }
      if (line.startsWith("+++ /dev/null")) {
        currentFile = null;
        continue;
      }
    }
    const match = hunkHeaderRe.exec(line);
    if (match) {
      inHunk = true;
      newLineNumber = Number(match[1]);
      continue;
    }
    if (!inHunk || !currentFile) continue;
    if (line.startsWith("\\")) continue;

    const prefix = line.slice(0, parentCount);
    if (prefix.length === parentCount && !prefix.includes("-") && prefix.includes("+")) {
      checkTextLine(`${commitHash}:${currentFile}:${newLineNumber}`, line.slice(parentCount));
      newLineNumber += 1;
    } else if (prefix.length === parentCount && !prefix.includes("-")) {
      newLineNumber += 1;
    }
  }
}

function scanCommit(commitHash) {
  const message = runGit(["show", "--no-patch", "--format=%B", commitHash], repoRoot);
  const normalizedMessage = normalize(message);
  for (const entry of entries) {
    if (normalizedMessage.includes(entry.normalized)) {
      hits.push(`${commitHash}:message (manifest line ${entry.lineNumber})`);
    }
  }

  const parentsLine = runGit(["rev-list", "--parents", "-n", "1", commitHash], repoRoot).trim();
  const parentCount = Math.max(0, parentsLine.split(/\s+/).length - 1);

  if (parentCount <= 1) {
    const diff = runGit(
      ["-c", "core.quotepath=false", "diff-tree", "--no-commit-id", "--root", "-p", "--unified=0", "--no-color", "--no-ext-diff", "--no-textconv", commitHash],
      repoRoot,
    );
    scanUnifiedDiff(commitHash, diff);
  } else {
    const diff = runGit(
      ["-c", "core.quotepath=false", "show", "--format=", "--cc", "-p", "--unified=0", "--no-color", "--no-ext-diff", "--no-textconv", commitHash],
      repoRoot,
    );
    scanCombinedDiff(commitHash, diff, parentCount);
  }
}

function isZeroSha(sha) {
  return /^0+$/.test(sha);
}

function commitExists(sha) {
  const result = spawnSync("git", ["cat-file", "-e", `${sha}^{commit}`], { cwd: repoRoot });
  return !result.error && result.status === 0;
}

function collectRemoteTips(remote) {
  if (remote) {
    const remotes = runGit(["remote"], repoRoot).split(/\r?\n/).filter(Boolean);
    if (remotes.includes(remote)) {
      const scoped = runGit(["for-each-ref", "--format=%(objectname)", `refs/remotes/${remote}`], repoRoot)
        .split(/\r?\n/)
        .filter(Boolean);
      if (scoped.length > 0) return scoped;
    }
  }
  return runGit(["for-each-ref", "--format=%(objectname)", "refs/remotes"], repoRoot)
    .split(/\r?\n/)
    .filter(Boolean);
}

function collectPrePushCommits(remote) {
  const stdin = readFileSync(0, "utf8");
  const commits = new Set();

  for (const rawLine of stdin.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const parts = line.split(/\s+/);
    if (parts.length < 4) {
      process.stderr.write("check-private: malformed pre-push ref update line\n");
      process.exit(2);
    }
    const localSha = parts[1];
    const remoteSha = parts[3];
    if (isZeroSha(localSha)) continue;

    let revListArgs;
    if (!isZeroSha(remoteSha) && commitExists(remoteSha)) {
      revListArgs = ["rev-list", `${remoteSha}..${localSha}`];
    } else {
      const tips = collectRemoteTips(remote);
      revListArgs = tips.length > 0 ? ["rev-list", localSha, "--not", ...tips] : ["rev-list", localSha];
    }

    const out = runGit(revListArgs, repoRoot).trim();
    if (!out) continue;
    for (const hash of out.split(/\r?\n/)) {
      if (hash) commits.add(hash);
    }
  }

  return [...commits];
}

if (mode === "tree") {
  scanTree();
} else if (mode === "range") {
  const out = runGit(["rev-list", rangeArg], repoRoot).trim();
  const commits = out ? out.split(/\r?\n/).filter(Boolean) : [];
  for (const hash of commits) scanCommit(hash);
} else if (mode === "pre-push") {
  scanTree();
  const commits = collectPrePushCommits(remoteName);
  for (const hash of commits) scanCommit(hash);
}

if (hits.length > 0) {
  process.stdout.write(`${hits.join("\n")}\n`);
  process.exit(1);
}
process.exit(0);
' -- "$@"
