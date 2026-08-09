import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cash Track - Smart Business Assistant',
  icons: {
    icon: '/favicon.ico', //
  description: 'Offline-first Accounting App for Small Businesses',
  manifest: '/manifest.json',
  themeColor: '#003366',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-800">
        {children}
      </body>
    </html>
  );
}
