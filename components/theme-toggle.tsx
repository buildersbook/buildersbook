'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => undefined;

export function ThemeToggle() {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const { resolvedTheme, setTheme } = useTheme();
  const currentTheme = mounted && resolvedTheme === 'dark' ? 'dark' : 'light';
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

  return (
    <button
      className="theme-toggle functional-label"
      type="button"
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={currentTheme === 'dark'}
      data-theme={currentTheme}
      onClick={() => setTheme(nextTheme)}
    >
      <span className="header-control-label" aria-hidden="true">{currentTheme === 'dark' ? 'Dark' : 'Light'}</span>
      <svg className="header-control-icon" aria-hidden="true" focusable="false" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        {nextTheme === 'light' ? (
          <>
            <circle cx="10" cy="10" r="3.5" />
            <path d="M10 1v3m0 12v3M1 10h3m12 0h3M3.5 3.5l2 2m9 9 2 2m-13 0 2-2m9-9 2-2" />
          </>
        ) : <path d="M17 12.2A7.5 7.5 0 0 1 7.8 3a7.5 7.5 0 1 0 9.2 9.2Z" />}
      </svg>
    </button>
  );
}
