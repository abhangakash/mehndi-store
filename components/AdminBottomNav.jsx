'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, Package, LogOut } from 'lucide-react'

const items = [
  { label: 'Home', href: '/admin', icon: LayoutDashboard },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Products', href: '/admin/products', icon: Package },
]

export default function AdminBottomNav() {
  const pathname = usePathname()

  const isActive = (href) =>
    href === '/admin' ? pathname === '/admin' : pathname?.startsWith(href)

  async function handleLogout() {
    // Paste the body of your existing handleLogout from app/admin/layout.js here
  }

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4">
        {items.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              isActive(href) ? 'text-emerald-700' : 'text-gray-400'
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 active:text-red-600"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </nav>
  )
}