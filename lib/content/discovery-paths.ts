const SITE_ORIGIN = 'https://buildersbook.dev';

export function collectDiscoveryPaths(output: string): Set<string> {
  const paths = new Set<string>();
  // Consume external URLs whole so their path segments cannot look like local URLs.
  const candidates = output.matchAll(/(?<![\w./:])(?:https?:\/\/[^\s<>"'\x60\[\]{}]+|\/(?!\/)[^\s<>"'\x60\[\]{}]*)/g);

  for (const [candidate] of candidates) {
    const destination = candidate.replace(/[.,;:!?…)\]}”’]+$/u, '');
    try {
      const url = new URL(destination, SITE_ORIGIN);
      if (url.origin === SITE_ORIGIN) paths.add(url.pathname.replace(/\/+$/, '') || '/');
    } catch {
      // Malformed free text is not a discovery URL.
    }
  }

  return paths;
}
