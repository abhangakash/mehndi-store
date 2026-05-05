'use client'
import { useState, useEffect, useRef } from 'react'
import { useCartStore } from '@/store/cartStore'
import { Phone, X, ShoppingCart } from 'lucide-react'

const DELAY_MS = 3 * 60 * 1000 // 3 minutes
const STORAGE_KEY = 'shrilekha_cart_nudge_dismissed'

export default function CartAbandonmentWidget() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const items = useCartStore(s => s.items)
  const getTotalPrice = useCartStore(s => s.getTotalPrice)
  const timerRef = useRef(null)

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem(STORAGE_KEY)
    if (wasDismissed) return
    if (items.length > 0 && !dismissed) {
      timerRef.current = setTimeout(() => setShow(true), DELAY_MS)
    } else {
      clearTimeout(timerRef.current)
      setShow(false)
    }
    return () => clearTimeout(timerRef.current)
  }, [items.length, dismissed])

  const handleDismiss = () => {
    setShow(false)
    setDismissed(true)
    sessionStorage.setItem(STORAGE_KEY, '1')
  }

  const buildWhatsAppMessage = () => {
    const total = getTotalPrice()
    const shipping = total >= 499 ? 0 : 60
    const itemList = items.map(i => `• ${i.name} × ${i.quantity} — ₹${(i.price * i.quantity).toFixed(0)}`).join('\n')
    return encodeURIComponent(`Hi! I have items in my cart and need help:\n\n${itemList}\n\nTotal: ₹${(total + shipping).toFixed(0)}\n\nCan you help me complete this order?`)
  }

  if (!show || items.length === 0) return null

  const total = getTotalPrice()
  const shipping = total >= 499 ? 0 : 60

  return (
    <div className="fixed bottom-24 right-4 z-[100] w-72"
      style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))' }}>
      <div className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: '#fcfaf6', border: '1.5px solid rgba(15,26,14,0.08)' }}>
        <div className="flex items-center justify-between px-4 py-3"
          style={{ background: 'linear-gradient(135deg, #0f1a0e, #1a3020)' }}>
          <div className="flex items-center gap-2">
            <ShoppingCart size={14} style={{ color: '#c9a84c' }} />
            <span className="text-xs font-black uppercase tracking-widest text-white">
              Complete Your Order
            </span>
          </div>
          <button onClick={handleDismiss} className="p-0.5 rounded-full hover:bg-white/10">
            <X size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
          </button>
        </div>
        <div className="p-4">
          <p className="text-xs mb-3 leading-relaxed" style={{ color: 'rgba(15,26,14,0.6)' }}>
            You have <strong style={{ color: '#0f1a0e' }}>{items.length} item{items.length > 1 ? 's' : ''}</strong> worth{' '}
            <strong style={{ color: '#c9a84c' }}>₹{(total + shipping).toFixed(0)}</strong> in your cart. Need help?
          </p>
          <div className="flex flex-col gap-1.5 mb-3">
            {items.slice(0, 2).map(item => (
              <div key={item.id} className="flex justify-between text-xs" style={{ color: 'rgba(15,26,14,0.5)' }}>
                <span className="truncate mr-2">{item.name}</span>
                <span className="font-bold flex-shrink-0" style={{ color: '#c9a84c' }}>₹{(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
            {items.length > 2 && <p className="text-xs" style={{ color: 'rgba(15,26,14,0.3)' }}>+{items.length - 2} more</p>}
          </div>
          <div className="flex flex-col gap-2">
            <a href={`https://wa.me/919623740541?text=${buildWhatsAppMessage()}`}
              target="_blank" rel="noreferrer" onClick={handleDismiss}
              className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white"
              style={{ backgroundColor: '#25D366' }}>
              <Phone size={12} /> Order via WhatsApp
            </a>
            <a href="/checkout" onClick={handleDismiss}
              className="flex items-center justify-center w-full py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white"
              style={{ backgroundColor: '#0f1a0e' }}>
              Checkout Now →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}