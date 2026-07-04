import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import {
  Package, ShoppingBag, TrendingUp, Users,
  ArrowRight, Clock, CheckCircle, Truck, XCircle,
  AlertCircle, IndianRupee, Leaf
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
  pending:   { label: 'Pending Inquiry', color: '#d97706', bg: '#fef3c7', icon: Clock },
  confirmed: { label: 'Order Packed',  color: '#2563eb', bg: '#dbeafe', icon: CheckCircle },
  shipped:   { label: 'In Transit',    color: '#7c3aed', bg: '#ede9fe', icon: Truck },
  delivered: { label: 'Delivered',     color: '#059669', bg: '#dcfce7', icon: CheckCircle },
  cancelled: { label: 'Cancelled',     color: '#dc2626', bg: '#fee2e2', icon: XCircle },
}

export default async function AdminDashboard() {
  const data = await getDashboardData()

  const STAT_CARDS = [
    {
      label: 'Gross Revenue',
      value: `₹${data.totalRevenue.toLocaleString('en-IN')}`,
      sub: 'From paid transactions',
      icon: IndianRupee,
      color: '#059669',
      bg: '#dcfce7',
    },
    {
      label: 'Total Shipments',
      value: data.totalOrders,
      sub: `${data.pendingOrders} awaiting confirmation`,
      icon: ShoppingBag,
      color: '#d97706',
      bg: '#fef3c7',
      alert: data.pendingOrders > 0,
    },
    {
      label: 'Active Inventory',
      value: data.totalProducts,
      sub: data.lowStock > 0 ? `⚠️ ${data.lowStock} low stock lines` : 'All inventory healthy',
      icon: Package,
      color: '#0d9488',
      bg: '#ccfbf1',
      alert: data.lowStock > 0,
    },
    {
      label: 'Dispatch Queue',
      value: data.confirmedOrders,
      sub: `${data.shippedOrders} active shipments in transit`,
      icon: Truck,
      color: '#4f46e5',
      bg: '#e0e7ff',
      alert: data.confirmedOrders > 0,
    },
  ]

  return (
    <div className="min-h-screen text-slate-800 antialiased" style={{ backgroundColor: '#f8faf9' }}>
      
      {/* Top Floating Glow Layout Decorator */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

      {/* Main Header Row */}
      <div className="px-4 sm:px-6 pt-10 pb-8 max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-600/10 border border-emerald-600/10 text-emerald-700 shadow-sm">
              <Leaf size={22} className="fill-emerald-600/10" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Management Hub</h1>
              <p className="text-xs font-semibold uppercase tracking-widest mt-0.5 text-slate-400">
                Crabveda — Ayurveda & Pain Relief
              </p>
            </div>
          </div>
          <div>
            <Link href="/admin/products"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] shadow-sm shadow-emerald-700/10"
            >
              + Add Product Batch
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 pb-16 max-w-6xl mx-auto flex flex-col gap-6 relative z-10">

        {/* Crisp Analytics Dashboard Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="rounded-2xl p-5 border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md duration-200 relative group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-100"
                    style={{ backgroundColor: s.bg }}>
                    <Icon size={18} style={{ color: s.color }} />
                  </div>
                  {s.alert && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </div>
                <p className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{s.value}</p>
                <p className="text-[11px] font-bold uppercase tracking-wider mt-1 text-slate-400">
                  {s.label}
                </p>
                <p className="text-xs mt-2 font-medium" style={{ color: s.alert ? '#dc2626' : '#64748b' }}>
                  {s.sub}
                </p>
              </div>
            )
          })}
        </div>

        {/* Refined Quick Action Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/admin/orders', label: 'Order Books', icon: ShoppingBag, color: '#2563eb' },
            { href: '/admin/products', label: 'Product Inventory', icon: Package, color: '#0d9488' },
            { href: '/admin/orders?status=pending', label: 'Pending Queue', icon: Clock, color: '#d97706', badge: data.pendingOrders },
            { href: '/admin/orders?status=confirmed', label: 'Awaiting Packing', icon: Truck, color: '#4f46e5', badge: data.confirmedOrders },
          ].map(a => {
            const Icon = a.icon
            return (
              <Link key={a.href} href={a.href}
                className="rounded-2xl p-4 flex flex-col gap-3 bg-white border border-slate-200 shadow-sm hover:border-emerald-600/30 hover:shadow-md transition-all group relative"
              >
                {a.badge > 0 && (
                  <span className="absolute top-4 right-4 w-5 h-5 rounded-md text-white text-[10px] flex items-center justify-center font-bold bg-red-500 shadow-sm shadow-red-500/10">
                    {a.badge}
                  </span>
                )}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${a.color}10` }}>
                  <Icon size={16} style={{ color: a.color }} />
                </div>
                <div className="flex items-center justify-between w-full mt-1">
                  <p className="text-xs font-bold tracking-wide text-slate-700">{a.label}</p>
                  <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform group-hover:text-emerald-700" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Clean Live Fulfillment Activity List */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="px-5 py-4 flex items-center justify-between bg-slate-50 border-b border-slate-200">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Live Fulfillment Feed
            </p>
            <Link href="/admin/orders" className="text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-800 transition-colors">
              Full Ledger →
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {data.recentOrders.length === 0 ? (
              <div className="p-12 text-center">
                <ShoppingBag size={36} className="mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-medium text-slate-400">No recent batch entry streams recorded</p>
              </div>
            ) : data.recentOrders.map(order => {
              const status = STATUS_CONFIG[order.order_status] || STATUS_CONFIG.pending
              const StatusIcon = status.icon
              return (
                <div key={order.id} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50/70 transition-colors">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: status.bg }}>
                    <StatusIcon size={15} style={{ color: status.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate text-slate-900">{order.customer_name}</p>
                      <span className="text-xs font-mono font-medium flex-shrink-0 text-slate-400">
                        #{order.id.slice(0, 6).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} ·{' '}
                      <span className="uppercase font-semibold text-slate-500">{order.payment_method === 'cod' ? 'COD' : 'Prepaid'}</span>
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-sm text-slate-900">₹{Number(order.total_amount).toFixed(0)}</p>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5"
                      style={{ backgroundColor: status.bg, color: status.color }}>
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