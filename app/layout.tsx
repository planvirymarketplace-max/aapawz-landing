import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'All About Pawz — The connected pet-care experience',
  description:
    'Find the right care, the right products, and the right answers for the animals who make your life better. Shop, book care, and learn in one place.',
  openGraph: {
    title: 'All About Pawz — The connected pet-care experience',
    description:
      'Find the right care, the right products, and the right answers for the animals who make your life better.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All About Pawz — The connected pet-care experience',
    description:
      'Find the right care, the right products, and the right answers for the animals who make your life better.',
  },
};

export const viewport: Viewport = {
  themeColor: '#f7f6f1',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="antialiased">
        {children}
      </body>
    </html>
  );
}
