import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { APP_URL, INDEXABLE } from '@/lib/site-config.mjs';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
});

const PAGE_TITLE = 'Catering Harian Kuningan, Jakarta Selatan | MakanHati';
const PAGE_DESCRIPTION =
  'Segera hadir di Kuningan: catering harian dengan menu rumahan yang berganti setiap hari. Pilih rasa gurih, pedas, atau creamy dan daftar untuk mendapatkan informasi promo launching MakanHati.';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    'catering harian jakarta selatan',
    'catering kuningan',
    'catering individual',
    'catering rumahan jakarta',
    'makan siang dikirim',
    'catering mingguan jakarta',
    'catering setiabudi',
    'makanhati',
  ],
  authors: [{ name: 'MakanHati' }],
  creator: 'MakanHati',
  publisher: 'MakanHati',
  robots: {
    index: INDEXABLE,
    follow: INDEXABLE,
    googleBot: {
      index: INDEXABLE,
      follow: INDEXABLE,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: APP_URL,
    siteName: 'MakanHati',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [
      {
        url: '/assets/hero/menu-showcase.webp',
        width: 1672,
        height: 941,
        alt: 'Pilihan menu rumahan MakanHati',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ['/assets/hero/menu-showcase.webp'],
  },
  alternates: {
    canonical: APP_URL,
  },
  icons: {
    icon: '/assets/brand/makanhati-logo.png',
  shortcut: '/assets/brand/makanhati-logo.png',
  apple: '/assets/brand/makanhati-logo.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#811b32',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
