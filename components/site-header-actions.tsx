'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import { MobileMenu } from './mobile-menu';
import { ThemeToggle } from './theme-toggle';

const SiteSearchDialog = dynamic(
  () => import('./search-dialog').then((module) => module.SiteSearchDialog),
  {
    ssr: false,
    loading: () => <p className="search-pending functional-label" role="status">Opening search…</p>,
  },
);

export function SiteHeaderActions() {
  const [searchOpen, setSearchOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<() => void>(() => undefined);

  function openSearch(returnFocus: () => void): void {
    returnFocusRef.current = returnFocus;
    setSearchOpen(true);
  }

  useEffect(() => {
    function handleSearchShortcut(event: KeyboardEvent) {
      if (event.defaultPrevented || event.isComposing || event.repeat || searchOpen) return;
      const command = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      const slash = !event.metaKey && !event.ctrlKey && event.key === '/';
      if (event.altKey || (!command && !slash)) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="combobox"]')) return;

      event.preventDefault();
      const menuSearch = document.querySelector<HTMLButtonElement>('.mobile-menu-dialog[open] .mobile-menu-search');
      if (menuSearch) {
        menuSearch.click();
        return;
      }
      const opener = document.activeElement instanceof HTMLElement && document.activeElement !== document.body
        ? document.activeElement
        : triggerRef.current;
      openSearch(() => opener?.focus());
    }

    document.addEventListener('keydown', handleSearchShortcut);
    return () => document.removeEventListener('keydown', handleSearchShortcut);
  }, [searchOpen]);

  return (
    <>
      <div className="site-header-actions">
        <button
          ref={triggerRef}
          className="search-trigger functional-label"
          type="button"
          aria-label="Search"
          aria-keyshortcuts="Meta+K Control+K /"
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
        <SiteSearchDialog open onOpenChange={setSearchOpen} onReturnFocus={() => { returnFocusRef.current(); returnFocusRef.current = () => undefined; }} />
      ) : null}
    </>
  );
}
