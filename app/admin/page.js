import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import {
  Package, ShoppingBag, TrendingUp, Users,
  ArrowRight, Clock, CheckCircle, Truck, XCircle,
  AlertCircle, IndianRupee
} from 'lucide-react'

async function getDashboardData() {
  const [
    { count: totalProducts },
    { count: totalOrders },
    { count: pendingOrders },
    { count: confirmedOrders },
    { count: shippedOrders },
    { data: revenueData },
    { data: recentOrders },
    { count: lowStock },
  ] = await Promise.all([
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }).eq('order_status', 'pending'),
    supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }).eq('order_status', 'confirmed'),
    supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }).eq('order_status', 'shipped'),
    supabaseAdmin.from('orders').select('total_amount').eq('payment_status', 'paid'),
    supabaseAdmin.from('orders').select('id, customer_name, total_amount, order_status, payment_method, created_at').order('created_at', { ascending: false }).limit(5),
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }).lt('stock', 5).eq('is_active', true),
  ])

  const totalRevenue = (revenueData || []).reduce((s, o) => s + Number(o.total_amount), 0)

  return {
    totalProducts: totalProducts || 0,
    totalOrders: totalOrders || 0,
    pendingOrders: pendingOrders || 0,
    confirmedOrders: confirmedOrders || 0,
    shippedOrders: shippedOrders || 0,
    totalRevenue,
    recentOrders: recentOrders || [],
    lowStock: lowStock || 0,
  }
}

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#d97706', bg: '#fef3c7', icon: Clock },
  confirmed: { label: 'Confirmed', color: '#1d4ed8', bg: '#dbeafe', icon: CheckCircle },
  shipped:   { label: 'Shipped',   color: '#7c3aed', bg: '#ede9fe', icon: Truck },
  delivered: { label: 'Delivered', color: '#15803d', bg: '#dcfce7', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: '#dc2626', bg: '#fee2e2', icon: XCircle },
}

export default async function AdminDashboard() {
  const data = await getDashboardData()

  const STAT_CARDS = [
    {
      label: 'Total Revenue',
      value: `₹${data.totalRevenue.toLocaleString('en-IN')}`,
      sub: 'from paid orders',
      icon: IndianRupee,
      color: '#c9a84c',
      bg: '#fef9ee',
    },
    {
      label: 'Total Orders',
      value: data.totalOrders,
      sub: `${data.pendingOrders} pending`,
      icon: ShoppingBag,
      color: '#1d4ed8',
      bg: '#dbeafe',
      alert: data.pendingOrders > 0,
    },
    {
      label: 'Active Products',
      value: data.totalProducts,
      sub: data.lowStock > 0 ? `⚠️ ${data.lowStock} low stock` : 'All stocked',
      icon: Package,
      color: '#15803d',
      bg: '#dcfce7',
      alert: data.lowStock > 0,
    },
    {
      label: 'Needs Shipping',
      value: data.confirmedOrders,
      sub: `${data.shippedOrders} already shipped`,
      icon: Truck,
      color: '#7c3aed',
      bg: '#ede9fe',
      alert: data.confirmedOrders > 0,
    },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0f0d' }}>

      {/* Header */}
      <div className="px-4 sm:px-6 pt-8 pb-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">Admin Dashboard</h1>
            <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: 'rgba(201,168,76,0.6)' }}>
              Shrilekha Mehndi Art & Glowup
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/products"
              className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all"
              style={{ backgroundColor: '#c9a84c', color: '#0f1a0e' }}>
              + Add Product
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 pb-10 max-w-6xl mx-auto flex flex-col gap-6">

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {STAT_CARDS.map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="rounded-2xl p-4 md:p-5" style={{ backgroundColor: '#fcfaf6' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: s.bg }}>
                    <Icon size={18} style={{ color: s.color }} />
                  </div>
                  {s.alert && (
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  )}
                </div>
                <p className="text-2xl md:text-3xl font-black" style={{ color: '#0f1a0e' }}>{s.value}</p>
                <p className="text-xs font-black uppercase tracking-wider mt-0.5" style={{ color: 'rgba(15,26,14,0.4)' }}>
                  {s.label}
                </p>
                <p className="text-xs mt-1" style={{ color: s.alert ? '#dc2626' : 'rgba(15,26,14,0.3)' }}>
                  {s.sub}
                </p>
              </div>
            )
          })}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/admin/orders', label: 'Manage Orders', icon: ShoppingBag, color: '#1d4ed8' },
            { href: '/admin/products', label: 'Manage Products', icon: Package, color: '#15803d' },
            { href: '/admin/orders?status=pending', label: 'Pending Orders', icon: Clock, color: '#d97706', badge: data.pendingOrders },
            { href: '/admin/orders?status=confirmed', label: 'Ready to Ship', icon: Truck, color: '#7c3aed', badge: data.confirmedOrders },
          ].map(a => {
            const Icon = a.icon
            return (
              <Link key={a.href} href={a.href}
                className="rounded-2xl p-4 flex flex-col gap-2 hover:shadow-md transition-all group relative"
                style={{ backgroundColor: '#fcfaf6' }}>
                {a.badge > 0 && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-black"
                    style={{ backgroundColor: '#dc2626', fontSize: '9px' }}>
                    {a.badge}
                  </span>
                )}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${a.color}18` }}>
                  <Icon size={18} style={{ color: a.color }} />
                </div>
                <p className="text-xs font-black uppercase tracking-wide" style={{ color: '#0f1a0e' }}>{a.label}</p>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform"
                  style={{ color: 'rgba(15,26,14,0.3)' }} />
              </Link>
            )
          })}
        </div>

        {/* Recent orders */}
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#fcfaf6' }}>
          <div className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(15,26,14,0.06)', backgroundColor: '#fef9ee' }}>
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(15,26,14,0.5)' }}>
              Recent Orders
            </p>
            <Link href="/admin/orders" className="text-xs font-black uppercase tracking-wider"
              style={{ color: '#c9a84c' }}>
              View All →
            </Link>
          </div>
          <div className="divide-y" style={{ '--tw-divide-opacity': 1 }}>
            {data.recentOrders.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingBag size={32} className="mx-auto mb-2" style={{ color: 'rgba(15,26,14,0.15)' }} />
                <p className="text-sm" style={{ color: 'rgba(15,26,14,0.3)' }}>No orders yet</p>
              </div>
            ) : data.recentOrders.map(order => {
              const status = STATUS_CONFIG[order.order_status] || STATUS_CONFIG.pending
              const StatusIcon = status.icon
              return (
                <div key={order.id} className="px-5 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: status.bg }}>
                    <StatusIcon size={15} style={{ color: status.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black truncate" style={{ color: '#0f1a0e' }}>{order.customer_name}</p>
                      <span className="text-xs font-bold flex-shrink-0" style={{ color: 'rgba(15,26,14,0.3)' }}>
                        #{order.id.slice(0, 6).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'rgba(15,26,14,0.4)' }}>
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} ·{' '}
                      {order.payment_method === 'cod' ? 'COD' : 'Online'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-sm" style={{ color: '#c9a84c' }}>₹{Number(order.total_amount).toFixed(0)}</p>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: status.bg, color: status.color, fontSize: '9px' }}>
                      {status.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
