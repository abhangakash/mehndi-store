import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  CheckCircle, Package, MapPin, Phone,
  Truck, ArrowRight, Download, MessageCircle
} from 'lucide-react'

async function getOrder(id) {
  const { data } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single()
  return data
}

export default async function OrderConfirmationPage({ params }) {
  const { id } = await params
  const order = await getOrder(id)
  if (!order) notFound()

  const waMsg = encodeURIComponent(
    `Hi! I just placed an order on CrabVeda.\nOrder ID: #${order.id.slice(0, 8).toUpperCase()}\nTotal: ₹${order.total_amount}`
  )

  // Dynamically checking if order was COD or Prepaid
  const isCOD = order.payment_method?.toLowerCase() === 'cod' || order.is_cod === true

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f1a0e' }}>
      
      {/* Meta Purchase Event Tracking Trigger 👇 */}
      <script dangerouslySetInnerHTML={{ __html: `
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'Purchase', {
            value: ${Number(order.total_amount).toFixed(2)},
            currency: 'INR',
            content_type: 'product',
            content_ids: ${JSON.stringify(order.order_items?.map(item => item.product_name) || [])}
          });
        }
      `}} />

      {/* Hero */}
      <div className="px-4 pt-10 pb-6 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: 'rgba(21,128,61,0.2)', border: '2px solid rgba(21,128,61,0.4)' }}>
          <CheckCircle size={32} style={{ color: '#4ade80' }} />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-1">
          Order Confirmed!
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(201,168,76,0.7)' }}>
          Thank you, {order.customer_name}!
        </p>
        <div className="inline-block mt-3 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
          style={{ backgroundColor: 'rgba(201,168,76,0.1)', color: '#93731e', border: '1px solid rgba(201,168,76,0.2)' }}>
          Order #{order.id.slice(0, 8).toUpperCase()}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-10 max-w-lg mx-auto flex flex-col gap-4">

        {/* Order summary card */}
        <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: '#fcfaf6' }}>
          <div className="px-5 py-4 flex items-center gap-2"
            style={{ borderBottom: '1px solid rgba(15,26,14,0.06)', backgroundColor: '#fef9ee' }}>
            <Package size={15} style={{ color: '#93731e' }} />
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(15,26,14,0.5)' }}>
              Order Summary
            </p>
          </div>
          <div className="p-5">
            {order.order_items?.map(item => (
              <div key={item.id} className="flex justify-between py-2 border-b last:border-0 text-sm"
                style={{ borderColor: 'rgba(15,26,14,0.06)' }}>
                <span style={{ color: '#0f1a0e' }}>{item.product_name} × {item.quantity}</span>
                <span className="font-black" style={{ color: '#93731e' }}>
                  ₹{Number(item.total_price).toFixed(0)}
                </span>
              </div>
            ))}
            <div className="mt-3 pt-3 border-t flex flex-col gap-1.5" style={{ borderColor: 'rgba(15,26,14,0.06)' }}>
              <div className="flex justify-between text-xs" style={{ color: 'rgba(15,26,14,0.5)' }}>
                <span>Shipping</span>
                <span style={{ color: '#15803d' }} className="font-medium">
                  FREE
                </span>
              </div>
              <div className="flex justify-between font-black text-base">
                <span style={{ color: '#0f1a0e' }}>Total</span>
                <span style={{ color: '#93731e' }}>₹{Number(order.total_amount).toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery + payment */}
        <div className="rounded-3xl p-5" style={{ backgroundColor: '#fcfaf6' }}>
          <div className="flex items-start gap-3 mb-4 pb-4"
            style={{ borderBottom: '1px solid rgba(15,26,14,0.06)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(201,168,76,0.1)' }}>
              <MapPin size={14} style={{ color: '#93731e' }} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-1"
                style={{ color: 'rgba(15,26,14,0.4)' }}>Delivery Address</p>
              <p className="text-sm font-bold" style={{ color: '#0f1a0e' }}>{order.customer_name}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(15,26,14,0.5)' }}>
                {order.address}, {order.city}, {order.state} — {order.pincode}
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgba(15,26,14,0.4)' }}>📞 {order.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(201,168,76,0.1)' }}>
              <Truck size={14} style={{ color: '#93731e' }} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-0.5"
                style={{ color: 'rgba(15,26,14,0.4)' }}>Expected Delivery</p>
              <p className="text-sm font-bold" style={{ color: '#0f1a0e' }}>3–7 business days</p>
              <p className="text-xs" style={{ color: 'rgba(15,26,14,0.4)' }}>
                Payment: {isCOD ? 'Cash on Delivery (Pay when received) 📦' : 'Paid Online ✅'}
              </p>
            </div>
          </div>
        </div>

        {/* Email notice */}
        {order.email && (
          <div className="rounded-2xl px-4 py-3 flex items-center gap-2.5"
            style={{ backgroundColor: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
            <span className="text-base">📧</span>
            <p className="text-xs" style={{ color: 'rgba(201,168,76,0.8)' }}>
              Order confirmation email sent to <strong>{order.email}</strong>
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-2.5">
          {/* Invoice download */}
          <a href={`/api/send-invoice?orderId=${order.id}`}
            target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#0f1a0e' }}>
            <Download size={14} /> Download Invoice (PDF)
          </a>

          {/* WhatsApp share */}
          <a href={`https://wa.me/919921297518?text=${waMsg}`}
            target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#25D366' }}>
            <MessageCircle size={14} /> Share on WhatsApp
          </a>

          {/* Track order */}
          <Link href="/track-order"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
            style={{ border: '1.5px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}>
            Track My Order <ArrowRight size={13} />
          </Link>

          {/* Continue shopping */}
          <Link href="/products"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
            style={{ border: '1.5px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}