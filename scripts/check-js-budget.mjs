import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const repoRoot = resolve(import.meta.dirname, '..');
const limit = 100 * 1024;
const routes = ['book', 'essays'];

for (const route of routes) {
  const manifestPath = resolve(repoRoot, `.next/server/app/${route}/[...slug]/page_client-reference-manifest.js`);
  const source = readFileSync(manifestPath, 'utf8');
  const marker = `globalThis.__RSC_MANIFEST["/${route}/[...slug]/page"]=`;
  const serialized = source.slice(source.indexOf(marker) + marker.length, source.lastIndexOf(';'));
  const manifest = JSON.parse(serialized);
  const chunks = new Set();

  for (const [modulePath, entry] of Object.entries(manifest.clientModules)) {
    if (!modulePath.startsWith(repoRoot) || modulePath.includes('/node_modules/') || entry.async) continue;
    for (let index = 1; index < entry.chunks.length; index += 2) {
      const chunk = entry.chunks[index];
      if (typeof chunk === 'string' && chunk.endsWith('.js')) chunks.add(chunk);
    }
  }

  if (chunks.size === 0) throw new Error(`${route}: no first-party client chunks found in the reading route manifest.`);
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
