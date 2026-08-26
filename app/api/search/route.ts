import { contentPages } from '@/lib/source';
import { flexsearch } from 'fumadocs-core/search/flexsearch';

export const revalidate = false;

const search = flexsearch({
  indexes: contentPages.map((page) => ({
    title: page.data.title,
    description: page.data.description,
    id: page.url,
    url: page.url,
    structuredData: page.data.structuredData,
  })),
});

export const { staticGET: GET } = search;
