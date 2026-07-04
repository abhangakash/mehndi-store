import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/context/AuthContext'
//import PromoPopup from '@/components/PromoPopup'
import CartAbandonmentWidget from '@/components/CartAbandonmentWidget'
import FloatingButtons from '@/components/FloatingButtons'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import './globals.css'

export const metadata = {
  metadataBase: new URL('https://crabveda.com'),
  title: {
    default: 'CrabVeda Ayurvedic Crab Oil',
    template: '%s — CrabVeda',
  },
  description:
    'CrabVeda Ayurvedic Crab Oil is a premium Ayurvedic formulation for joint and muscle care. Enriched with Crab Extract, Mahanarayan Taila, Ashwagandha, Shallaki, Nirgundi, Rasna, Erand Mool, Devdar, Guggul, Til Taila, and other Ayurvedic herbs to help relieve joint pain, stiffness, inflammation, and support mobility and natural healing.',
  keywords: [
    'CrabVeda',
    'Ayurvedic Crab Oil',
    'Crab Oil',
    'Joint Pain Relief Oil',
    'Muscle Pain Relief',
    'Ayurvedic Pain Relief',
    'Joint Care',
    'Knee Pain Oil',
    'Back Pain Oil',
    'Shoulder Pain Relief',
    'Arthritis Oil',
    'Massage Oil',
    'Ayurvedic Herbs',
    'Crab Extract',
    'Mahanarayan Taila',
    'Ashwagandha',
    'Shallaki',
    'Nirgundi',
    'Rasna',
    'Guggul',
    'Til Taila',
  ],
  authors: [{ name: 'CrabVeda' }],
  creator: 'CrabVeda',
  publisher: 'CrabVeda',
  applicationName: 'CrabVeda',
  alternates: {
    canonical: 'https://crabveda.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://crabveda.com',
    siteName: 'CrabVeda',
    title: 'CrabVeda Ayurvedic Crab Oil',
    description:
      'Premium Ayurvedic Crab Oil formulated with Crab Extract and traditional Ayurvedic herbs for joint and muscle care.',
    images: [
      {
        url: '/logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'CrabVeda Ayurvedic Crab Oil',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CrabVeda Ayurvedic Crab Oil',
    description:
      'Premium Ayurvedic Crab Oil for joint and muscle care.',
    images: ['/logo.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
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
          <CartAbandonmentWidget />
          <FloatingButtons />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 600,
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}