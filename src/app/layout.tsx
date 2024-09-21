import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeModeScript } from 'flowbite-react';
import { Vazirmatn } from 'next/font/google';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import BugsnagPerformance from '@bugsnag/browser-performance';
import Bugsnag from '@bugsnag/js';
import { SiteFooter } from '@/component/Footer';
import { SiteHeader } from '@/component/Header';

export const metadata: Metadata = {
  title: '',
  description: 'ایجاد تصاویر با استفاده از AI',
};
const vazirmatn = Vazirmatn({ subsets: ['latin'] });

Bugsnag.start({
  apiKey: 'cf0be2bd82655ef2bba751a077b818c0',
  plugins: [new BugsnagPluginReact()],
});
BugsnagPerformance.start({
  apiKey: process.env.BUGSNAG_API_KEY || 'default_key',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" suppressHydrationWarning>
      <head></head>
      <body
        className={`${vazirmatn.className} dark:bg-gray-900 dark:text-white`}>
        <SiteHeader />
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
