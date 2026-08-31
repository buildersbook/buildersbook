import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const projectRoot = resolve(import.meta.dirname, '..');
const scriptPath = resolve(projectRoot, 'scripts/submit-indexnow.ts');
const discoveryPath = resolve(projectRoot, 'lib/discovery.ts');
const scriptSource = readFileSync(scriptPath, 'utf8');
const discoverySource = readFileSync(discoveryPath, 'utf8');

function extract(source, file, pattern, description) {
  const match = pattern.exec(source);
  assert.ok(match, `${file}: failed to extract ${description} with pattern ${pattern}`);
  return match[1];
}

test('IndexNow submission constants stay aligned with discovery', () => {
  const scriptKey = extract(
    scriptSource,
    'scripts/submit-indexnow.ts',
    /const\s+INDEXNOW_KEY\s*=\s*['"]([^'"]+)['"]\s*;/,
    'INDEXNOW_KEY',
  );
  const discoveryKey = extract(
    discoverySource,
    'lib/discovery.ts',
    /export\s+const\s+INDEXNOW_KEY\s*=\s*['"]([^'"]+)['"]\s*;/,
    'INDEXNOW_KEY',
  );
  const scriptSiteUrl = extract(
    scriptSource,
    'scripts/submit-indexnow.ts',
    /const\s+SITE_URL\s*=\s*process\.env\.SITE_URL\s*\?\?\s*['"]([^'"]+)['"]\s*;/,
    'SITE_URL default',
  );
  const discoverySiteUrl = extract(
    discoverySource,
    'lib/discovery.ts',
    /export\s+const\s+SITE_URL\s*=\s*['"]([^'"]+)['"]\s*;/,
    'SITE_URL default',
  );

  assert.equal(scriptKey, discoveryKey, 'INDEXNOW_KEY drifted from lib/discovery.ts');
  assert.equal(scriptSiteUrl, discoverySiteUrl, 'SITE_URL default drifted from lib/discovery.ts');
  assert.match(
    scriptSource,
    /const\s+INDEXNOW_KEY_PATH\s*=\s*`\/\$\{INDEXNOW_KEY\}\.txt`\s*;/,
    'scripts/submit-indexnow.ts: keyLocation path must reference INDEXNOW_KEY and append .txt',
  );

  const routePath = resolve(projectRoot, 'app', `${scriptKey}.txt`, 'route.ts');
  assert.ok(existsSync(routePath), `app/${scriptKey}.txt/route.ts: key-serving route does not exist`);
});
