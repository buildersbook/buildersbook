'use client';

import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      className="theme-toggle functional-label"
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <span className="theme-action theme-action-dark">
        <span className="theme-action-label">Dark mode</span>
        <svg className="header-control-icon" aria-hidden="true" focusable="false" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 12.2A7.5 7.5 0 0 1 7.8 3a7.5 7.5 0 1 0 9.2 9.2Z" />
        </svg>
      </span>
      <span className="theme-action theme-action-light">
        <span className="theme-action-label">Light mode</span>
        <svg className="header-control-icon" aria-hidden="true" focusable="false" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="10" cy="10" r="3.5" />
          <path d="M10 1v3m0 12v3M1 10h3m12 0h3M3.5 3.5l2 2m9 9 2 2m-13 0 2-2m9-9 2-2" />
        </svg>
      </span>
    </button>
  );
}
