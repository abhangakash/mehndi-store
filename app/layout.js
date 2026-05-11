import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/context/AuthContext'
import PromoPopup from '@/components/PromoPopup'
import CartAbandonmentWidget from '@/components/CartAbandonmentWidget'
import FloatingButtons from '@/components/FloatingButtons'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import './globals.css'

export const metadata = {
  metadataBase: new URL('https://mehndi.zevette.com'),
  title: {
    default: 'Shrilekha Mehndi Art & Glowup Studio — Pune',
    template: '%s — Shrilekha Mehndi Art',
  },
  description: 'Premium natural henna products, bridal mehndi art and professional makeup services in Pune. Free shipping above ₹499. Book bridal packages on WhatsApp.',
  keywords: ['mehndi', 'henna', 'bridal mehndi Pune', 'makeup artist Pune', 'henna cones', 'natural henna', 'Shrilekha', 'Glowup Studio', 'bridal makeup Pune'],
  authors: [{ name: 'Shrilekha Mehndi Art' }],
  creator: 'Shrilekha Mehndi Art',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://mehndi.zevette.com',
    siteName: 'Shrilekha Mehndi Art & Glowup Studio',
    title: 'Shrilekha Mehndi Art & Glowup Studio — Pune',
    description: 'Premium natural henna products, bridal mehndi art and professional makeup services in Pune.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Shrilekha Mehndi Art' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shrilekha Mehndi Art & Glowup Studio',
    description: 'Premium natural henna products & bridal services in Pune.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics />
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <PromoPopup />
          <CartAbandonmentWidget />
          <FloatingButtons />
          <Toaster
            position="top-right"
            toastOptions={{ style: { borderRadius: '12px', fontSize: '13px', fontWeight: 600 } }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}