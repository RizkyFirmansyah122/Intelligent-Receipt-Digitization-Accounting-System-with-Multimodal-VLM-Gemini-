import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pelangi Frame - Receipt Intelligence System',
  description: 'Sistem Ekstraksi Nota Cerdas & Rekonsiliasi Otomatis Bengkel Bingkai & Cermin Pelangi Frame',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-[#090D16] dark:text-slate-100 transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
