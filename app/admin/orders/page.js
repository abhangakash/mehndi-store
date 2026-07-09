'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Clock, CheckCircle, Truck, XCircle, Package,
  Search, ChevronDown, Phone, Mail, MapPin,
  RefreshCw, Send, Download, X, ExternalLink, AlertTriangle
} from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#b45309', bg: '#fef3c7', icon: Clock },
  confirmed: { label: 'Confirmed', color: '#1d4ed8', bg: '#dbeafe', icon: CheckCircle },
  shipped:   { label: 'Shipped',   color: '#6d28d9', bg: '#ede9fe', icon: Truck },
  delivered: { label: 'Delivered', color: '#047857', bg: '#dcfce7', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: '#b91c1c', bg: '#fee2e2', icon: XCircle },
}

function ShiprocketBadge({ order, onPush, pushing }) {
  const hasShipment = !!order.shiprocket_order_id

  if (hasShipment) {
    return (
      <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-teal-200 bg-teal-50 text-teal-700">
        <Truck size={11} /> Shiprocket #{order.shiprocket_order_id}
        {order.shiprocket_status && (
          <span className="opacity-60 font-medium normal-case">· {order.shiprocket_status}</span>
        )}
      </span>
    )
  }

  return (
    <button onClick={() => onPush(order)} disabled={pushing}
      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors disabled:opacity-50">
      <AlertTriangle size={11} /> {pushing ? 'Pushing...' : 'Not on Shiprocket — Push'}
    </button>
  )
}

function OrderRow({ order, onStatusChange, onSendEmail, onPushShiprocket, pushingId }) {
  const [expanded, setExpanded] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(order.order_status || 'pending')

  const status = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.pending
  const StatusIcon = status.icon
  const isPushing = pushingId === order.id

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) return
    setUpdating(true)
    const success = await onStatusChange(order.id, newStatus)
    if (success) setCurrentStatus(newStatus)
    setUpdating(false)
  }

  return (
    <div className="rounded-2xl overflow-hidden mb-3 bg-white border border-slate-200/80 shadow-xs">
      <div className="p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: status.bg }}>
          <StatusIcon size={16} style={{ color: status.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p className="font-bold text-sm text-slate-900">{order.customer_name}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                #{order.id.slice(0, 8).toUpperCase()} ·{' '}
                {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-base text-emerald-700">
                ₹{Number(order.total_amount).toFixed(0)}
              </p>
              <p className="text-xs text-slate-400">
                {order.payment_method === 'cod' ? 'COD' : 'Online'} · {order.payment_status}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-xs text-slate-500">
            <a href={`tel:${order.phone}`} className="flex items-center gap-1 hover:text-emerald-700 transition-colors">
              <Phone size={11} /> {order.phone}
            </a>
            {order.email && (
              <a href={`mailto:${order.email}`} className="flex items-center gap-1 hover:text-emerald-700 transition-colors">
                <Mail size={11} /> {order.email}
              </a>
            )}
            <span className="flex items-center gap-1">
              <MapPin size={11} /> {order.city}, {order.state}
            </span>
          </div>

          {/* Action bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {/* STATUS DROPDOWN */}
            <div className="relative">
              <select
                value={currentStatus}
                onChange={e => handleStatusChange(e.target.value)}
                disabled={updating}
                className="text-xs font-bold uppercase pr-7 pl-3 py-1.5 rounded-xl appearance-none cursor-pointer border bg-white focus:outline-none"
                style={{
                  backgroundColor: status.bg,
                  color: status.color,
                  borderColor: `${status.color}30`,
                  opacity: updating ? 0.6 : 1,
                }}>
                {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                  <option key={key} value={key} className="bg-white text-slate-800 normal-case font-medium">{val.label}</option>
                ))}
              </select>
              <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: status.color }} />
              {updating && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl"
                  style={{ backgroundColor: status.bg }}>
                  <div className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: status.color }} />
                </div>
              )}
            </div>

            <button onClick={() => onSendEmail(order.id, 'shipped')}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors">
              <Send size={11} /> Shipped Email
            </button>

            <a href={`https://wa.me/91${order.phone}?text=Hi ${order.customer_name}! Your order %23${order.id.slice(0,8).toUpperCase()} from Crabveda Pain Relief Oil is now ${currentStatus}. 🌿`}
              target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors">
              <Phone size={11} /> WhatsApp
            </a>

            <a href={`/api/send-invoice?orderId=${order.id}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
              <Download size={11} /> Invoice
            </a>

            <ShiprocketBadge order={order} onPush={onPushShiprocket} pushing={isPushing} />

            <button onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs font-bold ml-auto text-emerald-700 hover:text-emerald-800 transition-colors">
              {expanded ? 'Hide' : 'Details'}
              <ChevronDown size={12} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-100 bg-slate-50/50">
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Items</p>
              {order.order_items?.map(item => (
                <div key={item.id} className="flex justify-between text-xs py-1">
                  <span className="text-slate-700">{item.product_name} × {item.quantity}</span>
                  <span className="font-bold text-slate-900">₹{Number(item.total_price).toFixed(0)}</span>
                </div>
              ))}
              <div className="border-t border-slate-200 mt-1.5 pt-1.5 flex justify-between text-xs font-bold text-slate-900">
                <span>Total</span>
                <span className="text-emerald-700">₹{Number(order.total_amount).toFixed(0)}</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Shipping Destination</p>
              <p className="text-xs leading-relaxed text-slate-600">
                <span className="font-semibold text-slate-800">{order.customer_name}</span><br />
                {order.address}<br />
                {order.city}, {order.state} — <span className="font-mono">{order.pincode}</span><br />
                📞 {order.phone}
                {order.email && <><br />✉️ {order.email}</>}
              </p>
            </div>
          </div>

          {/* Shiprocket details block */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Shiprocket</p>
            {order.shiprocket_order_id ? (
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-600">
                <span>Order ID: <span className="font-mono font-semibold text-slate-800">{order.shiprocket_order_id}</span></span>
                {order.shiprocket_shipment_id && (
                  <span>Shipment ID: <span className="font-mono font-semibold text-slate-800">{order.shiprocket_shipment_id}</span></span>
                )}
                {order.shiprocket_status && (
                  <span>Status: <span className="font-semibold text-slate-800">{order.shiprocket_status}</span></span>
                )}
                <a href="https://app.shiprocket.in/seller/orders/new" target="_blank" rel="noreferrer"
                  className="flex items-center gap-1 font-bold text-teal-700 hover:text-teal-800">
                  Open in Shiprocket <ExternalLink size={11} />
                </a>
              </div>
            ) : (
              <p className="text-xs text-amber-700 font-medium">
                Not yet pushed to Shiprocket. Use the button above to push manually.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pushingId, setPushingId] = useState(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
      .limit(100)
    if (statusFilter !== 'all') query = query.eq('order_status', statusFilter)
    const { data, error } = await query
    if (error) toast.error('Failed to load orders')
    else setOrders(data || [])
    setLoading(false)
  }, [statusFilter])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch('/api/update-order-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      })
      const { success, error } = await res.json()
      if (!success || error) {
        toast.error('Failed to update: ' + (error || 'Unknown error'))
        return false
      }
      toast.success(`Order marked as ${newStatus}`)
      return true
    } catch (err) {
      toast.error('Update failed — ' + err.message)
      return false
    }
  }

  const handleSendEmail = async (orderId, type) => {
    try {
      const res = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, orderId }),
      })
      const { success, error, skipped } = await res.json()
      if (skipped) toast.error('No email on this order')
      else if (error) toast.error('Email failed: ' + error)
      else toast.success('Email sent!')
    } catch { toast.error('Email failed') }
  }

  const handlePushShiprocket = async (order) => {
    setPushingId(order.id)
    try {
      const res = await fetch('/api/notify-shiprocket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order, items: order.order_items || [] }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        toast.error('Shiprocket push failed: ' + (data.error || 'Unknown error'))
      } else {
        toast.success('Pushed to Shiprocket!')
        fetchOrders()
      }
    } catch (err) {
      toast.error('Shiprocket push failed — ' + err.message)
    }
    setPushingId(null)
  }

  const filtered = orders.filter(o => {
    if (!search) return true
    const s = search.toLowerCase()
    return (
      o.customer_name?.toLowerCase().includes(s) ||
      o.phone?.includes(s) ||
      o.email?.toLowerCase().includes(s) ||
      o.id?.slice(0, 8).toLowerCase().includes(s)
    )
  })

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = s === 'all' ? orders.length : orders.filter(o => o.order_status === s).length
    return acc
  }, {})

  return (
    <div className="px-4 sm:px-6 py-8 max-w-5xl mx-auto relative z-10">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Order Registers</h1>
          <p className="text-xs font-semibold uppercase tracking-wider mt-1 text-slate-400">
            {filtered.length} listings retrieved
          </p>
        </div>
        <button onClick={fetchOrders}
          className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by customer details, contact profile, or token ID..."
          className="w-full pl-10 pr-10 py-3 rounded-xl text-sm bg-white border border-slate-200 outline-none focus:border-emerald-600/40 focus:ring-1 focus:ring-emerald-600/10 text-slate-800 placeholder-slate-400 shadow-xs" />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {STATUS_OPTIONS.map(s => {
          const config = STATUS_CONFIG[s]
          const isSelected = statusFilter === s
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all border shadow-xs"
              style={{
                backgroundColor: isSelected ? (config?.bg || '#dcfce7') : '#ffffff',
                color: isSelected ? (config?.color || '#047857') : '#64748b',
                borderColor: isSelected ? 'transparent' : '#e2e8f0',
              }}>
              {s === 'all' ? 'All Ledger' : config?.label}
              {counts[s] > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold"
                  style={{
                    backgroundColor: isSelected ? 'rgba(0,0,0,0.06)' : '#f1f5f9',
                    color: isSelected ? 'inherit' : '#475569',
                  }}>
                  {counts[s]}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="text-center py-24">
          <div className="w-9 h-9 border-2 border-slate-200 border-t-emerald-700 rounded-full animate-spin mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl p-16 text-center bg-white border border-slate-200 shadow-sm">
          <Package size={40} className="mx-auto mb-3 text-slate-300" />
          <p className="font-bold text-sm text-slate-700">No order matches found</p>
          <p className="text-xs text-slate-400 mt-1">Try expanding your tab context or adjusting search text parameters.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map(order => (
            <OrderRow key={order.id} order={order}
              onStatusChange={handleStatusChange}
              onSendEmail={handleSendEmail}
              onPushShiprocket={handlePushShiprocket}
              pushingId={pushingId} />
          ))}
        </div>
      )}
    </div>
  )
}