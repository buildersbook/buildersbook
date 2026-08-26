'use client';

import Link from 'next/link';
import { useSearchContext } from 'fumadocs-ui/contexts/search';

import { siteNavigation } from '@/lib/navigation';

import { MobileMenu } from './mobile-menu';
import { ThemeToggle } from './theme-toggle';
import { Wordmark } from './wordmark';

export function SiteHeader() {
  const { setOpenSearch } = useSearchContext();

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
            onClick={() => setOpenSearch(true)}
          >
            Search
          </button>
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
