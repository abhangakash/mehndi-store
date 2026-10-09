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
  pending:   { label: 'Pending Inquiry', color: '#b45309', bg: '#fef3c7', icon: Clock },
  confirmed: { label: 'Order Packed',  color: '#1d4ed8', bg: '#dbeafe', icon: CheckCircle },
  shipped:   { label: 'In Transit',    color: '#4f46e5', bg: '#e0e7ff', icon: Truck },
  delivered: { label: 'Delivered',     color: '#0f172a', bg: '#f1f5f9', icon: CheckCircle },
  cancelled: { label: 'Cancelled',     color: '#b91c1c', bg: '#fee2e2', icon: XCircle },
}

export default async function AdminDashboard() {
  const data = await getDashboardData()

  const STAT_CARDS = [
    {
      label: 'Gross Revenue',
      value: `₹${data.totalRevenue.toLocaleString('en-IN')}`,
      sub: 'From paid transactions',
      icon: IndianRupee,
      color: '#047857',
      bg: '#f0fdf4',
    },
    {
      label: 'Total Shipments',
      value: data.totalOrders,
      sub: `${data.pendingOrders} awaiting confirmation`,
      icon: ShoppingBag,
      color: '#b45309',
      bg: '#fef3c7',
      alert: data.pendingOrders > 0,
    },
    {
      label: 'Active Inventory',
      value: data.totalProducts,
      sub: data.lowStock > 0 ? `⚠️ ${data.lowStock} low stock lines` : 'All inventory healthy',
      icon: Package,
      color: '#0f172a',
      bg: '#f1f5f9',
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
      
      {/* Main Header Row */}
      <div className="px-4 sm:px-6 pt-6 pb-4 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Management Hub</h1>
            <p className="text-[11px] font-semibold uppercase tracking-widest mt-0.5 text-slate-400">
              Crabveda — Fulfillment & Inventory Ledger
            </p>
          </div>
          <div>
            <Link href="/admin/products"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all bg-slate-900 hover:bg-slate-800 active:scale-[0.98] shadow-xs"
            >
              + Add Product Batch
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 pb-12 max-w-6xl mx-auto flex flex-col gap-5">

        {/* Crisp Analytics Dashboard Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STAT_CARDS.map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="rounded-2xl p-4 border border-slate-200 bg-white shadow-xs transition-all hover:shadow-sm relative group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-100"
                    style={{ backgroundColor: s.bg }}>
                    <Icon size={16} style={{ color: s.color }} />
                  </div>
                  {s.alert && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </div>
                <p className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{s.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider mt-0.5 text-slate-400">
                  {s.label}
                </p>
                <p className="text-[11px] mt-1.5 font-medium truncate" style={{ color: s.alert ? '#dc2626' : '#64748b' }}>
                  {s.sub}
                </p>
              </div>
            )
          })}
        </div>

        {/* Refined Quick Action Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/admin/orders', label: 'Order Books', icon: ShoppingBag, color: '#1d4ed8' },
            { href: '/admin/products', label: 'Product Inventory', icon: Package, color: '#0f172a' },
            { href: '/admin/orders?status=pending', label: 'Pending Queue', icon: Clock, color: '#b45309', badge: data.pendingOrders },
            { href: '/admin/orders?status=confirmed', label: 'Awaiting Packing', icon: Truck, color: '#4f46e5', badge: data.confirmedOrders },
          ].map(a => {
            const Icon = a.icon
            return (
              <Link key={a.href} href={a.href}
                className="rounded-2xl p-3.5 flex flex-col gap-2.5 bg-white border border-slate-200 shadow-xs hover:border-slate-400 transition-all group relative"
              >
                {a.badge > 0 && (
                  <span className="absolute top-3.5 right-3.5 w-4 h-4 rounded-md text-white text-[9px] flex items-center justify-center font-bold bg-red-500">
                    {a.badge}
                  </span>
                )}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${a.color}10` }}>
                  <Icon size={15} style={{ color: a.color }} />
                </div>
                <div className="flex items-center justify-between w-full">
                  <p className="text-xs font-bold tracking-wide text-slate-700">{a.label}</p>
                  <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-0.5 transition-transform group-hover:text-slate-900" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Clean Live Fulfillment Activity List */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs">
          <div className="px-4 py-3.5 flex items-center justify-between bg-slate-50/80 border-b border-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Live(Recent Orders)
            </p>
            <Link href="/admin/orders" className="text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-slate-700 transition-colors">
              All orders →
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {data.recentOrders.length === 0 ? (
              <div className="p-10 text-center">
                <ShoppingBag size={32} className="mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-medium text-slate-400">No recent order entries recorded</p>
              </div>
            ) : data.recentOrders.map(order => {
              const status = STATUS_CONFIG[order.order_status] || STATUS_CONFIG.pending
              const StatusIcon = status.icon
              return (
                <div key={order.id} className="px-4 py-3.5 flex items-center gap-3.5 hover:bg-slate-50/70 transition-colors">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: status.bg }}>
                    <StatusIcon size={14} style={{ color: status.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs sm:text-sm font-semibold truncate text-slate-900">{order.customer_name}</p>
                      <span className="text-[11px] font-mono font-medium flex-shrink-0 text-slate-400">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} ·{' '}
                      <span className="uppercase font-semibold text-slate-500">{order.payment_method === 'cod' ? 'COD' : 'Prepaid'}</span>
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-xs sm:text-sm text-slate-900">₹{Number(order.total_amount).toFixed(0)}</p>
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