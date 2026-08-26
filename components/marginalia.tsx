import type { ReactNode } from 'react';

export function Marginalia({ children, label = 'Margin note' }: { children: ReactNode; label?: string }) {
  return (
    <aside className="marginalia" aria-label={label}>
      <span className="marginalia-label functional-label">{label}</span>
      <div className="marginalia-prose mono">{children}</div>
    </aside>
  );
}
