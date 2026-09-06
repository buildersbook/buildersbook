'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

import { MobileMenu } from './mobile-menu';
import { ThemeToggle } from './theme-toggle';

const SiteSearchDialog = dynamic(
  () => import('./search-dialog').then((module) => module.SiteSearchDialog),
  { ssr: false },
);

export function SiteHeaderActions() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <div className="site-header-actions">
        <button
          className="search-trigger functional-label"
          type="button"
          aria-label="Search Builder’s Book"
          onClick={() => setSearchOpen(true)}
        >
          Search
        </button>
        <ThemeToggle />
        <MobileMenu />
      </div>
      {searchOpen ? <SiteSearchDialog open onOpenChange={setSearchOpen} /> : null}
    </>
  );
}
