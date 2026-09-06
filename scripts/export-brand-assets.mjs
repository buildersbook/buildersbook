import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { parseArgs } from 'node:util';

import sharp from 'sharp';

const repoRoot = realpathSync(resolve(import.meta.dirname, '..'));
const { values } = parseArgs({
  options: { check: { type: 'boolean' }, 'avatars-dir': { type: 'string' } },
});
const tokenSource = readFileSync(join(repoRoot, 'styles/tokens.css'), 'utf8');

function tokens(selector) {
  const body = tokenSource.match(new RegExp(`${selector}\\s*\\{([^}]+)\\}`))?.[1];
  assert(body, `Missing token selector: ${selector}`);
  return Object.fromEntries(['paper', 'ink'].map((name) => {
    const value = body.match(new RegExp(`--${name}:\\s*(#[\\da-f]{6})\\s*;`, 'i'))?.[1];
    assert(value, `Missing ${name} token in ${selector}`);
    return [name, value];
  }));
}

const modes = { light: tokens(':root'), dark: tokens('\\.dark') };
const source = readFileSync(join(repoRoot, 'design/brand/icon.svg'), 'utf8');
const canonical = source.match(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="([\d. ]+)" width="[\d.]+" height="[\d.]+" fill="currentColor">\s*([\s\S]+?)\s*<\/svg>\s*$/);
assert(canonical, 'Expected the sanitized canonical SVG');
const viewBox = canonical[1];
const frame = viewBox.split(/\s+/).map(Number);
assert(frame.length === 4 && frame.every(Number.isFinite) && frame[2] > 0 && frame[3] > 0);
const paths = [...canonical[2].matchAll(/<path d="([MHVZ\d. ]+)"\/>/g)];
assert.equal(paths.length, 3, 'Expected exactly three canonical filled paths');
assert.equal(canonical[2].replace(/<path d="[MHVZ\d. ]+"\/>/g, '').trim(), '');
const artwork = paths.map(([element]) => element).join('\n');

// The canonical icon has only absolute axis-aligned contours. Fail closed if
// future artwork needs a different geometry reader instead of guessing bounds.
const vertices = paths.flatMap(([, data]) => {
  const commands = [...data.matchAll(/([MHVZ])([\d. ]*)/g)];
  let x = 0;
  let y = 0;
  return commands.flatMap(([, command, raw]) => {
    const numbers = raw.trim() ? raw.trim().split(/\s+/).map(Number) : [];
    assert(numbers.every(Number.isFinite));
    assert.equal(numbers.length, command === 'M' ? 2 : command === 'Z' ? 0 : 1);
    if (command === 'Z') return [];
    if (command === 'M') [x, y] = numbers;
    if (command === 'H') [x] = numbers;
    if (command === 'V') [y] = numbers;
    return [[x, y]];
  });
});
const minX = Math.min(...vertices.map(([x]) => x));
const maxX = Math.max(...vertices.map(([x]) => x));
const minY = Math.min(...vertices.map(([, y]) => y));
const maxY = Math.max(...vertices.map(([, y]) => y));
assert(Math.abs((maxX - minX) - (maxY - minY)) < 1e-9, 'The 62% crop requires a square visible glyph');

function svg(body, size, attributes = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" ${attributes}>${body}</svg>`;
}

function glyphSvg(size, mode, crop) {
  const color = modes[mode];
  if (!crop) {
    // Preserve the original artboard with uniform scaling and transparent padding.
    return svg(`<svg viewBox="${viewBox}" width="${size}" height="${size}" fill="${color.ink}">${artwork}</svg>`, size);
  }
  const scale = size * 0.62 / (maxX - minX);
  const margin = size * (1 - 0.62) / 2;
  return svg(
    `<path fill="${color.paper}" d="M0 0H${size}V${size}H0Z"/>` +
    `<g fill="${color.ink}" transform="translate(${margin} ${margin}) scale(${scale}) translate(${-minX} ${-minY})">${artwork}</g>`,
    size,
  );
}

async function png(svgSource) {
  // Sharp strips input metadata by default. Render vectors at the target size.
  return sharp(Buffer.from(svgSource)).png({ compressionLevel: 9 }).toBuffer();
}

async function pixelGridPng(size) {
  assert(size === 16 || size === 32);
  const scale = size / 16;
  const rectangles = [
    [1, 2, 2, 12], [3, 2, 2, 2], [3, 12, 2, 2],
    [13, 2, 2, 12], [11, 2, 2, 2], [11, 12, 2, 2],
    [7, 4, 2, 8],
  ];
  const color = [1, 3, 5].map((offset) => Number.parseInt(modes.light.ink.slice(offset, offset + 2), 16));
  const pixels = Buffer.alloc(size * size * 4);
  for (const rect of rectangles) {
    const [x, y, width, height] = rect.map((value) => value * scale);
    for (let row = y; row < y + height; row++) {
      for (let column = x; column < x + width; column++) {
        pixels.set([...color, 255], (row * size + column) * 4);
      }
    }
  }
  return sharp(pixels, { raw: { width: size, height: size, channels: 4 } })
    .png({ compressionLevel: 9 }).toBuffer();
}

function ico(frames) {
  const directory = Buffer.alloc(6 + 16 * frames.length);
  directory.writeUInt16LE(1, 2);
  directory.writeUInt16LE(frames.length, 4);
  let offset = directory.length;
  frames.forEach(({ size, data }, index) => {
    const entry = 6 + 16 * index;
    directory[entry] = size;
    directory[entry + 1] = size;
    directory.writeUInt16LE(1, entry + 4);
    directory.writeUInt16LE(32, entry + 6);
    directory.writeUInt32LE(data.length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([directory, ...frames.map(({ data }) => data)]);
}

function externalAvatarDirectory(input) {
  assert(isAbsolute(input), 'Avatar output must be an absolute directory outside the repository');
  const requested = resolve(input);
  let ancestor = requested;
  while (!existsSync(ancestor)) ancestor = dirname(ancestor);
  const actual = resolve(realpathSync(ancestor), relative(ancestor, requested));
  const fromRepo = relative(repoRoot, actual);
  assert(fromRepo.startsWith(`..${sep}`) || isAbsolute(fromRepo), 'Avatar output must be outside the repository');
  return actual;
}

const avatarDirectory = values['avatars-dir'] ? externalAvatarDirectory(values['avatars-dir']) : undefined;
const outputs = new Map();
const add = (path, content) => outputs.set(path, Buffer.isBuffer(content) ? content : Buffer.from(content));
add(join(repoRoot, 'app/icon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${frame[2]}" height="${frame[3]}" fill="currentColor">\n<style>:root{color:${modes.light.ink}}@media(prefers-color-scheme:dark){:root{color:${modes.dark.ink}}}</style>\n${artwork}\n</svg>\n`);
add(join(repoRoot, 'app/favicon.ico'), ico([
  { size: 16, data: await pixelGridPng(16) },
  { size: 32, data: await pixelGridPng(32) },
  { size: 48, data: await png(glyphSvg(48, 'light', false)) },
]));
for (const [path, size] of [['app/apple-icon.png', 180], ['public/icon-192.png', 192], ['public/icon-512.png', 512]]) {
  add(join(repoRoot, path), await png(glyphSvg(size, 'light', true)));
}
add(join(repoRoot, 'app/manifest.webmanifest'), JSON.stringify({
  name: 'The Builder’s Book',
  short_name: 'Builder’s Book',
  description: 'An open curriculum for engineers who build production software with coding agents.',
  lang: 'en',
  start_url: '/',
  scope: '/',
  display: 'browser',
  background_color: modes.light.paper,
  theme_color: modes.light.paper,
  icons: [192, 512].map((size) => ({ src: `/icon-${size}.png`, sizes: `${size}x${size}`, type: 'image/png', purpose: 'any' })),
}, null, 2) + '\n');
if (avatarDirectory) {
  for (const mode of ['light', 'dark']) {
    for (const size of [400, 800, 1024]) {
      add(join(avatarDirectory, `avatar-${mode}-${size}.png`), await png(glyphSvg(size, mode, true)));
    }
  }
}
for (const [path, data] of outputs) {
  if (values.check) {
    assert(readFileSync(path).equals(data), `Generated asset is stale: ${path}`);
  } else {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, data);
  }
  console.log(`${values.check ? 'Verified' : 'Exported'} ${relative(repoRoot, path)}: ${data.length} bytes`);
}
