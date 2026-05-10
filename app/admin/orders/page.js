'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Clock, CheckCircle, Truck, XCircle, Package,
  Search, ChevronDown, Phone, Mail, MapPin,
  RefreshCw, Send, Download, X
} from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#d97706', bg: '#fef3c7', icon: Clock },
  confirmed: { label: 'Confirmed', color: '#1d4ed8', bg: '#dbeafe', icon: CheckCircle },
  shipped:   { label: 'Shipped',   color: '#7c3aed', bg: '#ede9fe', icon: Truck },
  delivered: { label: 'Delivered', color: '#15803d', bg: '#dcfce7', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: '#dc2626', bg: '#fee2e2', icon: XCircle },
}

function OrderRow({ order, onStatusChange, onSendEmail }) {
  const [expanded, setExpanded] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(order.order_status || 'pending')

  const status = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.pending
  const StatusIcon = status.icon

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) return
    setUpdating(true)
    const success = await onStatusChange(order.id, newStatus)
    if (success) setCurrentStatus(newStatus)
    setUpdating(false)
  }

  return (
    <div className="rounded-2xl overflow-hidden mb-3"
      style={{ backgroundColor: '#fcfaf6', border: '1.5px solid rgba(15,26,14,0.06)' }}>
      <div className="p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: status.bg }}>
          <StatusIcon size={16} style={{ color: status.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p className="font-black text-sm" style={{ color: '#0f1a0e' }}>{order.customer_name}</p>
              <p className="text-xs" style={{ color: 'rgba(15,26,14,0.4)' }}>
                #{order.id.slice(0, 8).toUpperCase()} ·{' '}
                {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-black text-base" style={{ color: '#c9a84c' }}>
                ₹{Number(order.total_amount).toFixed(0)}
              </p>
              <p className="text-xs" style={{ color: 'rgba(15,26,14,0.4)' }}>
                {order.payment_method === 'cod' ? 'COD' : 'Online'} · {order.payment_status}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-3 text-xs" style={{ color: 'rgba(15,26,14,0.5)' }}>
            <a href={`tel:${order.phone}`} className="flex items-center gap-1">
              <Phone size={11} /> {order.phone}
            </a>
            {order.email && (
              <a href={`mailto:${order.email}`} className="flex items-center gap-1">
                <Mail size={11} /> {order.email}
              </a>
            )}
            <span className="flex items-center gap-1">
              <MapPin size={11} /> {order.city}, {order.state}
            </span>
          </div>

          {/* Action bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* STATUS DROPDOWN — now calls API */}
            <div className="relative">
              <select
                value={currentStatus}
                onChange={e => handleStatusChange(e.target.value)}
                disabled={updating}
                className="text-xs font-black uppercase pr-6 pl-3 py-1.5 rounded-xl appearance-none cursor-pointer border-0"
                style={{
                  backgroundColor: status.bg,
                  color: status.color,
                  border: `1.5px solid ${status.color}40`,
                  opacity: updating ? 0.6 : 1,
                }}>
                {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
              <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
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
              className="flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl hover:bg-blue-50 transition-colors"
              style={{ color: '#1d4ed8', border: '1.5px solid rgba(29,78,216,0.2)' }}>
              <Send size={11} /> Shipped Email
            </button>

            <a href={`https://wa.me/91${order.phone}?text=Hi ${order.customer_name}! Your order %23${order.id.slice(0,8).toUpperCase()} from Shrilekha Mehndi Art is now ${currentStatus}. 🌿`}
              target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl hover:bg-green-50 transition-colors"
              style={{ color: '#15803d', border: '1.5px solid rgba(21,128,61,0.2)' }}>
              <Phone size={11} /> WhatsApp
            </a>

            <a href={`/api/send-invoice?orderId=${order.id}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
              style={{ color: 'rgba(15,26,14,0.5)', border: '1.5px solid rgba(15,26,14,0.1)' }}>
              <Download size={11} /> Invoice
            </a>

            <button onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs font-bold ml-auto"
              style={{ color: '#c9a84c' }}>
              {expanded ? 'Hide' : 'Details'}
              <ChevronDown size={11} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t" style={{ borderColor: 'rgba(15,26,14,0.06)' }}>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'rgba(15,26,14,0.4)' }}>Items</p>
              {order.order_items?.map(item => (
                <div key={item.id} className="flex justify-between text-xs py-0.5">
                  <span style={{ color: '#0f1a0e' }}>{item.product_name} × {item.quantity}</span>
                  <span className="font-black" style={{ color: '#c9a84c' }}>₹{Number(item.total_price).toFixed(0)}</span>
                </div>
              ))}
              <div className="border-t mt-1.5 pt-1.5 flex justify-between text-xs font-black"
                style={{ borderColor: 'rgba(15,26,14,0.06)' }}>
                <span>Total</span>
                <span style={{ color: '#c9a84c' }}>₹{Number(order.total_amount).toFixed(0)}</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'rgba(15,26,14,0.4)' }}>Address</p>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(15,26,14,0.6)' }}>
                {order.customer_name}<br />
                {order.address}<br />
                {order.city}, {order.state} — {order.pincode}<br />
                📞 {order.phone}
                {order.email && <><br />✉️ {order.email}</>}
              </p>
              {order.booking_date && (
                <p className="text-xs mt-2 font-bold" style={{ color: '#d97706' }}>
                  📅 Preferred: {new Date(order.booking_date).toLocaleDateString('en-IN')}
                </p>
              )}
            </div>
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

  // Uses API route — actually saves to DB
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
    <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-white">Orders</h1>
          <p className="text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color: 'rgba(201,168,76,0.6)' }}>
            {filtered.length} orders shown
          </p>
        </div>
        <button onClick={fetchOrders}
          className="p-2.5 rounded-xl hover:bg-white/10 transition-colors"
          style={{ color: 'rgba(255,255,255,0.4)' }}>
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: 'rgba(255,255,255,0.3)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, phone, email or order ID..."
          className="w-full pl-10 pr-10 py-3 rounded-xl text-sm text-white outline-none"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.08)' }} />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
          </button>
        )}
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
        {STATUS_OPTIONS.map(s => {
          const config = STATUS_CONFIG[s]
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-all"
              style={{
                backgroundColor: statusFilter === s ? (config?.bg || '#c9a84c') : 'rgba(255,255,255,0.06)',
                color: statusFilter === s ? (config?.color || '#0f1a0e') : 'rgba(255,255,255,0.4)',
              }}>
              {s === 'all' ? 'All' : config?.label}
              {counts[s] > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full font-black"
                  style={{
                    backgroundColor: statusFilter === s ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.1)',
                    fontSize: '9px',
                  }}>
                  {counts[s]}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto border-[#c9a84c]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: '#fcfaf6' }}>
          <Package size={40} className="mx-auto mb-3" style={{ color: 'rgba(15,26,14,0.15)' }} />
          <p className="font-black text-sm" style={{ color: '#0f1a0e' }}>No orders found</p>
        </div>
      ) : filtered.map(order => (
        <OrderRow key={order.id} order={order}
          onStatusChange={handleStatusChange}
          onSendEmail={handleSendEmail} />
      ))}
    </div>
  )
}
