'use client'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartAbandonmentWidget from '@/components/CartAbandonmentWidget'
import FloatingButtons from '@/components/FloatingButtons'
import AdminBottomNav from '@/components/AdminBottomNav'

export default function LayoutShell({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')
  const isLogin = pathname?.includes('login')

  if (isAdmin) {
    return (
      <>
        <main className={`min-h-screen ${isLogin ? '' : 'pb-16 lg:pb-0'}`}>
          {children}
        </main>
        {!isLogin && <AdminBottomNav />}
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartAbandonmentWidget />
      <FloatingButtons />
    </>
  )
}