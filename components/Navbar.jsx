'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ShoppingCart, Menu, X, Leaf, User, LogOut,
  Package, ChevronDown, Sparkles, MapPin, Search
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import Image from 'next/image'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Shop' },
  { href: '/track-order', label: '📦 Track Order' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) {
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
    document.body.style.overflow = 'unset'
  }, [pathname])

  const toggleMenu = () => {
    const next = !menuOpen
    setMenuOpen(next)
    document.body.style.overflow = next ? 'hidden' : 'unset'
  }

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
    toast.success('Signed out')
    router.push('/')
  }

  const isActive = (href) => pathname === href

  return (
    <header className="sticky top-0 z-[100] w-full bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-4">
        <div className="relative flex items-center justify-between bg-[#0f1a14]/90 backdrop-blur-xl border border-[#c9a84c]/30 rounded-full px-5 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">

          {/* Mobile toggle */}
          <button onClick={toggleMenu} className="lg:hidden p-2 text-[#c9a84c]">
            <Menu size={22} />
          </button>

          {/* Logo with Brand Name Always Visible */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-[26px] h-[26px] rounded-full overflow-hidden flex items-center justify-center shrink-0">
              <Image src="/logo.jpeg" alt="Logo" width={26} height={26} className="w-full h-full object-cover brightness-110 rounded-full" />
            </div>
            {/* Changed from 'hidden sm:flex' to 'flex' so it displays on mobile layout */}
            <div className="flex flex-col">
              <span className="text-white font-black tracking-widest text-[11px] leading-none uppercase">Crabveda</span>
              <span className="text-[#c9a84c] text-[7px] uppercase tracking-[0.3em] font-bold mt-0.5">Oil</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <div key={link.label} className="relative group">
                {link.children ? (
                  <>
                    <button
                      onClick={() => setServicesOpen(!servicesOpen)}
                      className="flex items-center gap-1 px-3 py-2 text-[10px] font-bold text-white/70 hover:text-[#c9a84c] uppercase tracking-[0.2em] transition-colors rounded-full">
                      {link.label} <ChevronDown size={10} className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {servicesOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setServicesOpen(false)} />
                        <div className="absolute top-full left-0 pt-3 z-20">
                          <div className="bg-[#0f1a14] border border-[#c9a84c]/20 rounded-2xl p-2 shadow-2xl min-w-[180px]">
                            {link.children.map(child => (
                              <Link key={child.href} href={child.href}
                                className="block px-4 py-2.5 text-[10px] font-bold text-white/50 hover:text-[#c9a84c] hover:bg-white/5 rounded-xl uppercase tracking-widest transition-all">
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <Link href={link.href}
                    className={`px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-full ${isActive(link.href) ? 'text-[#c9a84c]' : 'text-white/70 hover:text-white'}`}>
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Track order — mobile quick access */}
            <Link href="/track-order"
              className="lg:hidden p-2 text-white/60 hover:text-[#c9a84c] transition-colors"
              title="Track Order">
              <MapPin size={18} strokeWidth={2} />
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-white hover:text-[#c9a84c] transition-colors">
              <ShoppingCart size={18} strokeWidth={2} />
              {mounted && totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#c9a84c] text-[#0f1a14] text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-[#0f1a14]">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* User */}
            {mounted && (
              user ? (
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 pl-1 pr-3 py-1.5 rounded-full hover:bg-white/5 transition-colors">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[#0f1a14] text-xs font-black"
                      style={{ backgroundColor: '#c9a84c' }}>
                      {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                    </div>
                    <span className="hidden md:block text-[10px] font-black text-white/70 max-w-16 truncate">
                      {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                    </span>
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-52 bg-[#0f1a14] border border-[#c9a84c]/20 rounded-2xl shadow-2xl py-2 z-20">
                        <div className="px-4 py-2 border-b border-white/5 mb-1">
                          <p className="text-xs font-black text-white truncate">{profile?.full_name || 'My Account'}</p>
                          <p className="text-[10px] text-white/30 truncate">{user.email}</p>
                        </div>
                        {[
                          { href: '/profile', icon: <User size={13} />, label: 'My Profile' },
                          { href: '/profile?tab=orders', icon: <Package size={13} />, label: 'My Orders' },
                          { href: '/profile?tab=addresses', icon: <MapPin size={13} />, label: 'My Addresses' },
                          { href: '/track-order', icon: <Search size={13} />, label: 'Track Order' },
                        ].map(item => (
                          <Link key={item.href} href={item.href}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-[10px] font-bold text-white/50 hover:text-[#c9a84c] hover:bg-white/5 uppercase tracking-widest transition-all">
                            {item.icon} {item.label}
                          </Link>
                        ))}
                        <div className="border-t border-white/5 mt-1 pt-1">
                          <button onClick={handleSignOut}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[10px] font-bold hover:bg-red-500/10 uppercase tracking-widest transition-all"
                            style={{ color: 'rgba(220,38,38,0.7)' }}>
                            <LogOut size={13} /> Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/login"
                  className="flex items-center gap-2 ml-1 px-4 py-1.5 rounded-full bg-[#c9a84c] text-[#0f1a14] text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg">
                  <User size={12} strokeWidth={3} />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div className={`lg:hidden fixed inset-0 bg-[#0f1a14] transition-all duration-500 z-[150] ${menuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-full'}`}>
        <button onClick={toggleMenu} className="absolute top-7 right-6 p-3 bg-white/5 border border-white/10 rounded-full text-[#c9a84c]">
          <X size={24} />
        </button>

        <div className="flex flex-col h-full px-8 pt-20 pb-10 overflow-y-auto">
          {/* User greeting */}
          {user && (
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-[#0f1a14] text-lg font-black"
                style={{ backgroundColor: '#c9a84c' }}>
                {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-white font-black text-base">{profile?.full_name || 'My Account'}</p>
                <p className="text-white/30 text-xs">{user.email}</p>
              </div>
            </div>
          )}

          {!user && (
            <Link href="/login" className="flex items-center gap-3 text-[#c9a84c] mb-8 group">
              <div className="w-10 h-10 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center">
                <User size={18} />
              </div>
              <span className="text-xl font-black uppercase tracking-widest">Sign In</span>
            </Link>
          )}

          {/* Main nav links */}
          <div className="flex flex-col gap-2 flex-1">
            {NAV_LINKS.map((link) => (
              <div key={link.label}>
                {link.children ? (
                  <div className="mb-2">
                    <p className="flex items-center gap-2 text-[#c9a84c] text-[9px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">
                      <Sparkles size={9} /> {link.label}
                    </p>
                    {link.children.map(child => (
                      <Link key={child.href} href={child.href}
                        className="block text-xl font-light text-white tracking-tighter uppercase py-1 pl-4 hover:text-[#c9a84c] transition-colors">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link href={link.href}
                    className={`block text-3xl font-light tracking-tighter uppercase py-1 transition-colors ${isActive(link.href) ? 'text-[#c9a84c]' : 'text-white hover:text-[#c9a84c]'}`}>
                    {link.label}
                  </Link>
                )}
              </div>
            ))}

            {/* User links in mobile */}
            {user && (
              <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-1">
                {[
                  { href: '/profile', label: 'My Profile' },
                  { href: '/profile?tab=orders', label: 'My Orders' },
                  { href: '/profile?tab=addresses', label: 'My Addresses' },
                ].map(item => (
                  <Link key={item.href} href={item.href}
                    className="text-white/40 hover:text-[#c9a84c] uppercase tracking-widest text-sm font-bold py-1 transition-colors">
                    {item.label}
                  </Link>
                ))}
                <button onClick={handleSignOut}
                  className="text-left text-red-400/60 hover:text-red-400 uppercase tracking-widest text-sm font-bold py-1 transition-colors">
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Social icons */}
          <div className="mt-auto pt-6 flex items-center gap-4">
            <a href="https://www.instagram.com/crabveda?igsh=M2VoNzRoOGhvMzFu" target="_blank" rel="noreferrer"
              className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#c9a84c]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>
            <a href="https://wa.me/919921297518" target="_blank" rel="noreferrer"
              className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#c9a84c]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.118 1.524 5.84L0 24l6.342-1.498A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.802 9.802 0 01-5.013-1.378l-.36-.214-3.765.889.942-3.664-.235-.376A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
              </svg>
            </a>
            <a href="https://maps.google.com/?q=solapur+Maharashtra" target="_blank" rel="noreferrer"
              className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#c9a84c]">
              <MapPin size={18} />
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}