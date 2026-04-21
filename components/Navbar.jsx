'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  ShoppingCart, 
  User, 
  ChevronDown, 
  Menu, 
  X, 
  Camera, 
  Send, 
  MapPin, 
  Sparkles 
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Shop' },
  {
    label: 'Services',
    children: [
      { href: '/packages', label: 'Bridal Packages' },
      { href: '/gallery', label: 'Work Gallery' },
    ],
  },
  { href: '/blog', label: 'Journal' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false) 
  const pathname = usePathname()
  const totalItems = useCartStore(s => s.getTotalItems())
  const { user } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => { 
    setMenuOpen(false) 
    document.body.style.overflow = 'unset'
  }, [pathname])

  const toggleMenu = () => {
    const newState = !menuOpen
    setMenuOpen(newState)
    document.body.style.overflow = newState ? 'hidden' : 'unset'
  }

  return (
    /* 1. STICKY: This solves your Cart Page overlap issue. 
       2. BG-TRANSPARENT: This ensures no 'rectangle' background shows.
    */
    <header className="sticky top-0 z-[100] w-full bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-4">
        
        {/* THE OVAL PILL 
            - Using a Deep Green (Forest Green) Glass effect 
            - Gold Border (white/20 + Gold text)
        */}
        <div className="relative flex items-center justify-between bg-[#0f1a14]/90 backdrop-blur-xl border border-[#c9a84c]/30 rounded-full px-6 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.2)] pointer-events-auto">
          
          {/* Mobile Toggle */}
          <button onClick={toggleMenu} className="lg:hidden p-2 text-[#c9a84c]">
            <Menu size={24} />
          </button>

          {/* Branding */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/art2.png" alt="Logo" width={28} height={28} className="brightness-110" />
            <div className="flex flex-col">
              <span className="text-white font-black tracking-widest text-[11px] lg:text-xs leading-none uppercase">SHRILEKHA</span>
              <span className="text-[#c9a84c] text-[7px] uppercase tracking-[0.3em] font-bold mt-0.5">Makeup & Mehndi Studio</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <div key={link.label} className="relative group">
                {link.children ? (
                  <button className="flex items-center gap-1 text-[10px] font-bold text-white/70 hover:text-[#c9a84c] uppercase tracking-[0.2em] transition-colors">
                    {link.label} <ChevronDown size={10} />
                  </button>
                ) : (
                  <Link href={link.href} className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                    pathname === link.href ? 'text-[#c9a84c]' : 'text-white/70 hover:text-white'
                  }`}>
                    {link.label}
                  </Link>
                )}
                
                {/* Dropdown Menu */}
                {link.children && (
                  <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 group-hover:visible transition-all duration-300">
                    <div className="bg-[#0f1a14] border border-[#c9a84c]/20 rounded-2xl p-2 shadow-2xl min-w-[180px]">
                      {link.children.map(child => (
                        <Link key={child.href} href={child.href} className="block px-4 py-2.5 text-[9px] font-bold text-white/50 hover:text-[#c9a84c] hover:bg-white/5 rounded-xl uppercase tracking-widest transition-all">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative p-2 text-white hover:text-[#c9a84c] transition-colors">
              <ShoppingCart size={18} strokeWidth={2} />
              {mounted && totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#c9a84c] text-[#0f1a14] text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-[#0f1a14]">
                  {totalItems}
                </span>
              )}
            </Link>
            {user && (
              <Link href="/profile" className="p-2 text-white hover:text-[#c9a84c]">
                <User size={18} strokeWidth={2} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY - Green/Gold Theme */}
      <div className={`lg:hidden fixed inset-0 bg-[#0f1a14] transition-all duration-500 z-[150] ${
        menuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-full'
      }`}>
        <button onClick={toggleMenu} className="absolute top-8 right-8 p-3 bg-white/5 border border-white/10 rounded-full text-[#c9a84c]">
          <X size={28} />
        </button>

        <div className="flex flex-col h-full px-10 pt-32 pb-12">
          <div className="space-y-10">
            {NAV_LINKS.map((link) => (
              <div key={link.label}>
                {link.children ? (
                  <div className="space-y-4">
                    <p className="flex items-center gap-2 text-[#c9a84c] text-[10px] font-black uppercase tracking-[0.4em] opacity-60">
                      <Sparkles size={10} /> {link.label}
                    </p>
                    {link.children.map(child => (
                      <Link key={child.href} href={child.href} className="block text-3xl font-light text-white tracking-tighter uppercase">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link href={link.href} className={`block text-5xl font-light tracking-tighter uppercase ${
                    pathname === link.href ? 'text-[#c9a84c]' : 'text-white'
                  }`}>
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
          
          {/* Mobile Social Dock */}
          <div className="mt-auto flex flex-col gap-8">
            <div className="flex items-center gap-6">
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#c9a84c]"><Camera size={20} /></a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#c9a84c]"><Send size={20} /></a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#c9a84c]"><MapPin size={20} /></a>
            </div>
            <div className="text-white/20 text-[9px] font-bold tracking-[0.3em] pt-6 border-t border-white/5 uppercase">
              Pune • Maharashtra
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}