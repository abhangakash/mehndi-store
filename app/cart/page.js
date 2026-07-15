'use client'
import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()
  const total = getTotalPrice()
  // Shipping is free on all orders per CrabVeda rules
  const shipping = 0
  const grandTotal = total + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-white">
        <div className="text-center">
          <ShoppingBag size={48} className="mx-auto mb-4 text-black/10" />
          <p className="font-black text-black mb-4 uppercase tracking-widest">Cart is empty</p>
          <Link href="/products" className="inline-flex items-center justify-center py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest text-white transition-all active:scale-[0.98] shadow-xl shadow-black/10 bg-[#0f1a0e]">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 pt-8 pb-4 text-center">
        <h1 className="text-2xl font-black uppercase tracking-tight text-black">Your Cart</h1>
        <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: '#93731e' }}>
          Review your items before secure checkout
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-10">
        {/* Top bar with secondary actions */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => { clearCart(); toast.success('Cart cleared') }} 
            className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
          >
            [ Clear All ]
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ===== LEFT: Cart Items List ===== */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm">
              <div className="px-5 py-3.5 flex items-center gap-2 border-b border-gray-50 bg-gray-50/50">
                <ShoppingBag size={14} style={{ color: '#93731e' }} />
                <p className="text-xs font-black uppercase tracking-widest text-gray-500">
                  Selected Products ({items.reduce((acc, i) => acc + i.quantity, 0)})
                </p>
              </div>
              
              <div className="p-5 divide-y divide-gray-50">
                {items.map((item, index) => (
                  <div key={item.id} className={`flex gap-4 items-start py-4 ${index === 0 ? 'pt-0' : ''} ${index === items.length - 1 ? 'pb-0' : ''}`}>
                    {/* Item Thumbnail */}
                    <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">🦀</span>
                      )}
                    </div>

                    {/* Item Detail Deck */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-semibold text-sm text-black leading-tight truncate">{item.name}</p>
                        <button 
                          onClick={() => { removeItem(item.id); toast.success('Item removed') }} 
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <p className="text-xs text-gray-400 line-clamp-1">{item.short_description}</p>
                      
                      <div className="flex items-center justify-between pt-3">
                        {/* Quantity Increment/Decrement Picker */}
                        <div className="flex items-center border border-gray-100 rounded-xl overflow-hidden bg-gray-50/50">
                          <button 
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                            className="px-3 py-2 text-gray-500 hover:text-black transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-3 py-2 text-xs font-black text-black border-x border-gray-100 bg-white min-w-[32px] text-center">
                            {item.quantity}
                          </span>
                          <button 
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                            className="px-3 py-2 text-gray-500 hover:text-black transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Calculated Line Total */}
                        <span className="font-black text-sm text-[#93731e]">
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== RIGHT: Cart Summary Deck ===== */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-100 overflow-hidden lg:sticky lg:top-24 bg-white shadow-lg">
              <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                <p className="text-xs font-black uppercase tracking-widest text-gray-500">Order Summary</p>
              </div>
              
              <div className="p-5">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Subtotal</span>
                    <span className="text-black font-semibold">₹{total.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-green-600 font-bold">FREE</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
                    <span className="font-black text-xs uppercase tracking-widest text-black">Total Amount</span>
                    <span className="font-black text-lg text-[#93731e]">₹{grandTotal.toFixed(0)}</span>
                  </div>
                </div>

                {/* Primary Action Button */}
                <Link 
                  href="/checkout" 
                  className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] mb-3 shadow-xl shadow-black/10 bg-[#0f1a0e]"
                >
                  Proceed to Checkout <ArrowRight size={14} />
                </Link>

                {/* Secondary Action Link */}
                <Link 
                  href="/products" 
                  className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-gray-500 hover:text-black hover:bg-gray-50 border border-gray-100 flex items-center justify-center transition-all active:scale-[0.99]"
                >
                  Continue Shopping
                </Link>

                <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                  <Truck size={12} className="text-[#93731e]" /> Free delivery on all orders
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}