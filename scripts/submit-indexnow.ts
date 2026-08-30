export {};

const SITE_URL = process.env.SITE_URL ?? 'https://buildersbook.dev';
const INDEXNOW_KEY = 'ed028cc6bfe99c09e25c88b51da41e70';
const INDEXNOW_KEY_PATH = `/${INDEXNOW_KEY}.txt`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const sitemapUrl = new URL('/sitemap.xml', SITE_URL).toString();

const fail = (message = '') => {
  console.error(message);
  return process.exit(1);
};

function decodeXml(value = '') {
  return value
    .replaceAll('&apos;', "'")
    .replaceAll('&gt;', '>')
    .replaceAll('&lt;', '<')
    .replaceAll('&quot;', '"')
    .replaceAll('&amp;', '&');
}

const sitemapResponse = await fetch(sitemapUrl).catch((error) => {
  return fail(`Sitemap fetch failed for ${sitemapUrl}: ${error instanceof Error ? error.message : String(error)}`);
});

const sitemapBody = await sitemapResponse.text();
if (sitemapResponse.status !== 200 || sitemapBody.trim().length === 0) {
  fail(
    `Sitemap fetch failed: status ${sitemapResponse.status}; body[0:200]=${JSON.stringify(sitemapBody.slice(0, 200))}`,
  );
}

const urlList = Array.from(sitemapBody.matchAll(/<loc(?:\s[^>]*)?>([\s\S]*?)<\/loc>/gi), (match) =>
  decodeXml(match[1].trim()),
).filter(Boolean);

if (urlList.length === 0) {
  fail(`Sitemap ${sitemapUrl} contained zero URLs.`);
}

if (urlList.length > 10_000) {
  fail(`Sitemap ${sitemapUrl} contained ${urlList.length} URLs, exceeding the IndexNow 10,000-URL cap.`);
}

console.log(`Fetched sitemap: ${sitemapUrl}`);
console.log('Parsed URLs:');
for (const url of urlList) console.log(url);
console.log(`Parsed URL count: ${urlList.length}`);

if (process.env.DRY_RUN === '1') {
  console.log('DRY_RUN=1: submission skipped.');
  process.exit(0);
}

console.log(`IndexNow request: endpoint=${INDEXNOW_ENDPOINT}; URL count=${urlList.length}`);

const response = await fetch(INDEXNOW_ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: new URL(SITE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: new URL(INDEXNOW_KEY_PATH, SITE_URL).toString(),
    urlList,
  }),
});
const responseBody = await response.text();

console.log(`IndexNow response: status ${response.status}; body=${JSON.stringify(responseBody)}`);

if (!response.ok) {
  fail(`IndexNow submission failed: ${response.status} ${responseBody}`);
}

console.log(`submitted ${urlList.length} urls, status ${response.status}`);
