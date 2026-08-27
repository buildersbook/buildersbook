import {
  buildSitemapEntries,
  INDEXNOW_KEY,
  INDEXNOW_KEY_PATH,
  SITE_URL,
} from '../lib/discovery';

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: new URL(SITE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: new URL(INDEXNOW_KEY_PATH, SITE_URL).toString(),
    urlList: buildSitemapEntries().map((entry) => entry.url),
  }),
});

if (!response.ok) {
  throw new Error(`IndexNow submission failed: ${response.status} ${await response.text()}`);
}

console.log(`IndexNow accepted ${buildSitemapEntries().length} production URLs.`);
