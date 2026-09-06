import Link from 'next/link';

import { siteNavigation } from '@/lib/navigation';

import { SiteHeaderActions } from './site-header-actions';
import { Wordmark } from './wordmark';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Wordmark showIcon />
        <nav className="desktop-navigation" aria-label="Primary">
          {siteNavigation.map((item) => (
            <Link href={item.href} key={item.href}>{item.label}</Link>
          ))}
        </nav>
        <SiteHeaderActions />
      </div>
    </header>
  );
}
