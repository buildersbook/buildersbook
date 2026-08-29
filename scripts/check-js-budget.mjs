import { existsSync, readFileSync, statSync } from 'node:fs';
import { posix, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';

const repoRoot = resolve(import.meta.dirname, '..');
const limit = 100 * 1024;
const routes = ['book', 'essays'];
const nodeModulesSegment = /(^|[\\/])node_modules(?=[\\/]|$)/;
const bundlerRootPrefix = /^\[project\](?:[\\/]|$)/;

function isSafeProjectRelativePath(modulePath) {
  if (!modulePath || posix.isAbsolute(modulePath)) return false;
  const normalized = posix.normalize(modulePath);
  return normalized !== '.' && normalized !== '..' && !normalized.startsWith('../');
}

function hasProjectRelativeSuffix(modulePath, projectRoot) {
  const segments = modulePath.split('/').filter(Boolean);
  for (let index = 1; index < segments.length; index += 1) {
    const relativePath = segments.slice(index).join('/');
    if (isSafeProjectRelativePath(relativePath) && existsSync(resolve(projectRoot, relativePath))) return true;
  }
  return false;
}

export function isFirstPartyModuleKey(modulePath, projectRoot = repoRoot) {
  if (typeof modulePath !== 'string' || nodeModulesSegment.test(modulePath)) return false;

  const normalizedKey = modulePath.replaceAll('\\', '/');
  const bundlerPrefix = normalizedKey.match(bundlerRootPrefix);
  if (bundlerPrefix) {
    return isSafeProjectRelativePath(normalizedKey.slice(bundlerPrefix[0].length));
  }

  if (!posix.isAbsolute(normalizedKey)) return isSafeProjectRelativePath(normalizedKey);

  const normalizedRoot = posix.normalize(projectRoot.replaceAll('\\', '/'));
  const relativePath = posix.relative(normalizedRoot, posix.normalize(normalizedKey));
  return isSafeProjectRelativePath(relativePath) || hasProjectRelativeSuffix(normalizedKey, projectRoot);
}

export function extractJsChunks(rawChunks) {
  // Chunk arrays interleave ids and filenames; position is an implementation detail, the .js suffix is the contract.
  return rawChunks.flatMap((chunk) => {
    if (typeof chunk !== 'string') return [];
    const path = chunk.replace(/[?#].*$/, '');
    return path.endsWith('.js') ? [path] : [];
  });
}

function classifyClientModule(modulePath, entry) {
  if (typeof modulePath === 'string' && nodeModulesSegment.test(modulePath)) return 'rejected:node_modules';
  if (entry.async !== false) return 'rejected:async';
  if (!isFirstPartyModuleKey(modulePath)) return 'rejected:unrecognized-path';
  return 'accepted';
}

function formatClassificationSummary(route, classifications) {
  const counts = {
    'rejected:node_modules': 0,
    'rejected:async': 0,
    'rejected:unrecognized-path': 0,
    accepted: 0,
  };
  for (const { verdict } of classifications) counts[verdict] += 1;
  return (
    `${route} classification: total=${classifications.length} ` +
    `rejected:node_modules=${counts['rejected:node_modules']} ` +
    `rejected:async=${counts['rejected:async']} ` +
    `rejected:unrecognized-path=${counts['rejected:unrecognized-path']} accepted=${counts.accepted}`
  );
}

function formatClassificationTable(classifications) {
  return classifications
    .map(({ modulePath, entry, verdict }) => {
      const chunks = verdict === 'accepted' ? ` chunks=${JSON.stringify(entry.chunks)}` : '';
      return `${verdict} key=${JSON.stringify(modulePath)}${chunks}`;
    })
    .join('\n');
}

function checkBudget() {
  for (const route of routes) {
    const manifestPath = resolve(repoRoot, `.next/server/app/${route}/[...slug]/page_client-reference-manifest.js`);
    const source = readFileSync(manifestPath, 'utf8');
    const marker = `globalThis.__RSC_MANIFEST["/${route}/[...slug]/page"]=`;
    const serialized = source.slice(source.indexOf(marker) + marker.length, source.lastIndexOf(';'));
    const manifest = JSON.parse(serialized);
    const clientModules = Object.entries(manifest.clientModules);
    const classifications = clientModules.map(([modulePath, entry]) => ({
      modulePath,
      entry,
      verdict: classifyClientModule(modulePath, entry),
    }));
    const chunks = new Set();

    // First-party-ness is a property of module location relative to the project, never of the
    // host's absolute path prefix; async entries and node_modules segments remain load-bearing exclusions.
    for (const { entry, verdict } of classifications) {
      if (verdict !== 'accepted') continue;
      for (const chunk of extractJsChunks(entry.chunks)) chunks.add(chunk);
    }

    if (chunks.size === 0) {
      throw new Error(
        `${route}: no first-party client chunks found in the reading route manifest.\n` +
          `Manifest: ${manifestPath}\n` +
          `${formatClassificationSummary(route, classifications)}\n` +
          `Classification table:\n${formatClassificationTable(classifications)}`,
      );
    }
    let compressedBytes = 0;
    for (const chunk of chunks) {
      const path = resolve(repoRoot, '.next', decodeURIComponent(chunk));
      if (!statSync(path).isFile()) throw new Error(`${route}: missing client chunk ${chunk}`);
      compressedBytes += gzipSync(readFileSync(path)).byteLength;
    }

    console.log(`${route}: ${(compressedBytes / 1024).toFixed(2)} KiB compressed first-party JS (${[...chunks].join(', ')})`);
    if (compressedBytes > limit) {
      throw new Error(`${route}: compressed first-party JS exceeds the 100 KiB hard budget.`);
    }
    console.log(formatClassificationSummary(route, classifications));
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) checkBudget();
