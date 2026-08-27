'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import { siteNavigation } from '@/lib/navigation';

import { MobileMenu } from './mobile-menu';
import { ThemeToggle } from './theme-toggle';
import { Wordmark } from './wordmark';

const SiteSearchDialog = dynamic(
  () => import('./search-dialog').then((module) => module.SiteSearchDialog),
  { ssr: false },
);

export function SiteHeader() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Wordmark />
        <nav className="desktop-navigation" aria-label="Primary">
          {siteNavigation.map((item) => (
            <Link href={item.href} key={item.href}>{item.label}</Link>
          ))}
        </nav>
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
      </div>
      {searchOpen ? <SiteSearchDialog open onOpenChange={setSearchOpen} /> : null}
    </header>
  );
}
