import { Toaster } from 'react-hot-toast'
import LayoutShell from '@/components/LayoutShell'
import { AuthProvider } from '@/context/AuthContext'
//import PromoPopup from '@/components/PromoPopup'

// analytics component imports 📁
import GoogleAnalytics from '@/components/GoogleAnalytics'
import MetaPixel from '@/components/MetaPixel'
import MicrosoftClarity from '@/components/MicrosoftClarity'

import './globals.css'

export const metadata = {
  metadataBase: new URL('https://crabveda.com'),
  title: {
    default: 'CrabVeda Ayurvedic',
    template: '%s — CrabVeda',
  },
  description:
    'CrabVeda Ayurvedic oil is a premium Ayurvedic formulation for joint and muscle care. Enriched with Crab Extract, Mahanarayan Taila, Ashwagandha, Shallaki, Nirgundi, Rasna, Erand Mool, Devdar, Guggul, Til Taila, and other Ayurvedic herbs to help relieve joint pain, stiffness, inflammation, and support mobility and natural healing.',
  keywords: [
    'CrabVeda',
    'Ayurvedic Oil',
    'Oil',
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
    title: 'CrabVeda Ayurvedic oil',
    description:
      'Premium Ayurvedic Oil formulated with Crab Extract and traditional Ayurvedic herbs for joint and muscle care.',
    images: [
      {
        url: '/logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'CrabVeda Ayurvedic Oil',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CrabVeda Ayurvedic Oil',
    description:
      'Premium Ayurvedic Oil for joint and muscle care.',
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
        {/*Tracking Layer */}
        <GoogleAnalytics />
        <MetaPixel />
        <MicrosoftClarity />

        <AuthProvider>
          <LayoutShell>{children}</LayoutShell>
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