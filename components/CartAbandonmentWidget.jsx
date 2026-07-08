'use client'

import { useState, useEffect, useRef } from 'react'
import { useCartStore } from '@/store/cartStore'
import { Phone, X, ShoppingBag, ArrowRight } from 'lucide-react'

const DELAY_MS = 3 * 60 * 1000 // 3 minutes
const STORAGE_KEY = 'crabveda_cart_nudge_dismissed'

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
      if (timerRef.current) clearTimeout(timerRef.current)
      setShow(false)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [items.length, dismissed])

  const handleDismiss = () => {
    setShow(false)
    setDismissed(true)
    sessionStorage.setItem(STORAGE_KEY, '1')
  }

  const buildWhatsAppMessage = () => {
    const total = getTotalPrice()
    const shipping = 0
    const itemList = items.map(i => `• ${i.name} × ${i.quantity} — ₹${(i.price * i.quantity).toFixed(0)}`).join('\n')
    return encodeURIComponent(`Hi! I have items in my CrabVeda cart and need help:\n\n${itemList}\n\nTotal: ₹${(total + shipping).toFixed(0)}\n\nCan you help me complete this order?`)
  }

  if (!show || items.length === 0) return null

  const total = getTotalPrice()
  const shipping = 0

  return (
    <div className="fixed bottom-6 right-4 z-[100] w-72 shadow-xl shadow-black/10">
      <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white">
        
        {/* ===== TOP BAR HEAD TITLE (MATCHES CART HEAD INTERFACE) ===== */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-50 bg-gray-50/50">
          <div className="flex items-center gap-1.5">
            <ShoppingBag size={12} style={{ color: '#c9a84c' }} />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Complete Your Order
            </p>
          </div>
          <button onClick={handleDismiss} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X size={12} />
          </button>
        </div>

        {/* ===== NUDGE CARD TEXT CONTENT LAYER ===== */}
        <div className="p-4">
          <p className="text-xs font-semibold leading-relaxed text-gray-400 mb-3">
            You have <strong className="text-black font-black">{items.length} item{items.length > 1 ? 's' : ''}</strong> worth{' '}
            <strong className="text-[#c9a84c] font-black">₹{(total + shipping).toFixed(0)}</strong> resting in your cart.
          </p>

          <div className="flex flex-col gap-1.5 mb-4 border-b border-gray-50 pb-3">
            {items.slice(0, 2).map(item => (
              <div key={item.id} className="flex justify-between text-[11px] font-semibold text-gray-400">
                <span className="truncate pr-4">{item.name}</span>
                <span className="font-black text-[#c9a84c] shrink-0">₹{(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
            {items.length > 2 && (
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-300">
                +{items.length - 2} more items
              </p>
            )}
          </div>

          {/* ===== CALL TO ACTION ROW ACTIONS ===== */}
          <div className="flex flex-col gap-1.5">
            <a href={`https://wa.me/919921297518?text=${buildWhatsAppMessage()}`}
              target="_blank" rel="noreferrer" onClick={handleDismiss}
              className="w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 bg-emerald-50/40 text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1.5">
              <Phone size={12} /> Assist Over WhatsApp
            </a>
            
            <a href="/checkout" onClick={handleDismiss}
              className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all active:scale-[0.98] bg-[#0f1a0e] flex items-center justify-center gap-1.5">
              Secure Checkout <ArrowRight size={12} />
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}