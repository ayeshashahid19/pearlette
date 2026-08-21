import './globals.css'
import { Quicksand } from 'next/font/google'
import AnimatedBackground from './components/AnimatedBackground'
import Providers from './components/Providers'

const quicksand = Quicksand({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
})

export const metadata = {
  title: 'Pearlette.pk - Premium Jewelry',
  description: 'Elegant jewelry collection with cash on delivery',
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