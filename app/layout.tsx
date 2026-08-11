import type { Metadata, Viewport } from "next";
import "./globals.css"; // ወይ ናትካ CSS file

// 1. Metadata setup (ን App Title, Description, Manifest-ን)
export const metadata: Metadata = {
  title: "SmartBiz AI",
  description: "Offline-First Accounting & Management App",
  manifest: "/manifest.json",
};

// 2. Viewport setup (Theme Color ኣብዚ እያ ትኣቱ - ኣብ Next.js 14+ / 15)
export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ti">
      <body className="bg-slate-900 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
