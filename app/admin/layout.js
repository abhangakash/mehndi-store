'use client'
import { useState } from 'react'
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
    <div className="min-h-screen flex antialiased text-slate-800" style={{ backgroundColor: '#f8faf9' }}>

      {/* ===== SIDEBAR — desktop ===== */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 sticky top-0 h-screen bg-white"
        style={{ borderRight: '1px solid #e2e8f0' }}>
        
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-emerald-600/10 text-emerald-700 shadow-sm">
              <Leaf size={16} className="fill-emerald-600/5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-900 leading-tight">Crabveda</p>
              <p className="text-[9px] font-bold uppercase tracking-wider leading-tight text-slate-400 mt-0.5">
                Ayurveda & Pain Relief
              </p>
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
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                style={{
                  backgroundColor: active ? '#dcfce7' : 'transparent',
                  color: active ? '#047857' : '#64748b',
                }}>
                <Icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-slate-100 flex flex-col gap-1">
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-600">
            <ExternalLink size={14} /> View Store
          </Link>

          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover:bg-red-50 text-red-600/80 w-full text-left">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* ===== MOBILE TOP BAR ===== */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white"
        style={{ borderBottom: '1px solid #e2e8f0' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-emerald-600/10 text-emerald-700">
            <Leaf size={13} />
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-slate-900">
            Crabveda Admin
          </p>
        </div>

        <button onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-50">
          <Menu size={20} />
        </button>
      </div>

      {/* ===== MOBILE SIDEBAR OVERLAY ===== */}
      {sidebarOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)} />

          <div className="lg:hidden fixed left-0 top-0 bottom-0 w-64 z-50 flex flex-col bg-white shadow-xl">

            <div className="px-5 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-600/10 text-emerald-700">
                  <Leaf size={16} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-900">
                    Crabveda
                  </p>

                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Ayurveda & Pain Relief
                  </p>
                </div>
              </div>

              <button onClick={() => setSidebarOpen(false)}
                className="text-slate-400 hover:text-slate-600">
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
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                    style={{
                      backgroundColor: active ? '#dcfce7' : 'transparent',
                      color: active ? '#047857' : '#64748b',
                    }}>
                    <Icon size={16} /> {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="px-3 py-4 border-t border-slate-100 flex flex-col gap-1">
              <Link href="/" target="_blank"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:bg-slate-50">
                <ExternalLink size={14} /> View Store
              </Link>

              <button onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-left text-red-600/80 hover:bg-red-50">
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 min-w-0 lg:pt-0 pt-16 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}