import { publishedPages } from '@/lib/source';
import { flexsearch } from 'fumadocs-core/search/flexsearch';

export const revalidate = false;

const search = flexsearch({
  indexes: publishedPages.map((page) => ({
    title: page.data.title,
    description: page.data.description,
    id: page.url,
    url: page.url,
    structuredData: page.data.structuredData,
  })),
});

export const { staticGET: GET } = search;
