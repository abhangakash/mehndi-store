'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Package, Phone, Mail, Search, MapPin,
  CheckCircle, Clock, Truck, XCircle,
  ArrowRight, ChevronDown, ChevronUp, ShoppingBag,
  Sparkles, ShieldCheck, Zap
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'

const STATUS = {
  pending:   { label: 'Order Placed',   icon: Clock,       color: '#d97706', bg: '#fef3c7', step: 0 },
  confirmed: { label: 'Confirmed',      icon: CheckCircle,   color: '#1d4ed8', bg: '#dbeafe', step: 1 },
  shipped:   { label: 'Out for Delivery', icon: Truck,      color: '#7c3aed', bg: '#ede9fe', step: 2 },
  delivered: { label: 'Delivered',      icon: CheckCircle,   color: '#15803d', bg: '#dcfce7', step: 3 },
  cancelled: { label: 'Cancelled',      icon: XCircle,       color: '#dc2626', bg: '#fee2e2', step: -1 },
}

const STEP_LABELS = ['Placed', 'Confirmed', 'Shipped', 'Delivered']

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false)
  const status = STATUS[order.order_status] || STATUS.pending
  const StatusIcon = status.icon
  const stepIdx = status.step
  const isCancelled = order.order_status === 'cancelled'

  return (
    <div className="bg-white rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 shadow-md border-2 border-black/5 transition-all duration-300 w-full relative">
      
      {/* Micro Floating Order Number Badge */}
      <div className="absolute -top-2.5 left-4 sm:left-6 text-[8px] sm:text-[10px] font-black tracking-widest px-2.5 py-0.5 sm:py-1 rounded-md shadow-sm bg-slate-200 text-slate-700 uppercase">
        Order #{order.id.slice(0, 8).toUpperCase()}
      </div>

      {/* Order Header / Cost Breakdown info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 sm:pt-1 pb-4 border-b border-gray-100">
        <div>
          <p className="font-black text-xl sm:text-2xl tracking-tight text-[#0a0f0d]">
            ₹{Number(order.total_amount).toFixed(0)}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">
            Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}
          </p>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-dashed border-gray-100">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider"
            style={{ backgroundColor: status.bg, color: status.color }}>
            <StatusIcon size={11} /> {status.label}
          </span>
          <button 
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-black flex items-center gap-1 uppercase tracking-wider text-[#93731e] hover:opacity-80 transition-opacity"
          >
            Details {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {/* Progress tracker — only for non-cancelled */}
      {!isCancelled && (
        <div className="py-5 border-b border-gray-100">
          <div className="relative flex items-center justify-between px-2">
            {/* Track line */}
            <div className="absolute left-0 right-0 top-3.5 h-0.5 z-0"
              style={{ backgroundColor: 'rgba(15,26,14,0.08)', margin: '0 24px' }}>
              <div className="h-full transition-all duration-700 rounded-full"
                style={{
                  width: stepIdx >= 0 ? `${(stepIdx / 3) * 100}%` : '0%',
                  background: 'linear-gradient(90deg, #93731e, #a48434)',
                }} />
            </div>

            {STEP_LABELS.map((label, i) => {
              const done = i <= stepIdx
              const current = i === stepIdx
              return (
                <div key={label} className="flex flex-col items-center gap-1.5 z-10 flex-1">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 text-[10px] font-black"
                    style={{
                      backgroundColor: done ? '#0a0f0d' : 'white',
                      color: done ? 'white' : 'rgba(15,26,14,0.25)',
                      border: `2px solid ${done ? '#0a0f0d' : 'rgba(15,26,14,0.1)'}`,
                      boxShadow: current ? '0 0 0 4px rgba(201,168,76,0.15)' : 'none',
                    }}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span className="text-center leading-none hidden sm:block mt-0.5"
                    style={{
                      fontSize: '9px',
                      fontWeight: done ? 900 : 600,
                      color: done ? '#0a0f0d' : 'rgba(15,26,14,0.4)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Micro-viewport step label fallback */}
          <div className="flex sm:hidden justify-between mt-2 px-1">
            {STEP_LABELS.map((label, i) => (
              <span key={label} className="text-[8px] font-black uppercase tracking-wide text-center flex-1"
                style={{ color: i <= stepIdx ? '#0a0f0d' : 'rgba(15,26,14,0.3)' }}>
                {label}
              </span>
            ))}
          </div>

          {/* Status micro-banner */}
          <div className="mt-4 px-3 py-2.5 rounded-xl text-[11px] font-bold text-center uppercase tracking-wide border border-black/5"
            style={{ backgroundColor: status.bg, color: status.color }}>
            {order.order_status === 'pending' && '⏳ Your order is being processed'}
            {order.order_status === 'confirmed' && '✅ Order confirmed — preparing to ship'}
            {order.order_status === 'shipped' && '🚚 On the way! Expected delivery in 2-3 days'}
            {order.order_status === 'delivered' && '🎉 Delivered! Thank you for shopping with us'}
          </div>
        </div>
      )}

      {/* Expanded details */}
      {expanded && (
        <div className="pt-4 flex flex-col gap-4 animate-fadeIn">
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

          {/* Help button */}
          <a href={`https://wa.me/919921297518?text=Hi! I need help with my order #${order.id.slice(0,8).toUpperCase()}`}
            target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all hover:opacity-95 shadow-sm"
            style={{ backgroundColor: '#25D366' }}>
            <Phone size={13} fill="currentColor" /> Need Help? WhatsApp Us
          </a>
        </div>
      )}
    </div>
  )
}

export default function TrackOrderPage() {
  const [searchType, setSearchType] = useState('phone')
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchValue.trim()) return toast.error(`Enter your ${searchType}`)
    setLoading(true)
    setOrders(null)
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq(searchType, searchValue.trim())
      .order('created_at', { ascending: false })
      .limit(10)
    if (error) {
      toast.error('Something went wrong. Please try again.')
    } else if (!data || data.length === 0) {
      setOrders([])
      toast.error('No orders found with this ' + searchType)
    } else {
      setOrders(data)
      toast.success(`Found ${data.length} order${data.length > 1 ? 's' : ''}`)
    }
    setSearched(true)
    setLoading(false)
  }

  return (
    <div className="bg-slate-50 min-h-screen text-[#0a0f0d] antialiased pb-12">

      {/* ===== HEADER ===== */}
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#93731e]/10 border border-[#93731e]/20 mb-3">
          <Sparkles size={12} className="text-[#93731e] animate-pulse" />
          <span className="text-[#0a0f0d] text-[10px] font-black tracking-[0.2em] uppercase">Order Tracking</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">
          TRACK YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#93731e] to-[#a48434]">ORDER</span>
        </h1>
        <p className="text-gray-500 text-xs md:text-sm mt-2 max-w-md mx-auto font-medium">
          Enter your checkout details below to access real-time delivery tracking status updates.
        </p>
      </div>

      {/* ===== SEARCH CARD GRID BOX ===== */}
      <div className="max-w-xl mx-auto px-4">
        <div className="bg-white rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 shadow-md border-2 border-black/5">
          <p className="text-[10px] font-black uppercase tracking-widest mb-3 text-gray-400">
            Search by Verification Channel
          </p>

          {/* Toggle buttons styled exactly like premium packs layout */}
          <div className="grid grid-cols-2 gap-2 mb-4 p-1 rounded-xl bg-slate-100">
            {[
              { key: 'phone', label: '📞 Phone Number' },
              { key: 'email', label: '✉️ Email Address' },
            ].map(t => (
              <button key={t.key}
                type="button"
                onClick={() => { setSearchType(t.key); setSearchValue(''); setOrders(null); setSearched(false) }}
                className="py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200"
                style={{
                  backgroundColor: searchType === t.key ? '#0a0f0d' : 'transparent',
                  color: searchType === t.key ? 'white' : 'rgba(10,15,13,0.4)',
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Input Field Elements */}
          <form onSubmit={handleSearch} className="flex flex-col gap-3">
            <div className="relative w-full">
              {searchType === 'phone'
                ? <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none select-none">
                    <Phone size={13} className="text-[#93731e]" />
                    <span className="text-xs font-black text-gray-300">+91</span>
                  </div>
                : <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#93731e]" />
              }
              <input
                type={searchType === 'email' ? 'email' : 'tel'}
                value={searchValue}
                onChange={e => setSearchValue(
                  searchType === 'phone'
                    ? e.target.value.replace(/\D/g, '').slice(0, 10)
                    : e.target.value
                )}
                placeholder={searchType === 'phone' ? 'Enter 10-Digit Mobile' : 'you@example.com'}
                className="w-full py-3.5 pr-4 rounded-xl text-xs font-bold outline-none border transition-all bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#93731e]/20"
                style={{
                  paddingLeft: searchType === 'phone' ? '4.2rem' : '2.8rem',
                  borderColor: 'rgba(15,26,14,0.08)',
                  color: '#0a0f0d',
                }}
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 transition-all active:scale-[0.99] bg-[#0a0f0d] hover:bg-[#141d1a] disabled:opacity-40 shadow-sm">
              {loading ? 'Searching Record...' : <><Search size={13} /> Fetch Live Status</>}
            </button>
          </form>

          <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-4">
            * Please use the matching credentials provided during checkout.
          </p>
        </div>

        {/* ===== LOGIN HISTORY NUDGE ===== */}
        <div className="mt-3">
          <Link href="/login"
            className="flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all bg-white border border-black/5 shadow-xs group">
            <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
              🔐 View dashboard order history
            </span>
            <ArrowRight size={13} className="text-[#93731e] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* ===== LIVE RESULTS CONTAINER ===== */}
        {searched && orders !== null && (
          <div className="mt-6 flex flex-col gap-4 w-full">
            {orders.length === 0 ? (
              <div className="rounded-2xl sm:rounded-[2rem] p-6 text-center bg-white border border-black/5 shadow-xs">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 bg-slate-50 border border-gray-100">
                  <ShoppingBag size={20} className="text-gray-300" />
                </div>
                <p className="font-black text-sm uppercase tracking-wide text-[#0a0f0d]">
                  No Orders Found
                </p>
                <p className="text-[11px] text-gray-400 font-medium mt-1 mb-4">
                  We couldn't locate active bookings matching that {searchType}.
                </p>
                <button
                  type="button"
                  onClick={() => { setSearchType(searchType === 'phone' ? 'email' : 'phone'); setSearchValue(''); setOrders(null); setSearched(false) }}
                  className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-[#0a0f0d] hover:bg-[#141d1a]"
                >
                  Use {searchType === 'phone' ? 'Email Address' : 'Phone Number'}
                </button>
              </div>
            ) : (
              <>
                <p className="text-[10px] font-black uppercase tracking-widest text-center text-gray-400">
                  Found {orders.length} Active Shipment{orders.length > 1 ? 's' : ''}
                </p>
                {orders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* ===== MINI TRUST BAR ===== */}
      <div className="max-w-xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-black/5 shadow-xs">
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
  )
}