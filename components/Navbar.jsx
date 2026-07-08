'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ShoppingCart, Menu, X, User, LogOut,
  Package, ChevronDown, Sparkles, MapPin, Search
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import Image from 'next/image'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Shop' },
  { href: '/track-order', label: 'Track Order' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) {
    return null
  }

  const router = useRouter()
  const totalItems = useCartStore(s => s.getTotalItems())
  const { user, profile, signOut } = useAuth()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    setMenuOpen(false)
    setServicesOpen(false)
    setUserMenuOpen(false)

    const token = requestAnimationFrame(() => {
      document.body.style.overflow = 'unset'
    })
    return () => cancelAnimationFrame(token)
  }, [pathname])

  const toggleMenu = () => {
    const next = !menuOpen
    setMenuOpen(next)
    document.body.style.overflow = next ? 'hidden' : 'unset'
  }

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
    toast.success('Signed out cleanly')
    router.push('/')
  }

  const isActive = (href) => pathname === href

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-gray-100 bg-white/90 backdrop-blur-xl shadow-xs">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">

          {/* Mobile toggle */}
          <button onClick={toggleMenu} className="lg:hidden p-2 text-gray-500 hover:text-black rounded-xl transition-colors">
            <Menu size={20} />
          </button>

          {/* Logo Brand Frame */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-[28px] h-[28px] rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-gray-100">
              <Image src="/logo.jpeg" alt="Crabveda Logo" width={28} height={28} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-black font-black tracking-widest text-xs leading-none uppercase">Crabveda</span>
              <span className="text-[#c9a84c] text-[8px] uppercase tracking-widest font-black mt-0.5">Ayurvedic</span>
            </div>
          </Link>

          {/* Desktop Nav Actions */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <div key={link.label} className="relative">
                <Link href={link.href}
                  className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${
                    isActive(link.href) ? 'text-[#c9a84c]' : 'text-gray-500 hover:text-black'
                  }`}>
                  {link.label}
                </Link>
              </div>
            ))}
          </nav>

          {/* Right Action Stack */}
          <div className="flex items-center gap-1">
            
            {/* Quick Track (Mobile Only Shortcut) */}
            <Link href="/track-order" className="lg:hidden p-2 text-gray-500 hover:text-black transition-colors" title="Track Order">
              <MapPin size={16} />
            </Link>

            {/* Shopping Cart Trigger */}
            <Link href="/cart" className="relative p-2 text-gray-500 hover:text-black transition-colors">
              <ShoppingCart size={16} />
              {mounted && totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#c9a84c] text-white text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* User Interface Hub */}
            {mounted && (
              user ? (
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-black bg-[#0f1a0e]">
                      {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                    </div>
                    <span className="hidden md:block text-[10px] font-black text-gray-500 max-w-[80px] truncate uppercase tracking-widest">
                      {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                    </span>
                  </button>
                  
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-gray-100 bg-white shadow-xl py-2 z-20">
                        <div className="px-4 py-2 border-b border-gray-50 mb-1">
                          <p className="text-xs font-black text-black truncate">{profile?.full_name || 'My Account'}</p>
                          <p className="text-[10px] font-semibold text-gray-400 truncate">{user.email}</p>
                        </div>
                        {[
                          { href: '/profile', icon: <User size={13} />, label: 'My Profile' },
                          { href: '/profile?tab=orders', icon: <Package size={13} />, label: 'My Orders' },
                          { href: '/profile?tab=addresses', icon: <MapPin size={13} />, label: 'Addresses' },
                          { href: '/track-order', icon: <Search size={13} />, label: 'Track Order' },
                        ].map(item => (
                          <Link key={item.href} href={item.href}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-[10px] font-black text-gray-500 hover:text-black hover:bg-gray-50 uppercase tracking-widest transition-colors">
                            {item.icon} {item.label}
                          </Link>
                        ))}
                        <div className="border-t border-gray-50 mt-1 pt-1">
                          <button onClick={handleSignOut}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-[10px] font-black text-red-600 hover:bg-red-50 uppercase tracking-widest transition-colors">
                            <LogOut size={13} /> Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/login"
                  className="flex items-center gap-1.5 ml-1 px-3 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest bg-[#0f1a0e] shadow-xs hover:opacity-95 transition-all">
                  <User size={12} />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      {/* Full Screen Mobile Overlay Menu */}
      <div className={`lg:hidden fixed inset-0 w-screen h-[100dvh] bg-white transition-all duration-300 z-[150] overflow-y-auto px-6 pt-20 pb-10 ${
        menuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
      }`}>
        <button onClick={toggleMenu} className="absolute top-4 right-4 p-2 border border-gray-100 rounded-xl text-gray-400 hover:text-black">
          <X size={20} />
        </button>

        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Mobile User Profile Section */}
            {user ? (
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-black bg-[#0f1a0e]">
                  {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-black font-black text-sm uppercase tracking-tight">{profile?.full_name || 'My Account'}</p>
                  <p className="text-gray-400 text-xs font-semibold">{user.email}</p>
                </div>
              </div>
            ) : (
              <Link href="/login" onClick={toggleMenu} className="flex items-center gap-2.5 text-black mb-8 pb-6 border-b border-gray-100 group">
                <div className="w-9 h-9 rounded-xl border border-gray-100 flex items-center justify-center text-gray-500">
                  <User size={16} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Sign In / Register</span>
              </Link>
            )}

            {/* Mobile Links */}
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link key={link.label} href={link.href} onClick={toggleMenu}
                  className={`block text-xl font-black uppercase tracking-tight py-2 transition-colors ${
                    isActive(link.href) ? 'text-[#c9a84c]' : 'text-black hover:text-[#c9a84c]'
                  }`}>
                  {link.label}
                </Link>
              ))}

              {user && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-1">
                  {[
                    { href: '/profile', label: 'My Profile' },
                    { href: '/profile?tab=orders', label: 'My Orders' },
                    { href: '/profile?tab=addresses', label: 'My Addresses' },
                  ].map(item => (
                    <Link key={item.href} href={item.href} onClick={toggleMenu}
                      className="text-gray-400 hover:text-black uppercase tracking-widest text-[10px] font-black py-2 transition-colors">
                      {item.label}
                    </Link>
                  ))}
                  <button onClick={() => { toggleMenu(); handleSignOut(); }}
                    className="text-left text-red-600 uppercase tracking-widest text-[10px] font-black py-2 transition-colors">
                    Sign Out Account
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Social Channels Dock Footer */}
          <div className="pt-6 border-t border-gray-100 flex items-center gap-4">
            {/* Instagram - Standard brand color layout without artificial styling shapes */}
            <a href="https://www.instagram.com/crabveda" target="_blank" rel="noreferrer"
              className="w-7 h-7 flex items-center justify-center text-[#E1306C]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>

            {/* Facebook - Native original blue color asset layout */}
            <a href="https://www.facebook.com/crabveda" target="_blank" rel="noreferrer"
              className="w-7 h-7 flex items-center justify-center text-[#1877F2]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            
            {/* WhatsApp - Displays public/whatsapp.svg with its genuine original colors */}
            <a href="https://wa.me/919921297518" target="_blank" rel="noreferrer"
              className="w-7 h-7 flex items-center justify-center">
              <Image 
                src="/whatsapp.svg" 
                alt="WhatsApp" 
                width={24} 
                height={24} 
                className="w-full h-full object-contain" 
              />
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}