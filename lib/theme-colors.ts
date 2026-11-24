import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const tokens = readFileSync(join(process.cwd(), 'styles', 'tokens.css'), 'utf8');

function paperColor(selector: ':root' | '.dark'): string {
  const rule = tokens.match(new RegExp('(?:^|\\n)' + selector.replace('.', '\\.') + '\\s*\\{([^}]*)\\}'));
  const paper = rule?.[1].match(/--paper:\s*([^;]+);/)?.[1].trim();
  if (!paper) throw new Error('Missing paper color in ' + selector);
  return paper;
}

export const themeColors = { light: paperColor(':root'), dark: paperColor('.dark') };
