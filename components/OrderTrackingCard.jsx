'use client'
import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Phone, Download, ChevronDown, ChevronUp } from 'lucide-react'
import TrackingTimeline from '@/components/TrackingTimeline'

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
    if (t === 'exception') return { step: 2, title: 'Shipment update', note: 'India Post reported an issue with this shipment. Message us on WhatsApp if it continues.', color: '#b45309' }
    if (moving || hasScans) return { step: 2, title: 'In transit', note: latest || 'Your order is on its way to you.', color: '#0a0f0d' }
    return { step: 1, title: 'Shipped', note: 'Your order has been handed over to India Post. It usually arrives in 3–7 business days.', color: '#0a0f0d' }
  }
  if (s === 'confirmed') return { step: 0, title: 'Preparing your order', note: 'Your order is confirmed and is being packed.', color: '#0a0f0d' }
  return { step: 0, title: 'Order placed', note: 'We have received your order.', color: '#0a0f0d' }
}

export default function OrderTrackingCard({ order, showInvoice = false, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  const [expanded, setExpanded] = useState(false)
  const p = getProgress(order)
  const isCancelled = p.step < 0
  const accent = p.step === 3 ? '#15803d' : '#0a0f0d'
  const shortId = order.id.slice(0, 8).toUpperCase()

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-black/10 w-full">

      {/* Order summary band */}
      <div className="grid grid-cols-3 gap-3 px-4 sm:px-6 py-3.5 bg-slate-100 border-b border-black/5">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Order placed</p>
          <p className="text-xs font-bold text-[#0a0f0d] mt-0.5">
            {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Total</p>
          <p className="text-xs font-bold text-[#0a0f0d] mt-0.5">₹{Number(order.total_amount).toFixed(0)}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Order #</p>
          <p className="text-xs font-bold font-mono text-[#0a0f0d] mt-0.5">{shortId}</p>
        </div>
      </div>

      {/* Status headline and progress */}
      <div className={`px-4 sm:px-6 pt-5 ${open ? 'pb-6' : 'pb-5'}`}>
        <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-start justify-between gap-3 text-left">
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-black tracking-tight" style={{ color: p.color }}>{p.title}</h3>
            <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">{p.note}</p>
          </div>
          <span className="mt-1 shrink-0 text-gray-400">
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </span>
        </button>

        {open && !isCancelled && (
          <div className="relative flex items-start justify-between mt-6">
            <div className="absolute left-[12.5%] right-[12.5%] top-[10px] h-[3px] rounded-full bg-slate-200">
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
                  <span className="text-[10px] sm:text-[11px] text-center leading-tight font-semibold"
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
      {open && order.tracking_number && !isCancelled && <TrackingTimeline order={order} />}

      {/* Details toggle */}
      {open && <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1.5 py-3.5 border-t border-gray-100 text-xs font-bold text-[#93731e] hover:bg-slate-50 transition-colors"
      >
        {expanded ? 'Hide order details' : 'View order details'}
        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>}

      {/* Expanded details */}
      {open && expanded && (
        <div className="px-4 sm:px-6 pb-5 pt-4 border-t border-gray-100 flex flex-col gap-4 animate-fadeIn">
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

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            {showInvoice && (
              <a href={`/api/send-invoice?orderId=${order.id}`} target="_blank" rel="noreferrer"
                className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all hover:opacity-95 shadow-sm bg-[#0f1a0e]">
                <Download size={13} /> Invoice
              </a>
            )}
            <a href={`https://wa.me/919921297518?text=Hi! I need help with my order %23${order.id.slice(0,8).toUpperCase()}`}
              target="_blank" rel="noreferrer"
              className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all hover:opacity-95 shadow-sm"
              style={{ backgroundColor: '#25D366' }}>
              <Phone size={13} fill="currentColor" /> {showInvoice ? 'Help' : 'Need Help? WhatsApp Us'}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}