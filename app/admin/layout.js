'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, ShoppingBag, Package,
  LogOut, Menu, X, Leaf, ExternalLink
} from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/products', label: 'Products', icon: Package },
]

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isActive = (href, exact) =>
    exact ? pathname === href : pathname.startsWith(href)

  const handleLogout = async () => {
    await fetch('/api/admin-auth', { method: 'DELETE' })
    router.push('/admin-login')
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0a0f0d' }}>

      {/* ===== SIDEBAR — desktop ===== */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 sticky top-0 h-screen"
        style={{ backgroundColor: '#0f1a0e', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(201,168,76,0.15)' }}>
              <Leaf size={16} style={{ color: '#c9a84c' }} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-white leading-tight">Shrilekha</p>
              <p className="text-[9px] font-bold uppercase tracking-wider leading-tight"
                style={{ color: 'rgba(201,168,76,0.6)' }}>Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map(item => {
            const Icon = item.icon
            const active = isActive(item.href, item.exact)
            return (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                style={{
                  backgroundColor: active ? 'rgba(201,168,76,0.12)' : 'transparent',
                  color: active ? '#c9a84c' : 'rgba(255,255,255,0.4)',
                }}>
                <Icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t flex flex-col gap-1"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover:bg-white/5"
            style={{ color: 'rgba(255,255,255,0.3)' }}>
            <ExternalLink size={14} /> View Store
          </Link>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover:bg-red-500/10 w-full text-left"
            style={{ color: 'rgba(220,38,38,0.6)' }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* ===== MOBILE TOP BAR ===== */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: '#0f1a0e', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(201,168,76,0.15)' }}>
            <Leaf size={13} style={{ color: '#c9a84c' }} />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-white">Admin</p>
        </div>
        <button onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <Menu size={20} />
        </button>
      </div>

      {/* ===== MOBILE SIDEBAR OVERLAY ===== */}
      {sidebarOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)} />
          <div className="lg:hidden fixed left-0 top-0 bottom-0 w-64 z-50 flex flex-col"
            style={{ backgroundColor: '#0f1a0e' }}>
            <div className="px-5 py-5 border-b flex items-center justify-between"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(201,168,76,0.15)' }}>
                  <Leaf size={16} style={{ color: '#c9a84c' }} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-white">Shrilekha</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'rgba(201,168,76,0.6)' }}>Admin Panel</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} style={{ color: 'rgba(255,255,255,0.4)' }}>
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
              {NAV.map(item => {
                const Icon = item.icon
                const active = isActive(item.href, item.exact)
                return (
                  <Link key={item.href} href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                    style={{
                      backgroundColor: active ? 'rgba(201,168,76,0.12)' : 'transparent',
                      color: active ? '#c9a84c' : 'rgba(255,255,255,0.4)',
                    }}>
                    <Icon size={16} /> {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="px-3 py-4 border-t flex flex-col gap-1"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <Link href="/" target="_blank" onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                style={{ color: 'rgba(255,255,255,0.3)' }}>
                <ExternalLink size={14} /> View Store
              </Link>
              <button onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-left"
                style={{ color: 'rgba(220,38,38,0.6)' }}>
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 min-w-0 lg:pt-0 pt-14 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
        }

