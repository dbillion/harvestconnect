import ClientLayout from '@/components/client-layout';
import type { Metadata } from 'next';
import { DM_Serif_Display, Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({ 
  subsets: ["latin"],
  variable: '--font-manrope',
  weight: ['400', '500', '700', '800']
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: '--font-display',
  weight: '400'
});

export const metadata: Metadata = {
  title: 'HarvestConnect - Faith-Driven Community Marketplace',
  description: 'Connect with local, faith-driven farmers, artisans, and skilled tradesmen. A community marketplace for natural products, handcrafted goods, and professional services.',
  keywords: ['marketplace', 'community', 'faith', 'local farmers', 'artisans', 'tradesmen', 'organic', 'handcrafted'],
  authors: [{ name: 'HarvestConnect' }],
  openGraph: {
    title: 'HarvestConnect - Faith-Driven Community Marketplace',
    description: 'Connect with local, faith-driven farmers, artisans, and skilled tradesmen.',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" 
        />
      </head>
      <body className={`${manrope.variable} ${dmSerif.variable} font-sans antialiased`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
