import { renderPlaceholder } from 'fumadocs-core/mdx-plugins/remark-llms.runtime';

import { markdownFallbacks } from './markdown-fallbacks';

type ProcessedEntry = {
  getText: (type: 'processed') => Promise<string>;
};

export async function getProcessedMarkdown(entry: ProcessedEntry): Promise<string> {
  const markdown = await entry.getText('processed');
  return renderPlaceholder(markdown, markdownFallbacks);
}
