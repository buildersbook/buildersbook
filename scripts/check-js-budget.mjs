import { readFileSync, statSync } from 'node:fs';
import { posix, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';

const repoRoot = resolve(import.meta.dirname, '..');
const limit = 100 * 1024;
const routes = ['book', 'essays'];
const nodeModulesSegment = /(^|[\\/])node_modules(?=[\\/]|$)/;
const bracketAliasPrefix = /^\[([^\]]+)\](?:[\\/]|$)/;
const jsChunkSuffix = /\.(?:js|mjs|cjs)$/;
const scriptModuleSuffix = /\.(?:ts|tsx|js|jsx|mjs|cjs)$/;
const classificationReasons = [
  'rejected:node_modules',
  'rejected:async',
  'rejected:async-unrecognized',
  'rejected:bracket-alias',
  'rejected:unrecognized-path',
  'accepted',
];

function normalizeModuleKey(modulePath) {
  if (typeof modulePath !== 'string') return null;

  const withoutSuffix = modulePath.replace(/[?#].*$/, '');
  let decodedKey;
  try {
    decodedKey = decodeURIComponent(withoutSuffix).replaceAll('\\', '/');
  } catch {
    return null;
  }

  const bracketAlias = decodedKey.match(bracketAliasPrefix);
  const keyWithoutAlias = bracketAlias?.[1] === 'project' ? decodedKey.slice(bracketAlias[0].length) : decodedKey;
  return {
    bracketAlias: bracketAlias?.[1],
    normalizedKey: posix.normalize(keyWithoutAlias),
  };
}

function isSafeProjectRelativePath(modulePath) {
  if (!modulePath || posix.isAbsolute(modulePath)) return false;
  const normalized = posix.normalize(modulePath);
  return normalized !== '.' && normalized !== '..' && !normalized.startsWith('../');
}

function isExistingProjectFile(relativePath, projectRoot) {
  if (!isSafeProjectRelativePath(relativePath)) return false;

  const normalizedRoot = posix.normalize(resolve(projectRoot).replaceAll('\\', '/'));
  const candidatePath = posix.resolve(normalizedRoot, relativePath);
  const resolvedRelativePath = posix.relative(normalizedRoot, candidatePath);
  if (!isSafeProjectRelativePath(resolvedRelativePath)) return false;

  try {
    return statSync(candidatePath).isFile();
  } catch {
    return false;
  }
}

function hasProjectRelativeFileSuffix(modulePath, projectRoot) {
  const segments = modulePath.split('/').filter(Boolean);
  for (let index = 0; index < segments.length; index += 1) {
    const relativePath = segments.slice(index).join('/');
    if (isExistingProjectFile(relativePath, projectRoot)) return true;
  }
  return false;
}

export function isFirstPartyModuleKey(modulePath, projectRoot = repoRoot) {
  const normalized = normalizeModuleKey(modulePath);
  if (!normalized) return 'rejected:unrecognized-path';
  if (normalized.bracketAlias && normalized.bracketAlias !== 'project') return 'rejected:bracket-alias';
  if (nodeModulesSegment.test(normalized.normalizedKey)) return 'rejected:node_modules';

  const normalizedRoot = posix.normalize(resolve(projectRoot).replaceAll('\\', '/'));
  if (!posix.isAbsolute(normalized.normalizedKey)) {
    return isExistingProjectFile(normalized.normalizedKey, normalizedRoot)
      ? 'accepted'
      : 'rejected:unrecognized-path';
  }

  const relativePath = posix.relative(normalizedRoot, normalized.normalizedKey);
  if (isSafeProjectRelativePath(relativePath)) {
    return isExistingProjectFile(relativePath, normalizedRoot) ? 'accepted' : 'rejected:unrecognized-path';
  }

  return hasProjectRelativeFileSuffix(normalized.normalizedKey, normalizedRoot)
    ? 'accepted'
    : 'rejected:unrecognized-path';
}

export function extractJsChunks(rawChunks) {
  if (!Array.isArray(rawChunks)) throw new TypeError('extractJsChunks expected an array of chunk entries.');

  // Chunk arrays interleave ids and filenames; position is an implementation detail, the suffix is the contract.
  return rawChunks.flatMap((chunk) => {
    if (typeof chunk !== 'string') return [];
    const path = chunk.replace(/[?#].*$/, '');
    return jsChunkSuffix.test(path) ? [path] : [];
  });
}

export function classifyClientModule(modulePath, entry, projectRoot = repoRoot) {
  const pathVerdict = isFirstPartyModuleKey(modulePath, projectRoot);
  if (pathVerdict === 'rejected:node_modules') return pathVerdict;
  if (entry?.async === true) return 'rejected:async';
  if (entry?.async !== false) return 'rejected:async-unrecognized';
  return pathVerdict;
}

function formatClassificationSummary(route, classifications) {
  const counts = Object.fromEntries(classificationReasons.map((reason) => [reason, 0]));
  for (const { verdict } of classifications) counts[verdict] += 1;
  return (
    `${route} classification: total=${classifications.length} ` +
    `rejected:node_modules=${counts['rejected:node_modules']} ` +
    `rejected:async=${counts['rejected:async']} ` +
    `rejected:async-unrecognized=${counts['rejected:async-unrecognized']} ` +
    `rejected:bracket-alias=${counts['rejected:bracket-alias']} ` +
    `rejected:unrecognized-path=${counts['rejected:unrecognized-path']} accepted=${counts.accepted}`
  );
}

function formatClassificationTable(classifications) {
  if (!classifications) return '(unavailable)';
  if (classifications.length === 0) return '(empty)';
  return classifications
    .map(({ modulePath, entry, verdict }) => {
      const chunks = verdict === 'accepted' ? ` chunks=${JSON.stringify(entry?.chunks)}` : '';
      return `${verdict} key=${JSON.stringify(modulePath)}${chunks}`;
    })
    .join('\n');
}

function formatRouteFailure(route, manifestPath, message, classifications, details = []) {
  const lines = [`${route}: ${message}`, `Manifest: ${manifestPath}`, ...details];
  if (classifications) lines.push(formatClassificationSummary(route, classifications));
  lines.push('Classification table:', formatClassificationTable(classifications));
  return lines.join('\n');
}

function isScriptModuleKey(modulePath) {
  const normalized = normalizeModuleKey(modulePath);
  return normalized ? scriptModuleSuffix.test(normalized.normalizedKey) : false;
}

function checkBudget() {
  for (const route of routes) {
    const manifestPath = resolve(repoRoot, `.next/server/app/${route}/[...slug]/page_client-reference-manifest.js`);
    let source;
    try {
      source = readFileSync(manifestPath, 'utf8');
    } catch (error) {
      throw new Error(
        formatRouteFailure(route, manifestPath, 'unable to read the client-reference manifest.', null, [
          `Cause: ${error.message}`,
        ]),
        { cause: error },
      );
    }

    const marker = `globalThis.__RSC_MANIFEST["/${route}/[...slug]/page"]=`;
    const markerIndex = source.indexOf(marker);
    if (markerIndex === -1) {
      throw new Error(
        formatRouteFailure(route, manifestPath, 'manifest marker not found.', null, [
          `Source preview (first 200 chars): ${JSON.stringify(source.slice(0, 200))}`,
        ]),
      );
    }

    const serialized = source.slice(markerIndex + marker.length, source.lastIndexOf(';'));
    let manifest;
    try {
      manifest = JSON.parse(serialized);
    } catch (error) {
      throw new Error(
        formatRouteFailure(route, manifestPath, 'client-reference manifest JSON is invalid.', null, [
          `Cause: ${error.message}`,
          `Source preview (first 200 chars): ${JSON.stringify(source.slice(0, 200))}`,
        ]),
        { cause: error },
      );
    }

    const topLevelKeys = manifest && typeof manifest === 'object' && !Array.isArray(manifest) ? Object.keys(manifest) : [];
    if (
      !manifest ||
      typeof manifest !== 'object' ||
      Array.isArray(manifest) ||
      !manifest.clientModules ||
      typeof manifest.clientModules !== 'object' ||
      Array.isArray(manifest.clientModules)
    ) {
      throw new Error(
        formatRouteFailure(route, manifestPath, 'clientModules is missing or is not an object.', null, [
          `Top-level keys: ${JSON.stringify(topLevelKeys)}`,
        ]),
      );
    }

    const clientModules = Object.entries(manifest.clientModules);
    const classifications = clientModules.map(([modulePath, entry]) => ({
      modulePath,
      entry,
      verdict: classifyClientModule(modulePath, entry),
    }));
    const chunks = new Map();

    // First-party-ness is a property of module location relative to the project, never of the
    // host's absolute path prefix; async entries and node_modules segments remain load-bearing exclusions.
    for (const { modulePath, entry, verdict } of classifications) {
      if (verdict !== 'accepted') continue;
      let extractedChunks;
      try {
        extractedChunks = extractJsChunks(entry.chunks);
      } catch (error) {
        throw new Error(
          formatRouteFailure(route, manifestPath, `invalid chunks for module key ${JSON.stringify(modulePath)}.`, classifications, [
            `Cause: ${error.message}`,
          ]),
          { cause: error },
        );
      }
      for (const chunk of extractedChunks) {
        if (!chunks.has(chunk)) chunks.set(chunk, modulePath);
      }
    }

    if (chunks.size === 0) {
      throw new Error(
        formatRouteFailure(
          route,
          manifestPath,
          'no first-party client chunks found in the reading route manifest.',
          classifications,
        ),
      );
    }
    if (!classifications.some(({ modulePath, verdict }) => verdict === 'accepted' && isScriptModuleKey(modulePath))) {
      throw new Error(
        formatRouteFailure(
          route,
          manifestPath,
          'no accepted first-party script module found in the reading route manifest.',
          classifications,
        ),
      );
    }

    let compressedBytes = 0;
    for (const [chunk, modulePath] of chunks) {
      let path;
      try {
        path = resolve(repoRoot, '.next', decodeURIComponent(chunk));
        if (!statSync(path).isFile()) throw new Error('chunk path is not a file');
      } catch (error) {
        throw new Error(
          formatRouteFailure(route, manifestPath, 'missing client chunk.', classifications, [
            `Chunk path: ${path ?? JSON.stringify(chunk)}`,
            `Owning module key: ${JSON.stringify(modulePath)}`,
          ]),
          { cause: error },
        );
      }

      try {
        compressedBytes += gzipSync(readFileSync(path)).byteLength;
      } catch (error) {
        throw new Error(
          formatRouteFailure(route, manifestPath, 'unable to read or compress client chunk.', classifications, [
            `Chunk path: ${path}`,
            `Owning module key: ${JSON.stringify(modulePath)}`,
            `Cause: ${error.message}`,
          ]),
          { cause: error },
        );
      }
    }

    console.log(
      `${route}: ${(compressedBytes / 1024).toFixed(2)} KiB compressed first-party JS (${[...chunks.keys()].join(', ')})`,
    );
    if (compressedBytes > limit) {
      console.log(formatClassificationSummary(route, classifications));
      throw new Error(
        formatRouteFailure(
          route,
          manifestPath,
          'compressed first-party JS exceeds the 100 KiB hard budget.',
          classifications,
        ),
      );
    }
    console.log(formatClassificationSummary(route, classifications));
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) checkBudget();
