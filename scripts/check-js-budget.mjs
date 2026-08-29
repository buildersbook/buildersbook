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

function checkBudget() {
  for (const route of routes) {
    const manifestPath = resolve(repoRoot, `.next/server/app/${route}/[...slug]/page_client-reference-manifest.js`);
    const source = readFileSync(manifestPath, 'utf8');
    const marker = `globalThis.__RSC_MANIFEST["/${route}/[...slug]/page"]=`;
    const serialized = source.slice(source.indexOf(marker) + marker.length, source.lastIndexOf(';'));
    const manifest = JSON.parse(serialized);
    const clientModules = Object.entries(manifest.clientModules);
    const chunks = new Set();

    // First-party-ness is a property of module location relative to the project, never of the
    // host's absolute path prefix; async entries and node_modules segments remain load-bearing exclusions.
    for (const [modulePath, entry] of clientModules) {
      if (!isFirstPartyModuleKey(modulePath) || entry.async !== false) continue;
      for (let index = 1; index < entry.chunks.length; index += 2) {
        const chunk = entry.chunks[index];
        if (typeof chunk === 'string' && chunk.endsWith('.js')) chunks.add(chunk);
      }
    }

    if (chunks.size === 0) {
      const sampleKeys = clientModules.slice(0, 5).map(([modulePath]) => modulePath);
      throw new Error(
        `${route}: no first-party client chunks found in the reading route manifest. ` +
          `Manifest: ${manifestPath}. clientModules: ${clientModules.length}. ` +
          `Sample keys: ${JSON.stringify(sampleKeys)}`,
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
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) checkBudget();
