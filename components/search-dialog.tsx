'use client';

import { useFlexsearchStatic } from 'fumadocs-core/search/client/flexsearch-static';
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

export function SiteSearchDialog({ onReturnFocus, ...props }: SharedProps & { onReturnFocus: () => void }) {
  const { search, onSearchChange, isLoading, data, error } = useFlexsearchStatic();
  const hasQuery = search.trim() !== '';
  const results = hasQuery && data?.query === search ? data : undefined;
  const resultCount = results?.items.reduce((count, item) => count + (item.type === 'table' ? item.rows.length : 1), 0);
  const status = resultCount === undefined ? '' : `${resultCount} ${resultCount === 1 ? 'result' : 'results'}`;

  return (
    <SearchDialog
      {...props}
      search={search}
      onSearchChange={onSearchChange}
      isLoading={hasQuery && isLoading}
      data={results}
      error={hasQuery && !isLoading ? error : undefined}
    >
      <SearchDialogOverlay className="site-search-overlay" />
      <SearchDialogContent
        className="site-search-dialog"
        aria-label="Search Builder's Book"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          onReturnFocus();
        }}
      >
        <SearchDialogHeader>
          <SearchDialogInput aria-label="Search query" />
          <SearchDialogClose aria-label="Close" className="site-search-close functional-label">Close</SearchDialogClose>
        </SearchDialogHeader>
        <SearchDialogList Empty={() => <p className="search-empty">No results found</p>} />
        <span className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">{status}</span>
      </SearchDialogContent>
    </SearchDialog>
  );
}
