'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Package, Phone, Mail, Search, MapPin,
  CheckCircle, Clock, Truck, XCircle,
  ArrowRight, ChevronDown, ChevronUp, ShoppingBag
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'

const STEPS = ['pending', 'confirmed', 'shipped', 'delivered']

const STATUS = {
  pending:   { label: 'Order Placed',  icon: Clock,         color: '#d97706', bg: '#fef3c7', step: 0 },
  confirmed: { label: 'Confirmed',     icon: CheckCircle,   color: '#1d4ed8', bg: '#dbeafe', step: 1 },
  shipped:   { label: 'Out for Delivery', icon: Truck,      color: '#7c3aed', bg: '#ede9fe', step: 2 },
  delivered: { label: 'Delivered',     icon: CheckCircle,   color: '#15803d', bg: '#dcfce7', step: 3 },
  cancelled: { label: 'Cancelled',     icon: XCircle,       color: '#dc2626', bg: '#fee2e2', step: -1 },
}

const STEP_LABELS = ['Placed', 'Confirmed', 'Shipped', 'Delivered']

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false)
  const status = STATUS[order.order_status] || STATUS.pending
  const StatusIcon = status.icon
  const stepIdx = status.step
  const isCancelled = order.order_status === 'cancelled'

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm"
      style={{ backgroundColor: '#fcfaf6', border: '1.5px solid rgba(15,26,14,0.08)' }}>

      {/* Order header */}
      <div className="px-4 py-4 flex items-start justify-between gap-3"
        style={{ borderBottom: '1px solid rgba(15,26,14,0.06)' }}>
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: status.bg }}>
            <StatusIcon size={18} style={{ color: status.color }} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-wider"
              style={{ color: 'rgba(15,26,14,0.4)' }}>
              Order #{order.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="font-black text-base mt-0.5" style={{ color: '#0f1a0e' }}>
              ₹{Number(order.total_amount).toFixed(0)}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(15,26,14,0.4)' }}>
              {new Date(order.created_at).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wide"
            style={{ backgroundColor: status.bg, color: status.color }}>
            <StatusIcon size={11} /> {status.label}
          </span>
          <button onClick={() => setExpanded(!expanded)}
            className="text-xs font-bold flex items-center gap-1 uppercase tracking-wide"
            style={{ color: '#c9a84c' }}>
            Details {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {/* Progress tracker — only for non-cancelled */}
      {!isCancelled && (
        <div className="px-4 py-5" style={{ borderBottom: '1px solid rgba(15,26,14,0.06)' }}>
          <div className="relative flex items-center justify-between">
            {/* Track line */}
            <div className="absolute left-0 right-0 top-4 h-0.5 z-0"
              style={{ backgroundColor: 'rgba(15,26,14,0.08)', margin: '0 16px' }}>
              <div className="h-full transition-all duration-700 rounded-full"
                style={{
                  width: stepIdx >= 0 ? `${(stepIdx / 3) * 100}%` : '0%',
                  background: 'linear-gradient(90deg, #0f1a0e, #3a5a40)',
                }} />
            </div>

            {STEP_LABELS.map((label, i) => {
              const done = i <= stepIdx
              const current = i === stepIdx
              return (
                <div key={label} className="flex flex-col items-center gap-1.5 z-10 flex-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 text-xs font-black"
                    style={{
                      backgroundColor: done ? '#0f1a0e' : 'white',
                      color: done ? 'white' : 'rgba(15,26,14,0.25)',
                      border: `2px solid ${done ? '#0f1a0e' : 'rgba(15,26,14,0.1)'}`,
                      boxShadow: current ? '0 0 0 4px rgba(15,26,14,0.1)' : 'none',
                    }}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span className="text-center leading-tight"
                    style={{
                      fontSize: '9px',
                      fontWeight: done ? 800 : 500,
                      color: done ? '#0f1a0e' : 'rgba(15,26,14,0.3)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Status message */}
          <div className="mt-4 px-3 py-2.5 rounded-xl text-xs font-bold text-center uppercase tracking-wide"
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
        <div className="px-4 py-4 flex flex-col gap-4">
          {/* Items */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-2"
              style={{ color: 'rgba(15,26,14,0.4)' }}>Items Ordered</p>
            <div className="flex flex-col gap-2">
              {order.order_items?.map(item => (
                <div key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: 'rgba(15,26,14,0.03)' }}>
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(15,26,14,0.05)' }}>
                    {item.product_image
                      ? <Image src={item.product_image} alt={item.product_name}
                          width={40} height={40} className="object-cover w-full h-full" />
                      : <span className="text-lg">🌿</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: '#0f1a0e' }}>
                      {item.product_name}
                    </p>
                    <p className="text-xs" style={{ color: 'rgba(15,26,14,0.4)' }}>
                      Qty: {item.quantity} × ₹{Number(item.unit_price).toFixed(0)}
                    </p>
                  </div>
                  <p className="font-black text-sm flex-shrink-0" style={{ color: '#c9a84c' }}>
                    ₹{Number(item.total_price).toFixed(0)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="rounded-xl p-3" style={{ backgroundColor: 'rgba(15,26,14,0.03)' }}>
            <div className="flex justify-between text-xs mb-1.5" style={{ color: 'rgba(15,26,14,0.5)' }}>
              <span>Subtotal</span>
              <span>₹{Number(order.subtotal).toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-xs mb-2" style={{ color: 'rgba(15,26,14,0.5)' }}>
              <span>Shipping</span>
              <span style={{ color: order.shipping_amount == 0 ? '#15803d' : undefined }}>
                {order.shipping_amount == 0 ? 'FREE' : `₹${order.shipping_amount}`}
              </span>
            </div>
            <div className="flex justify-between font-black text-sm border-t pt-2"
              style={{ borderColor: 'rgba(15,26,14,0.08)', color: '#0f1a0e' }}>
              <span>Total</span>
              <span style={{ color: '#c9a84c' }}>₹{Number(order.total_amount).toFixed(0)}</span>
            </div>
          </div>

          {/* Delivery address */}
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: 'rgba(201,168,76,0.1)' }}>
              <MapPin size={13} style={{ color: '#c9a84c' }} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide mb-0.5"
                style={{ color: 'rgba(15,26,14,0.4)' }}>Delivery Address</p>
              <p className="text-sm font-medium" style={{ color: '#0f1a0e' }}>
                {order.customer_name}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(15,26,14,0.5)' }}>
                {order.address}, {order.city}, {order.state} — {order.pincode}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(15,26,14,0.4)' }}>
                📞 {order.phone}
              </p>
            </div>
          </div>

          {/* Payment info */}
          <div className="flex items-center justify-between text-xs px-3 py-2.5 rounded-xl"
            style={{ backgroundColor: 'rgba(15,26,14,0.03)' }}>
            <span style={{ color: 'rgba(15,26,14,0.4)' }}>Payment Method</span>
            <span className="font-black uppercase tracking-wide" style={{ color: '#0f1a0e' }}>
              {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Paid Online'}
            </span>
          </div>

          {/* Help button */}
          <a href={`https://wa.me/919623740541?text=Hi! I need help with my order #${order.id.slice(0,8).toUpperCase()}`}
            target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#25D366' }}>
            <Phone size={13} /> Need Help? WhatsApp Us
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
    <div className="min-h-screen" style={{ backgroundColor: '#0f1a0e' }}>

      {/* ===== HERO HEADER ===== */}
      <div className="px-4 pt-10 pb-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #c9a84c 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
            <Package size={24} style={{ color: '#c9a84c' }} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
            Track Your Order
          </h1>
          <p className="text-xs font-medium uppercase tracking-widest"
            style={{ color: 'rgba(201,168,76,0.6)' }}>
            Real-time order status updates
          </p>
        </div>
      </div>

      {/* ===== SEARCH CARD ===== */}
      <div className="px-4 pb-6 max-w-lg mx-auto">
        <div className="rounded-3xl overflow-hidden shadow-xl"
          style={{ backgroundColor: '#fcfaf6' }}>
          <div className="p-5">
            <p className="text-xs font-black uppercase tracking-widest mb-4"
              style={{ color: 'rgba(15,26,14,0.4)' }}>
              Search by
            </p>

            {/* Toggle */}
            <div className="grid grid-cols-2 gap-2 mb-5 p-1 rounded-2xl"
              style={{ backgroundColor: 'rgba(15,26,14,0.05)' }}>
              {[
                { key: 'phone', label: '📞 Phone', icon: Phone },
                { key: 'email', label: '✉️ Email', icon: Mail },
              ].map(t => (
                <button key={t.key}
                  onClick={() => { setSearchType(t.key); setSearchValue(''); setOrders(null); setSearched(false) }}
                  className="py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                  style={{
                    backgroundColor: searchType === t.key ? '#0f1a0e' : 'transparent',
                    color: searchType === t.key ? 'white' : 'rgba(15,26,14,0.4)',
                  }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSearch} className="flex flex-col gap-3">
              <div className="relative">
                {searchType === 'phone'
                  ? <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                      <Phone size={14} style={{ color: '#c9a84c' }} />
                      <span className="text-xs font-bold" style={{ color: 'rgba(15,26,14,0.3)' }}>+91</span>
                    </div>
                  : <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: '#c9a84c' }} />
                }
                <input
                  type={searchType === 'email' ? 'email' : 'tel'}
                  value={searchValue}
                  onChange={e => setSearchValue(
                    searchType === 'phone'
                      ? e.target.value.replace(/\D/g, '').slice(0, 10)
                      : e.target.value
                  )}
                  placeholder={searchType === 'phone' ? '9876543210' : 'you@example.com'}
                  className="w-full py-4 pr-4 rounded-2xl text-sm outline-none transition-all"
                  style={{
                    paddingLeft: searchType === 'phone' ? '4.5rem' : '3rem',
                    backgroundColor: 'white',
                    border: '1.5px solid rgba(15,26,14,0.08)',
                    color: '#0f1a0e',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                />
              </div>

              <button type="submit" disabled={loading}
                className="group w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                style={{
                  backgroundColor: loading ? 'rgba(15,26,14,0.5)' : '#0f1a0e',
                  boxShadow: '0 8px 24px rgba(15,26,14,0.2)',
                }}>
                {loading
                  ? 'Searching...'
                  : <><Search size={14} /> Track My Order</>
                }
              </button>
            </form>

            <p className="text-center text-xs mt-4" style={{ color: 'rgba(15,26,14,0.35)' }}>
              Use the same {searchType} you used at checkout
            </p>
          </div>

          {/* Login nudge */}
          <div className="px-5 pb-5">
            <Link href="/login"
              className="flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all group"
              style={{ backgroundColor: 'rgba(15,26,14,0.04)', border: '1.5px solid rgba(15,26,14,0.06)' }}>
              <span style={{ color: 'rgba(15,26,14,0.5)' }}>
                🔐 Login for full order history
              </span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform"
                style={{ color: '#c9a84c' }} />
            </Link>
          </div>
        </div>

        {/* ===== RESULTS ===== */}
        {searched && orders !== null && (
          <div className="mt-5 flex flex-col gap-4">
            {orders.length === 0 ? (
              <div className="rounded-3xl p-8 text-center"
                style={{ backgroundColor: '#fcfaf6' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: 'rgba(15,26,14,0.05)' }}>
                  <ShoppingBag size={24} style={{ color: 'rgba(15,26,14,0.2)' }} />
                </div>
                <p className="font-black text-base mb-1" style={{ color: '#0f1a0e' }}>
                  No orders found
                </p>
                <p className="text-xs mb-4" style={{ color: 'rgba(15,26,14,0.4)' }}>
                  Try searching with your {searchType === 'phone' ? 'email' : 'phone number'} instead
                </p>
                <button
                  onClick={() => { setSearchType(searchType === 'phone' ? 'email' : 'phone'); setSearchValue(''); setOrders(null); setSearched(false) }}
                  className="px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest text-white"
                  style={{ backgroundColor: '#0f1a0e' }}>
                  Try {searchType === 'phone' ? 'Email' : 'Phone'}
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs font-black uppercase tracking-widest text-center"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {orders.length} order{orders.length > 1 ? 's' : ''} found
                </p>
                {orders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
              }
