'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, Menu, X, Leaf, User, LogOut, Package, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import Image from 'next/image'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Shop' },
  {
    label: 'Services',
    children: [
      { href: '/packages', label: '💍 Packages' },
      { href: '/gallery', label: '📸 Gallery' },
    ],
  },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const totalItems = useCartStore(s => s.getTotalItems())
  const { user, profile, signOut } = useAuth()

  useEffect(() => { setMounted(true) }, [])

  // Close dropdowns on route change
  useEffect(() => {
    setMenuOpen(false)
    setServicesOpen(false)
    setUserMenuOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
    toast.success('Signed out')
    router.push('/')
  }

  const isActive = (href) => pathname === href

  return (
    <nav className="sticky top-0 z-50 bg-white border-b" style={{ borderColor: 'var(--brand-border)' }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 relative">
            <Image
              src="/art2.png"
              alt="Shrilekha Mehndi Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <div className="font-semibold text-sm leading-tight" style={{ color: 'var(--brand-green)' }}>Shrilekha</div>
            <div className="text-xs leading-tight" style={{ color: 'var(--brand-muted)' }}>Mehndi Art & Glowup</div>
          </div>
          <div className="sm:hidden font-semibold text-sm" style={{ color: 'var(--brand-green)' }}>Shrilekha</div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            link.children ? (
              <div key={link.label} className="relative">
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
                  style={{ color: 'var(--brand-muted)' }}>
                  {link.label}
                  <ChevronDown size={14} className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                </button>
                {servicesOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setServicesOpen(false)} />
                    <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl border shadow-lg py-1 z-20"
                      style={{ borderColor: 'var(--brand-border)' }}>
                      {link.children.map(child => (
                        <Link key={child.href} href={child.href}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                          style={{ color: isActive(child.href) ? 'var(--brand-green)' : 'var(--brand-text)' }}>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link key={link.href} href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
                style={{ color: isActive(link.href) ? 'var(--brand-green)' : 'var(--brand-muted)' }}>
                {link.label}
              </Link>
            )
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Cart */}
          <Link href="/cart" className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <ShoppingCart size={20} style={{ color: 'var(--brand-green)' }} />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-medium"
                style={{ backgroundColor: 'var(--brand-brown)' }}>
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>

          {/* User */}
          {user ? (
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                  style={{ backgroundColor: 'var(--brand-green)' }}>
                  {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                </div>
                <span className="hidden md:block text-sm font-medium max-w-20 truncate"
                  style={{ color: 'var(--brand-green)' }}>
                  {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                </span>
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border shadow-lg py-1 z-20"
                    style={{ borderColor: 'var(--brand-border)' }}>
                    <Link href="/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50"
                      style={{ color: 'var(--brand-text)' }}>
                      <User size={15} /> My Profile
                    </Link>
                    <Link href="/profile?tab=orders"
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
                </>
              )}
            </div>
          ) : (
            <Link href="/login"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors hover:bg-gray-50"
              style={{ color: 'var(--brand-green)', borderColor: 'var(--brand-green)' }}>
              <User size={15} /> Login
            </Link>
          )}

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-50" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white" style={{ borderColor: 'var(--brand-border)' }}>
          <div className="px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              link.children ? (
                <div key={link.label}>
                  <div className="text-xs font-semibold px-3 py-1 mt-2 mb-1 uppercase tracking-wider"
                    style={{ color: 'var(--brand-muted)' }}>
                    {link.label}
                  </div>
                  {link.children.map(child => (
                    <Link key={child.href} href={child.href}
                      className="flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-lg hover:bg-gray-50"
                      style={{ color: isActive(child.href) ? 'var(--brand-green)' : 'var(--brand-text)' }}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link key={link.href} href={link.href}
                  className="text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ color: isActive(link.href) ? 'var(--brand-green)' : 'var(--brand-text)' }}>
                  {link.label}
                </Link>
              )
            ))}
            <div className="border-t my-2" style={{ borderColor: 'var(--brand-border)' }} />
            {user ? (
              <>
                <Link href="/profile" className="text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-gray-50"
                  style={{ color: 'var(--brand-text)' }}>
                  👤 My Profile
                </Link>
                <Link href="/profile?tab=orders" className="text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-gray-50"
                  style={{ color: 'var(--brand-text)' }}>
                  📦 My Orders
                </Link>
                <button onClick={handleSignOut} className="text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-red-50 text-left text-red-500">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" className="btn-primary text-sm justify-center mt-1">
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}