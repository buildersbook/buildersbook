'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';

import { siteNavigation } from '@/lib/navigation';

export function MobileMenu({ onSearch }: { onSearch: (returnFocus: () => void) => void }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLButtonElement>(null);
  const searchRequestedRef = useRef(false);

  function openMenu(): void {
    setOpen(true);
    dialogRef.current?.showModal();
    panelRef.current?.focus();
  }

  function closeMenu(): void {
    dialogRef.current?.close();
  }

  return (
    <div className="mobile-menu">
      <button
        ref={triggerRef}
        className="mobile-menu-trigger functional-label"
        type="button"
        aria-controls="mobile-navigation"
        aria-expanded={open}
        onClick={openMenu}
      >
        Menu
      </button>
      <dialog
        ref={dialogRef}
        className="mobile-menu-dialog"
        id="mobile-navigation"
        aria-label="Site navigation"
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
        onClose={() => {
          setOpen(false);
          if (searchRequestedRef.current) {
            searchRequestedRef.current = false;
            onSearch(() => {
              setOpen(true);
              dialogRef.current?.showModal();
              searchRef.current?.focus();
            });
          } else {
            triggerRef.current?.focus();
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            closeMenu();
          } else if (event.key === 'Tab') {
            const controls = event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && (event.target === first || event.target === panelRef.current)) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && event.target === last) {
              event.preventDefault();
              first?.focus();
            }
          }
        }}
      >
        <div ref={panelRef} className="mobile-menu-panel" tabIndex={-1}>
          <div className="mobile-menu-heading">
            <span className="functional-label">Navigate</span>
            <button className="mobile-menu-close functional-label" type="button" onClick={closeMenu}>
              Close
            </button>
          </div>
          <nav aria-label="Mobile">
            <Link href="/" onClick={closeMenu}>Home</Link>
            {siteNavigation.map((item) => (
              <Link href={item.href} key={item.href} onClick={closeMenu}>{item.label}</Link>
            ))}
            <button
              ref={searchRef}
              className="mobile-menu-search"
              type="button"
              onClick={() => {
                searchRequestedRef.current = true;
                closeMenu();
              }}
            >
              Search
            </button>
          </nav>
        </div>
      </dialog>
    </div>
  );
}
