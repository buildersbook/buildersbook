'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';

export function CurrentPageLink({ href, ...props }: Omit<ComponentProps<typeof Link>, 'href'> & { href: string }) {
  const isCurrentPage = usePathname() === href;
  return <Link {...props} href={href} aria-current={isCurrentPage ? 'page' : undefined} />;
}
