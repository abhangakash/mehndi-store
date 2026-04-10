'use client'
import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, Tag } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()
  const total = getTotalPrice()
  const shipping = total >= 499 ? 0 : 60
  const grandTotal = total + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--brand-surface)' }}>
        <div className="text-center">
          <ShoppingBag size={56} className="mx-auto mb-4" style={{ color: 'var(--brand-muted)' }} />
          <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--brand-text)' }}>Your cart is empty</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--brand-muted)' }}>Looks like you haven't added anything yet</p>
          <Link href="/products" className="btn-primary">Browse Products <ArrowRight size={16} /></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title mb-0">Your Cart</h1>
        <button onClick={() => { clearCart(); toast.success('Cart cleared') }} className="text-sm" style={{ color: 'var(--brand-muted)' }}>Clear all</button>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-4">
          {items.map(item => (
            <div key={item.id} className="card p-4 flex gap-4 items-start">
              <div className="w-20 h-20 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ backgroundColor: 'var(--brand-surface)' }}>
                {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" /> : <span className="text-3xl">🌿</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm mb-0.5 truncate" style={{ color: 'var(--brand-text)' }}>{item.name}</p>
                <p className="text-xs mb-3" style={{ color: 'var(--brand-muted)' }}>{item.short_description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border rounded-lg overflow-hidden" style={{ borderColor: 'var(--brand-border)' }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2.5 py-1.5 hover:bg-gray-50"><Minus size={13} /></button>
                    <span className="px-3 py-1.5 text-sm font-medium border-x" style={{ borderColor: 'var(--brand-border)' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2.5 py-1.5 hover:bg-gray-50"><Plus size={13} /></button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold" style={{ color: 'var(--brand-brown)' }}>₹{(item.price * item.quantity).toFixed(0)}</span>
                    <button onClick={() => { removeItem(item.id); toast.success('Item removed') }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 size={15} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="md:col-span-1">
          <div className="card p-5 sticky top-20">
            <h2 className="font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>Order Summary</h2>
            <div className="flex flex-col gap-2.5 mb-4">
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--brand-muted)' }}>Subtotal</span>
                <span>₹{total.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--brand-muted)' }}>Shipping</span>
                {shipping === 0 ? <span style={{ color: '#15803d' }} className="font-medium">FREE</span> : <span>₹{shipping}</span>}
              </div>
              {shipping > 0 && (
                <div className="flex items-start gap-1.5 p-2.5 rounded-lg text-xs" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                  <Tag size={12} className="mt-0.5 flex-shrink-0" />
                  Add ₹{(499 - total).toFixed(0)} more for free shipping!
                </div>
              )}
            </div>
            <div className="border-t pt-3 mb-5" style={{ borderColor: 'var(--brand-border)' }}>
              <div className="flex justify-between font-semibold">
                <span style={{ color: 'var(--brand-text)' }}>Total</span>
                <span style={{ color: 'var(--brand-brown)' }}>₹{grandTotal.toFixed(0)}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-primary w-full justify-center text-sm mb-3">Proceed to Checkout <ArrowRight size={16} /></Link>
            <Link href="/products" className="btn-secondary w-full justify-center text-sm">Continue Shopping</Link>
            <div className="flex items-center justify-center gap-1.5 mt-4 text-xs" style={{ color: 'var(--brand-muted)' }}>
              <Truck size={12} /> Free shipping on orders above ₹499
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}