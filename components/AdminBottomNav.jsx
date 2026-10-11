'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, Package, LogOut } from 'lucide-react'

const items = [
  { label: 'Home', href: '/admin', icon: LayoutDashboard },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Products', href: '/admin/products', icon: Package },
]

export default function AdminBottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href) =>
    href === '/admin' ? pathname === '/admin' : pathname?.startsWith(href)

  const handleLogout = async () => {
    await fetch('/api/admin-auth', { method: 'DELETE' })
    router.push('/admin-login')
  }

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] px-2 pt-1.5 pb-[calc(env(safe-area-inset-bottom)+6px)]">
      <div className="grid grid-cols-4 gap-1">
        {items.map(({ label, href, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center py-1.5 rounded-lg text-[9px] font-semibold uppercase tracking-wider transition-all ${
                active 
                  ? 'text-emerald-700 bg-emerald-50/80 shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={16} className="mb-0.5" />
              <span>{label}</span>
            </Link>
          )
        })}

        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center py-1.5 rounded-lg text-[9px] font-semibold uppercase tracking-wider text-gray-400 hover:text-red-600 hover:bg-red-50/50 transition-all cursor-pointer"
        >
          <LogOut size={16} className="mb-0.5" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  )
}