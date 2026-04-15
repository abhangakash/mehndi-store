'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, Menu, X, Leaf, User, LogOut, Package } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const totalItems = useCartStore(s => s.getTotalItems())
  const { user, profile, signOut } = useAuth()

  // Wait for client mount before showing cart count
  // This prevents hydration mismatch with localStorage
  useEffect(() => { setMounted(true) }, [])

  const links = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Shop' },
    { href: '/blog', label: 'Tips & Blog' },
    { href: '/track-order', label: 'Track Order' },
  ]

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
    toast.success('Signed out successfully')
    router.push('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b" style={{ borderColor: 'var(--brand-border)' }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--brand-green)' }}>
            <Leaf size={16} color="white" />
          </div>
          <div>
            <div className="font-semibold text-sm leading-tight" style={{ color: 'var(--brand-green)' }}>Shrilekha</div>
            <div className="text-xs leading-tight" style={{ color: 'var(--brand-muted)' }}>Mehndi Art</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className="text-sm font-medium transition-colors"
              style={{ color: pathname === l.href ? 'var(--brand-green)' : 'var(--brand-muted)' }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Cart — only show count after client mounts */}
          <Link href="/cart" className="relative p-2 rounded-lg transition-colors hover:bg-gray-50">
            <ShoppingCart size={20} style={{ color: 'var(--brand-green)' }} />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-medium"
                style={{ backgroundColor: 'var(--brand-brown)' }}>
                {totalItems}
              </span>
            )}
          </Link>

          {/* User menu */}
          {user ? (
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                  style={{ backgroundColor: 'var(--brand-green)' }}>
                  {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                </div>
                <span className="hidden md:block max-w-24 truncate" style={{ color: 'var(--brand-green)' }}>
                  {profile?.full_name || user.email?.split('@')[0]}
                </span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border shadow-lg py-1 z-50"
                  style={{ borderColor: 'var(--brand-border)' }}>
                  <Link href="/profile" onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50"
                    style={{ color: 'var(--brand-text)' }}>
                    <User size={15} /> My Profile
                  </Link>
                  <Link href="/profile?tab=orders" onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50"
                    style={{ color: 'var(--brand-text)' }}>
                    <Package size={15} /> My Orders
                  </Link>
                  <div className="border-t my-1" style={{ borderColor: 'var(--brand-border)' }} />
                  <button onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-red-50 text-red-500">
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
              style={{ color: 'var(--brand-green)', border: '1px solid var(--brand-green)' }}>
              <User size={15} /> Login
            </Link>
          )}

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-3 bg-white"
          style={{ borderColor: 'var(--brand-border)' }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="text-sm font-medium py-1"
              style={{ color: pathname === l.href ? 'var(--brand-green)' : 'var(--brand-text)' }}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/profile" onClick={() => setMenuOpen(false)}
                className="text-sm font-medium py-1" style={{ color: 'var(--brand-text)' }}>
                My Profile
              </Link>
              <button onClick={handleSignOut} className="text-sm font-medium py-1 text-left text-red-500">
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)}
              className="text-sm font-medium py-1" style={{ color: 'var(--brand-green)' }}>
              Login / Sign Up
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}