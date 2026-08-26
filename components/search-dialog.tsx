'use client';

import { useDocsSearch } from 'fumadocs-core/search/client';
import { flexsearchStaticClient } from 'fumadocs-core/search/client/flexsearch-static';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';

const searchClient = flexsearchStaticClient();

export function SiteSearchDialog(props: SharedProps) {
  const { search, setSearch, query } = useDocsSearch({ client: searchClient });
  const items = query.data === 'empty' ? [] : query.data;

  return (
    <SearchDialog
      {...props}
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
    >
      <SearchDialogOverlay />
      <SearchDialogContent aria-label="Search Builder's Book">
        <SearchDialogHeader>
          <SearchDialogInput aria-label="Search query" placeholder="Search the book and essays" />
          <SearchDialogClose>Close</SearchDialogClose>
        </SearchDialogHeader>
        <SearchDialogList items={items} />
      </SearchDialogContent>
    </SearchDialog>
  );
}
