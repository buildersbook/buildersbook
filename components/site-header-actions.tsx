'use client';

import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';

import { MobileMenu } from './mobile-menu';
import { ThemeToggle } from './theme-toggle';

const SiteSearchDialog = dynamic(
  () => import('./search-dialog').then((module) => module.SiteSearchDialog),
  { ssr: false },
);

export function SiteHeaderActions() {
  const [searchOpen, setSearchOpen] = useState(false);
  const returnFocusRef = useRef<() => void>(() => undefined);

  function openSearch(returnFocus: () => void): void {
    returnFocusRef.current = returnFocus;
    setSearchOpen(true);
  }

  return (
    <>
      <div className="site-header-actions">
        <button
          className="search-trigger functional-label"
          type="button"
          aria-label="Search"
          onClick={(event) => {
            const opener = event.currentTarget;
            openSearch(() => opener.focus());
          }}
        >
          <span className="header-control-label" aria-hidden="true">Search</span>
          <svg className="header-control-icon" aria-hidden="true" focusable="false" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="5.5" />
            <path d="m12 12 5.5 5.5" />
          </svg>
        </button>
        <ThemeToggle />
        <MobileMenu onSearch={openSearch} />
      </div>
      {searchOpen ? (
        <SiteSearchDialog open onOpenChange={setSearchOpen} onReturnFocus={() => returnFocusRef.current()} />
      ) : null}
    </>
  );
}
