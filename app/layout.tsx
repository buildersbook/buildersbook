import '../styles/tokens.css';
import '../styles/site.css';

import { NextProvider } from 'fumadocs-core/framework/next';
import type { Metadata } from 'next';
import { JetBrains_Mono, Source_Serif_4 } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

import { SiteHeader } from '@/components/site-header';

const sourceSerif = Source_Serif_4({
  axes: ['opsz'],
  display: 'swap',
  subsets: ['latin'],
  style: 'normal',
  variable: '--font-source-serif',
  weight: 'variable',
});

const sourceSerifItalic = Source_Serif_4({
  axes: ['opsz'],
  display: 'swap',
  subsets: ['latin'],
  style: 'italic',
  variable: '--font-source-serif-italic',
  weight: 'variable',
});

const jetBrainsMono = JetBrains_Mono({
  display: 'swap',
  subsets: ['latin'],
  style: 'normal',
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://buildersbook.dev'),
  title: {
    default: "Builder's Book",
    template: "%s · Builder's Book",
  },
  description: 'An open curriculum for engineers who build production software with coding agents.',
  alternates: {
    canonical: '/',
    types: {
      'application/atom+xml': '/atom.xml',
      'application/rss+xml': '/rss.xml',
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sourceSerif.variable} ${sourceSerifItalic.variable} ${jetBrainsMono.variable}`}>
        <NextProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
            enableSystem
            storageKey="buildersbook-theme"
          >
            <a className="skip-link" href="#main-content">Skip to content</a>
            <SiteHeader />
            {children}
          </ThemeProvider>
        </NextProvider>
      </body>
    </html>
  );
}
