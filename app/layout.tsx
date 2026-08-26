import '../styles/tokens.css';
import '../styles/site.css';

import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import { JetBrains_Mono, Source_Serif_4 } from 'next/font/google';
import type { ReactNode } from 'react';

import { SiteSearchDialog } from '@/components/search-dialog';
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
  title: "Builder's Book",
  description: 'An open curriculum for engineers who build production software with coding agents.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sourceSerif.variable} ${sourceSerifItalic.variable} ${jetBrainsMono.variable}`}>
        <RootProvider
          search={{ SearchDialog: SiteSearchDialog }}
          theme={{
            attribute: 'class',
            defaultTheme: 'system',
            disableTransitionOnChange: true,
            enableSystem: true,
            storageKey: 'buildersbook-theme',
          }}
        >
          <a className="skip-link" href="#main-content">Skip to content</a>
          <SiteHeader />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
