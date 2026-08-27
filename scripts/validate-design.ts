import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..');
const lintOnly = process.argv.includes('--lint-only');
const violations: string[] = [];

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) violations.push(message);
}

function walk(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function validateRawValues(): void {
  const roots = ['app', 'components', 'content', 'lib', 'scripts', 'styles'];
  const files = roots.flatMap((root) => walk(join(repoRoot, root)))
    .concat(
      join(repoRoot, 'source.config.ts'),
      join(repoRoot, 'mdx-components.tsx'),
      join(repoRoot, 'next.config.mjs'),
      join(repoRoot, 'postcss.config.mjs'),
    )
    .filter((path) => /\.(?:cjs|css|js|mdx|mjs|ts|tsx)$/.test(path))
    .filter((path) => path !== join(repoRoot, 'styles/tokens.css'));
  const colorLiteral = /#[\da-f]{3,8}\b|(?:rgb|hsl|oklch)a?\([^)]*\)/gi;
  const arbitraryTailwindColor = /\b(?:bg|text|border|outline|ring|fill|stroke)-\[[^\]]*(?:#|rgba?\(|hsla?\(|oklch\()/gi;

  for (const path of files) {
    const source = readFileSync(path, 'utf8');
    const label = relative(repoRoot, path);
    invariant(!colorLiteral.test(source), `${label}: raw color literal outside styles/tokens.css`);
    colorLiteral.lastIndex = 0;
    invariant(!arbitraryTailwindColor.test(source), `${label}: arbitrary Tailwind color value`);
    arbitraryTailwindColor.lastIndex = 0;

    if (path.endsWith('.css')) {
      for (const match of source.matchAll(/font-family\s*:\s*([^;}{]+)/gi)) {
        invariant(
          /^var\(--font-[a-z0-9-]+\)$/i.test(match[1].trim()),
          `${label}: font-family must be exactly var(--font-*), received ${match[1].trim()}`,
        );
      }
    }
  }
}

function parseTokenMode(source: string, selector: ':root' | '.dark'): Record<string, string> {
  const escaped = selector === ':root' ? ':root' : '\\.dark';
  const body = source.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\}`))?.[1] ?? '';
  return Object.fromEntries(
    [...body.matchAll(/--([a-z-]+)\s*:\s*(#[\da-f]{6})\s*;/gi)].map((match) => [match[1], match[2]]),
  );
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(foreground: string, background: string): number {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function validateContrast(): void {
  const source = readFileSync(join(repoRoot, 'styles/tokens.css'), 'utf8');
  const modes = { light: parseTokenMode(source, ':root'), dark: parseTokenMode(source, '.dark') };
  const roles = [
    ['ink', 'paper', 4.5, 'body text'],
    ['ink-secondary', 'paper', 4.5, 'secondary text'],
    ['ink-muted', 'paper', 4.5, 'muted text'],
    ['ink', 'surface', 4.5, 'surface-strip text'],
    ['code-ink', 'code-bg', 4.5, 'code text'],
    ['code-muted', 'code-bg', 4.5, 'code metadata'],
    ['accent', 'paper', 3, 'focus indicators'],
  ] as const;

  for (const [mode, tokens] of Object.entries(modes)) {
    for (const [foreground, background, minimum, role] of roles) {
      invariant(Boolean(tokens[foreground] && tokens[background]), `${mode}: missing tokens for ${role}`);
      if (tokens[foreground] && tokens[background]) {
        invariant(
          contrast(tokens[foreground], tokens[background]) >= minimum,
          `${mode}: ${foreground} on ${background} fails ${role} contrast ${minimum}:1`,
        );
      }
    }
  }

  const regressions = [
    ['light', 'accent', 'paper', 4.5, 4.1],
    ['light', 'ink-muted', 'code-bg', 4.5, 2.89],
    ['light', 'ink-muted', 'surface', 4.5, 4.31],
    ['dark', 'rule-strong', 'code-bg', 3, 1.8],
    ['dark', 'code-bg', 'paper', 3, 1.05],
  ] as const;
  for (const [mode, foreground, background, minimum, expected] of regressions) {
    const ratio = contrast(modes[mode][foreground], modes[mode][background]);
    invariant(ratio < minimum, `${mode}: regression fixture ${foreground} on ${background} must remain classified as failing`);
    invariant(Math.abs(ratio - expected) < 0.12, `${mode}: regression fixture ${foreground} on ${background} drifted from ${expected}:1`);
  }
}

function fontSizeToPixels(value: string, parentPixels?: number): number {
  const normalized = value.trim().toLowerCase();
  if (normalized.startsWith('clamp(') && normalized.endsWith(')')) {
    const [minimum] = normalized.slice(6, -1).split(',').map((part) => part.trim());
    return fontSizeToPixels(minimum, parentPixels);
  }
  if (normalized.startsWith('max(') && normalized.endsWith(')')) {
    const candidates = normalized.slice(4, -1).split(',').map((part) => part.trim());
    return Math.max(...candidates.map((candidate) => fontSizeToPixels(candidate, parentPixels)));
  }
  if (normalized.endsWith('rem')) return Number.parseFloat(normalized) * 16;
  if (normalized.endsWith('em')) {
    if (parentPixels === undefined) throw new Error('em size requires an explicit parent-size fixture');
    return Number.parseFloat(normalized) * parentPixels;
  }
  if (normalized.endsWith('px')) return Number.parseFloat(normalized);
  throw new Error(`unsupported font-size value: ${value}`);
}

function validateFunctionalTextFloor(): void {
  const source = readFileSync(join(repoRoot, 'styles/site.css'), 'utf8');
  const parentFixtures = [
    ['.functional-label', 16],
    ['.heading-anchor', 19],
    ['.book-index-number', 16],
    ['.footnote-ref', 17],
  ] as const;
  const parentPixelsBySelector = new Map<string, number>(parentFixtures);
  const exemptions = new Map([
    ['.static-page h1 .wordmark', {
      expectedValue: 'inherit',
      reason: 'decorative wordmark inherits the large static-page heading size',
    }],
  ]);
  const exercisedExemptions = new Set<string>();

  for (const rule of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selectors = rule[1].trim().split(',').map((selector) => selector.trim());
    const declarations = [...rule[2].matchAll(/font-size\s*:\s*([^;}{]+)/gi)];
    for (const declaration of declarations) {
      const value = declaration[1].trim();
      for (const selector of selectors) {
        const exemption = exemptions.get(selector);
        if (exemption) {
          exercisedExemptions.add(selector);
          invariant(
            value === exemption.expectedValue,
            `${selector}: exemption only permits ${exemption.expectedValue} (${exemption.reason})`,
          );
          continue;
        }

        try {
          invariant(
            fontSizeToPixels(value, parentPixelsBySelector.get(selector)) >= 11,
            `${selector}: font-size ${value} computes below the 11px floor`,
          );
        } catch (error) {
          invariant(false, `${selector}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }
  }

  for (const selector of exemptions.keys()) {
    invariant(exercisedExemptions.has(selector), `${selector}: stale functional-text exemption`);
  }

  for (const [selector, parentPixels] of parentFixtures) {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const body = source.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\}`))?.[1] ?? '';
    const value = body.match(/font-size\s*:\s*([^;]+)/)?.[1]?.trim();
    invariant(Boolean(value), `${selector}: functional text must declare a font size`);
    if (value) invariant(fontSizeToPixels(value, parentPixels) >= 11, `${selector}: computed functional text is below 11px`);
  }
}

function validateFumadocsBridge(): void {
  const dist = join(repoRoot, 'node_modules/fumadocs-ui/dist');
  const consumed = new Set(
    walk(dist).flatMap((path) => [...readFileSync(path, 'utf8').matchAll(/--color-fd-[a-z-]+/g)].map((match) => match[0])),
  );
  const mapped = new Set(
    [...readFileSync(join(repoRoot, 'styles/tokens.css'), 'utf8').matchAll(/--color-fd-[a-z-]+/g)].map((match) => match[0]),
  );
  const missing = [...consumed].filter((token) => !mapped.has(token)).sort();
  invariant(missing.length === 0, `styles/tokens.css: unmapped Fumadocs bridge tokens: ${missing.join(', ')}`);
}

validateRawValues();
if (!lintOnly) {
  validateContrast();
  validateFunctionalTextFloor();
  validateFumadocsBridge();
}

if (violations.length > 0) {
  console.error(violations.map((violation) => `- ${violation}`).join('\n'));
  process.exit(1);
}

console.log(lintOnly ? 'Design lint passed.' : 'Design validation passed: raw values, contrast, type floor, and Fumadocs bridge.');
