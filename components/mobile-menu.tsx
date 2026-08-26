'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';

import { siteNavigation } from '@/lib/navigation';

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function openMenu(): void {
    setOpen(true);
    dialogRef.current?.showModal();
    requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>('a')?.focus());
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
          triggerRef.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            closeMenu();
          }
        }}
      >
        <div className="mobile-menu-panel">
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
          </nav>
        </div>
      </dialog>
    </div>
  );
}
