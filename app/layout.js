import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/context/AuthContext'
import PromoPopup from '@/components/PromoPopup'
import './globals.css'

export const metadata = {
  title: 'Shrilekha Mehndi Art & Glowup Studio — Pune',
  description: 'Premium natural henna products, bridal mehndi art and professional makeup services in Pune. Free shipping above ₹499.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <PromoPopup />
          <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', fontSize: '13px' } }} />
        </AuthProvider>
      </body>
    </html>
  )
}
