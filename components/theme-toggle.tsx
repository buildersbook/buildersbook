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
      aria-label={`Switch to ${nextTheme} theme. Current theme: ${currentTheme}.`}
      aria-pressed={currentTheme === 'dark'}
      data-theme={currentTheme}
      onClick={() => setTheme(nextTheme)}
    >
      <span aria-hidden="true">{currentTheme === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  );
}
