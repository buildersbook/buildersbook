import { siteNavigation } from '@/lib/navigation';

import { CurrentPageLink } from './current-page-link';
import { SiteHeaderActions } from './site-header-actions';
import { Wordmark } from './wordmark';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Wordmark showIcon />
        <nav className="desktop-navigation" aria-label="Primary">
          {siteNavigation.map((item) => (
            <CurrentPageLink href={item.href} key={item.href}>{item.label}</CurrentPageLink>
          ))}
        </nav>
        <SiteHeaderActions />
      </div>
    </header>
  );
}
