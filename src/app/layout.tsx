import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ServiceWorkerRegistration from '@/components/shared/ServiceWorkerRegistration';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Track your daily habits',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}