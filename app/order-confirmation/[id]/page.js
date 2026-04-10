import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, MapPin, Phone, Truck, ArrowRight } from 'lucide-react'

async function getOrder(id) {
  const { data } = await supabase.from('orders').select('*, order_items(*)').eq('id', id).single()
  return data
}

export default async function OrderConfirmationPage({ params }) {
  const order = await getOrder(params.id)
  if (!order) notFound()
  const waMsg = encodeURIComponent(`Hi! I just placed an order on Shrilekha Mehndi Art.\nOrder ID: ${order.id.slice(0,8).toUpperCase()}\nTotal: ₹${order.total_amount}`)

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: 'var(--brand-surface)' }}>
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#dcfce7' }}>
            <CheckCircle size={32} style={{ color: '#15803d' }} />
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--brand-green)' }}>Order Placed!</h1>
          <p className="text-sm" style={{ color: 'var(--brand-muted)' }}>Thank you, {order.customer_name}! Your order has been confirmed.</p>
          <div className="inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--brand-surface)', color: 'var(--brand-muted)', border: '1px solid var(--brand-border)' }}>
            Order #{order.id.slice(0,8).toUpperCase()}
          </div>
        </div>
        <div className="card mb-4 overflow-hidden">
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--brand-border)', backgroundColor: 'var(--brand-surface)' }}>
            <h2 className="font-semibold text-sm flex items-center gap-2" style={{ color: 'var(--brand-text)' }}><Package size={15} /> Order Summary</h2>
          </div>
          <div className="p-5">
            {order.order_items?.map(item => (
              <div key={item.id} className="flex justify-between py-2 border-b last:border-0 text-sm" style={{ borderColor: 'var(--brand-border)' }}>
                <span style={{ color: 'var(--brand-text)' }}>{item.product_name} × {item.quantity}</span>
                <span className="font-medium" style={{ color: 'var(--brand-brown)' }}>₹{Number(item.total_price).toFixed(0)}</span>
              </div>
            ))}
            <div className="mt-3 pt-3 border-t flex flex-col gap-1.5" style={{ borderColor: 'var(--brand-border)' }}>
              <div className="flex justify-between text-sm"><span style={{ color: 'var(--brand-muted)' }}>Shipping</span><span style={{ color: order.shipping_amount == 0 ? '#15803d' : 'var(--brand-text)' }}>{order.shipping_amount == 0 ? 'FREE' : `₹${order.shipping_amount}`}</span></div>
              <div className="flex justify-between font-semibold"><span style={{ color: 'var(--brand-text)' }}>Total</span><span style={{ color: 'var(--brand-brown)' }}>₹{Number(order.total_amount).toFixed(0)}</span></div>
            </div>
          </div>
        </div>
        <div className="card p-5 mb-4">
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--brand-text)' }}><MapPin size={15} /> Delivery Address</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--brand-muted)' }}>{order.customer_name}<br />{order.address}<br />{order.city}, {order.state} — {order.pincode}</p>
          <div className="flex items-center gap-1.5 mt-2 text-sm" style={{ color: 'var(--brand-muted)' }}><Phone size={13} /> {order.phone}</div>
        </div>
        <div className="card p-5 mb-6">
          <div className="flex items-start gap-3">
            <Truck size={18} className="mt-0.5" style={{ color: 'var(--brand-green)' }} />
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--brand-text)' }}>Expected Delivery: 3–7 business days</p>
              <p className="text-xs" style={{ color: 'var(--brand-muted)' }}>Payment: {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Paid Online'}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <a href={`https://wa.me/919623740541?text=${waMsg}`} target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-medium border hover:bg-green-50"
            style={{ borderColor: '#86efac', color: '#15803d' }}>
            <Phone size={15} /> Share order on WhatsApp
          </a>
          <Link href="/track-order" className="btn-secondary w-full justify-center text-sm">Track My Order <ArrowRight size={15} /></Link>
          <Link href="/products" className="btn-primary w-full justify-center text-sm">Continue Shopping <ArrowRight size={15} /></Link>
        </div>
      </div>
    </div>
  )
}