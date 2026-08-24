import './globals.css'
import { Quicksand } from 'next/font/google'
import AnimatedBackground from './components/AnimatedBackground'
import Providers from './components/Providers'

const quicksand = Quicksand({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://pearlette.pk'),
  title: {
    default: 'Pearlette.pk — Handcrafted Premium Jewelry | Cash on Delivery Pakistan',
    template: '%s | Pearlette.pk',
  },
  description:
    'Premium handmade jewelry from Pakistan. Necklaces, bracelets, earrings, rings, arm cuffs and charms, handcrafted with love. Cash on delivery nationwide.',
  keywords: [
    'handmade jewelry Pakistan',
    'handcrafted jewellery',
    'custom jewelry Pakistan',
    'pearl necklace Pakistan',
    'cash on delivery jewelry',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Pearlette.pk',
    title: 'Pearlette.pk — Handcrafted Premium Jewelry',
    description:
      'Premium handmade jewelry from Pakistan, handcrafted with love. Cash on delivery nationwide.',
    locale: 'en_PK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pearlette.pk — Handcrafted Premium Jewelry',
    description:
      'Premium handmade jewelry from Pakistan, handcrafted with love. Cash on delivery nationwide.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={quicksand.className}>
        <Providers>
          <AnimatedBackground />
          <div style={{ position: 'relative', zIndex: 1 }}>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}