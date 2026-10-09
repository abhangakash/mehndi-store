'use client'
import { useState, useEffect } from 'react'
import TrackingTimeline from '@/components/TrackingTimeline'
import {
  Package, Phone, Mail, Search, MapPin, Hash,
  CheckCircle, Clock, Truck, XCircle,
  ArrowRight, ChevronDown, ChevronUp, ShoppingBag,
  Sparkles, ShieldCheck, Zap
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'

const STEPS = ['Ordered', 'Shipped', 'In transit', 'Delivered']

function getProgress(order) {
  const s = order.order_status
  const t = order.tracking?.status
  const latest = order.tracking?.events?.[0]?.detail

  if (s === 'cancelled') return { step: -1, title: 'Cancelled', note: 'This order has been cancelled.', color: '#b91c1c' }
  if (s === 'delivered' || t === 'delivered') return { step: 3, title: 'Delivered', note: 'Your order has been delivered.', color: '#15803d' }
  if (s === 'shipped') {
    const moving = ['in_transit', 'out_for_delivery', 'available_for_pickup', 'failed_attempt', 'exception'].includes(t)
    const hasScans = (order.tracking?.events?.length || 0) > 0 && t !== 'info_received'
    if (t === 'out_for_delivery') return { step: 2, title: 'Out for delivery', note: 'Your order is with the delivery staff and should reach you today.', color: '#0a0f0d' }
    if (t === 'available_for_pickup') return { step: 2, title: 'Ready for pickup', note: 'Your order is waiting at your local post office.', color: '#0a0f0d' }
    if (t === 'failed_attempt') return { step: 2, title: 'Delivery attempted', note: 'India Post could not deliver on the last attempt. They will try again.', color: '#b45309' }
    if (t === 'exception') return { step: 2, title: 'Shipment update', note: 'India Post reported an issue with this shipment.', color: '#b45309' }
    if (moving || hasScans) return { step: 2, title: 'In transit', note: latest || 'Your order is on its way to you.', color: '#0a0f0d' }
    return { step: 1, title: 'Shipped', note: 'Your order has been handed over to India Post. It usually arrives in 3–7 business days.', color: '#0a0f0d' }
  }
  if (s === 'confirmed') return { step: 0, title: 'Preparing your order', note: 'Your order is confirmed and is being packed.', color: '#0a0f0d' }
  return { step: 0, title: 'Order placed', note: 'We have received your order.', color: '#0a0f0d' }
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false)
  const p = getProgress(order)
  const isCancelled = p.step < 0
  const accent = p.step === 3 ? '#15803d' : '#0a0f0d'
  const shortId = order.id.slice(0, 8).toUpperCase()

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/10 w-full transition-all">

      {/* Order summary band */}
      <div className="grid grid-cols-3 gap-3 px-5 py-3.5 bg-slate-50 border-b border-black/5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Order placed</p>
          <p className="text-xs font-bold text-[#0a0f0d] mt-0.5">
            {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total</p>
          <p className="text-xs font-bold text-[#0a0f0d] mt-0.5">₹{Number(order.total_amount).toFixed(0)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Order #</p>
          <p className="text-xs font-bold font-mono text-[#0a0f0d] mt-0.5">{shortId}</p>
        </div>
      </div>

      {/* Status headline and progress */}
      <div className="px-5 pt-5 pb-6">
        <h3 className="text-lg font-black tracking-tight" style={{ color: p.color }}>{p.title}</h3>
        <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">{p.note}</p>

        {!isCancelled && (
          <div className="relative flex items-start justify-between mt-6">
            <div className="absolute left-[12.5%] right-[12.5%] top-[10px] h-[3px] rounded-full bg-slate-100">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(p.step / 3) * 100}%`, backgroundColor: p.step === 3 ? '#15803d' : '#93731e' }} />
            </div>
            {STEPS.map((label, i) => {
              const done = i <= p.step
              return (
                <div key={label} className="relative flex-1 flex flex-col items-center gap-2">
                  <div className="w-[23px] h-[23px] rounded-full flex items-center justify-center text-[10px] font-black"
                    style={{
                      backgroundColor: done ? accent : '#ffffff',
                      color: '#ffffff',
                      border: `2px solid ${done ? accent : '#e2e8f0'}`,
                    }}>
                    {done ? '✓' : ''}
                  </div>
                  <span className="text-[10px] text-center leading-tight font-semibold"
                    style={{ color: done ? '#0a0f0d' : '#94a3b8' }}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Shipment updates (carrier scans) */}
      {order.tracking_number && !isCancelled && <TrackingTimeline order={order} />}

      {/* Details toggle */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1.5 py-3.5 border-t border-gray-100 text-xs font-bold text-[#93731e] hover:bg-slate-50 transition-colors"
      >
        {expanded ? 'Hide order details' : 'View order details'}
        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-5 pt-4 border-t border-gray-100 flex flex-col gap-4">
          {/* Items */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-gray-400">Items Ordered</p>
            <div className="flex flex-col gap-2">
              {order.order_items?.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-black/5">
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center bg-white border border-gray-100">
                    {item.product_image
                      ? <Image src={item.product_image} alt={item.product_name}
                          width={40} height={40} className="object-cover w-full h-full" />
                      : <span className="text-lg">🌿</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black tracking-tight text-[#0a0f0d] truncate">
                      {item.product_name}
                    </p>
                    <p className="text-[11px] text-gray-400 font-bold uppercase mt-0.5">
                      Qty: {item.quantity} × ₹{Number(item.unit_price).toFixed(0)}
                    </p>
                  </div>
                  <p className="font-black text-xs flex-shrink-0 text-[#93731e]">
                    ₹{Number(item.total_price).toFixed(0)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="rounded-xl p-3 bg-slate-50 border border-black/5">
            <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">
              <span>Subtotal</span>
              <span className="text-gray-700">₹{Number(order.subtotal).toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">
              <span>Shipping</span>
              <span style={{ color: order.shipping_amount == 0 ? '#15803d' : '#374151' }}>
                {order.shipping_amount == 0 ? 'FREE' : `₹${order.shipping_amount}`}
              </span>
            </div>
            <div className="flex justify-between font-black text-xs border-t border-gray-200/60 pt-2 text-[#0a0f0d] uppercase tracking-wide">
              <span>Total Amount</span>
              <span className="text-[#93731e] text-sm">₹{Number(order.total_amount).toFixed(0)}</span>
            </div>
          </div>

          {/* Delivery address */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-black/5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-[#93731e]/10 border border-[#93731e]/20">
              <MapPin size={13} className="text-[#93731e]" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Delivery Address</p>
              <p className="text-xs font-black text-[#0a0f0d]">
                {order.customer_name}
              </p>
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed mt-0.5 break-words">
                {order.address}, {order.city}, {order.state} — {order.pincode}
              </p>
              <p className="text-[11px] font-bold text-gray-400 uppercase mt-1">
                📞 {order.phone}
              </p>
            </div>
          </div>

          {/* Payment info */}
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide px-3 py-2.5 rounded-xl bg-slate-50 border border-black/5">
            <span className="text-gray-400">Payment Method</span>
            <span className="font-black text-[#0a0f0d]">
              {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Paid Online'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TrackOrderPage() {
  const [searchType, setSearchType] = useState('contact')
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState(null)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    const o = new URLSearchParams(window.location.search).get('order')
    if (o && /^[0-9a-fA-F]{8}$/.test(o.trim())) {
      const v = o.trim().toUpperCase()
      setSearchType('order_id')
      setSearchValue(v)
      runSearch('order_id', v)
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    runSearch(searchType, searchValue)
  }

  const runSearch = async (tab, raw) => {
    const value = (raw || '').trim()
    let type = tab
    let query = value

    if (tab === 'contact') {
      if (value.includes('@')) {
        type = 'email'
      } else {
        const digits = value.replace(/\D/g, '')
        const ten = digits.length > 10 && digits.startsWith('91') ? digits.slice(-10) : digits
        if (ten.length !== 10) {
          return toast.error('Enter a valid 10-digit mobile number or email address')
        }
        type = 'phone'
        query = ten
      }
    } else if (!/^#?[0-9a-fA-F]{8}$/.test(value)) {
      return toast.error('Order ID has 8 characters, for example A1B2C3D4')
    }

    setLoading(true)
    setOrders(null)
    let data = null, error = null
    try {
      const res = await fetch('/api/track-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, value: query }),
      })
      const json = await res.json()
      if (!res.ok) error = json.error || 'error'
      else data = json.orders
    } catch (err) {
      error = err.message
    }
    if (error) {
      toast.error(typeof error === 'string' && error.startsWith('Invalid') ? error : 'Something went wrong. Please try again.')
    } else if (!data || data.length === 0) {
      setOrders([])
      toast.error('No order found')
    } else {
      setOrders(data)
    }
    setSearched(true)
    setLoading(false)
  }

  return (
    <div className="bg-slate-50 min-h-screen text-[#0a0f0d] antialiased pb-16 pt-8">
      <div className="max-w-xl mx-auto px-4">

        {/* ===== HEADER ===== */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
            Track Your <span className="text-[#93731e]">Order</span>
          </h1>
          <p className="text-gray-500 text-xs mt-1.5 font-medium">
            Look up your active shipment status instantly.
          </p>
        </div>

        {/* ===== SEARCH CARD ===== */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-black/10">
          
          {/* Toggle buttons: Mobile / Email on left, Order ID on right */}
          <div className="grid grid-cols-2 gap-2 mb-4 p-1 rounded-xl bg-slate-100">
            {[
              { key: 'contact', label: 'Mobile / Email' },
              { key: 'order_id', label: 'Order ID' },
            ].map(t => (
              <button key={t.key}
                type="button"
                onClick={() => { setSearchType(t.key); setSearchValue(''); setOrders(null); setSearched(false) }}
                className="py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200"
                style={{
                  backgroundColor: searchType === t.key ? '#0a0f0d' : 'transparent',
                  color: searchType === t.key ? 'white' : 'rgba(10,15,13,0.5)',
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSearch} className="flex flex-col gap-3">
            <div className="relative w-full">
              {searchType === 'order_id'
                ? <Hash size={14} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#93731e]" />
                : <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#93731e]" />
              }
              <input
                type="text"
                autoComplete="off"
                value={searchValue}
                onChange={e => setSearchValue(
                  searchType === 'order_id'
                    ? e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 8).toUpperCase()
                    : e.target.value
                )}
                placeholder={searchType === 'order_id' ? 'Order ID, e.g. A1B2C3D4' : 'Mobile number or email address'}
                className="w-full py-3 pr-4 rounded-xl text-xs font-bold outline-none border transition-all bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#93731e]/20"
                style={{
                  paddingLeft: '2.8rem',
                  borderColor: 'rgba(15,26,14,0.08)',
                  color: '#0a0f0d',
                }}
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 transition-all active:scale-[0.99] bg-[#0a0f0d] hover:bg-[#141d1a] disabled:opacity-40 shadow-sm">
              {loading ? 'Searching...' : <><Search size={13} /> Track order</>}
            </button>
          </form>
        </div>

        {/* ===== LOGIN HISTORY NUDGE ===== */}
        <div className="mt-3">
          <Link href="/login"
            className="flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all bg-white border border-black/10 shadow-xs group">
            <span className="text-gray-500 group-hover:text-gray-700 transition-colors">
              🔐 View dashboard order history
            </span>
            <ArrowRight size={13} className="text-[#93731e] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* ===== LIVE RESULTS CONTAINER ===== */}
        {searched && orders !== null && (
          <div className="mt-5 flex flex-col gap-4 w-full">
            {orders.length === 0 ? (
              <div className="rounded-2xl p-6 text-center bg-white border border-black/10 shadow-xs">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 bg-slate-50 border border-gray-100">
                  <ShoppingBag size={20} className="text-gray-300" />
                </div>
                <p className="font-black text-sm uppercase tracking-wide text-[#0a0f0d]">
                  No order found
                </p>
                <p className="text-[11px] text-gray-400 font-medium mt-1 mb-4">
                  We could not find an order with those details. Please check them and try again.
                </p>
                <button
                  type="button"
                  onClick={() => { setSearchType(searchType === 'contact' ? 'order_id' : 'contact'); setSearchValue(''); setOrders(null); setSearched(false) }}
                  className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-[#0a0f0d] hover:bg-[#141d1a]"
                >
                  Search by {searchType === 'contact' ? 'Order ID' : 'mobile or email'} instead
                </button>
              </div>
            ) : (
              <>
                <p className="text-[10px] font-black uppercase tracking-widest text-center text-gray-400">
                  {orders.length} order{orders.length > 1 ? 's' : ''} found
                </p>
                {orders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </>
            )}
          </div>
        )}

        {/* ===== MINI TRUST BAR ===== */}
        <div className="mt-5">
          <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-black/10 shadow-xs">
            <div className="flex items-center gap-2 px-1">
              <ShieldCheck size={16} className="text-[#93731e] shrink-0" />
              <span className="text-[10px] font-black tracking-tight text-gray-700 uppercase">100% Ayurvedic Purity</span>
            </div>
            <div className="flex items-center gap-2 px-1 border-l border-gray-100">
              <Zap size={16} className="text-[#93731e] shrink-0" />
              <span className="text-[10px] font-black tracking-tight text-gray-700 uppercase">Fast Delivery India</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}