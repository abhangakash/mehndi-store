'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import ProductCard from './ProductCard'
import toast from 'react-hot-toast'
import ReviewForm from './ReviewForm'
import {
  ShoppingCart, Zap, Star, ChevronDown, ChevronUp,
  Truck, RefreshCw, Shield, Phone, Package,
  CheckCircle, Leaf, Plus, Minus, Heart, Share2,
  Tag, Clock, Award, CreditCard, Wallet, Landmark
} from 'lucide-react'

function StarRating({ rating, size = 16, interactive = false, onRate }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <button key={s} type="button"
          onClick={() => interactive && onRate && onRate(s)}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}>
          <Star size={size}
            fill={s <= (hover || rating) ? '#93731e' : 'none'}
            color={s <= (hover || rating) ? '#93731e' : '#e5e7eb'} />
        </button>
      ))}
    </div>
  )
}

function Accordion({ title, icon, children, defaultOpen = false, badge }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b last:border-0 border-gray-100 bg-white">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 px-4 text-left gap-3">
        <div className="flex items-center gap-2.5">
          {icon && <span style={{ color: '#93731e' }}>{icon}</span>}
          <span className="text-xs font-black uppercase tracking-widest text-gray-500">{title}</span>
          {badge && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
              {badge}
            </span>
          )}
        </div>
        {open
          ? <ChevronUp size={14} className="text-gray-400 flex-shrink-0" />
          : <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-5 text-xs font-semibold leading-relaxed text-gray-400 border-t border-gray-50/50 pt-3">
          {children}
        </div>
      )}
    </div>
  )
}

export default function ProductDetail({ product, reviews, related }) {
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)
  const addItem = useCartStore(s => s.addItem)

  const images = (product.images?.length ? product.images : [product.image_url]).filter(Boolean)
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : null
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null

  const handleAddToCart = () => {
    addItem(product, qty)
    toast.success(`${product.name} added to cart!`, {
      icon: '🦀',
      style: { borderRadius: '12px', fontSize: '13px', fontWeight: 'bold' },
    })
  }

  const handleBuyNow = () => {
    addItem(product, qty)
    window.location.href = '/checkout'
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied!')
    }
  }

  const paymentMethods = [
    { name: 'UPI', icon: <img src="/upi.svg" alt="UPI" className="w-5 h-5 object-contain flex-shrink-0" /> },
    { name: 'GPay', icon: <img src="/gpay.svg" alt="GPay" className="w-5 h-5 object-contain flex-shrink-0" /> },
    { name: 'PhonePe', icon: <img src="/phonepe.svg" alt="PhonePe" className="w-5 h-5 object-contain flex-shrink-0" /> },
    { name: 'Paytm', icon: <img src="/paytm.svg" alt="Paytm" className="w-5 h-5 object-contain flex-shrink-0" /> },
    { name: 'Visa', icon: <img src="/visa.svg" alt="Visa" className="w-5 h-5 object-contain flex-shrink-0" /> },
    { name: 'Mastercard', icon: <img src="/mastercard.svg" alt="Mastercard" className="w-5 h-5 object-contain flex-shrink-0" /> },
    { name: 'Amazon Pay', icon: <img src="/amazon.svg" alt="Amazon Pay" className="w-5 h-5 object-contain flex-shrink-0" /> },
    { name: 'RuPay', icon: <img src="/rupay.svg" alt="RuPay" className="w-5 h-5 object-contain flex-shrink-0" /> }
  ]

  return (
    <div className="bg-white min-h-screen text-black antialiased pb-16">
      
      {/* ===== BREADCRUMB (MATCHES CART HEADER COPY SUBTEXT) ===== */}
      <div className="max-w-5xl mx-auto px-4 pt-6 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 flex-wrap">
        <Link href="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-black">Shop</Link>
        {product.categories && (
          <>
            <span>/</span>
            <Link href={`/products?category=${product.categories.slug}`} className="hover:text-black">
              {product.categories.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-black truncate max-w-[120px]">{product.name}</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-10">
        
        {/* ===== LEFT: MASTER CONTRAST IMAGE BLOCK ===== */}
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-gray-100 overflow-hidden relative bg-white shadow-sm aspect-square flex items-center justify-center p-4">
            {images[activeImg] ? (
              <img src={images[activeImg]} alt={product.name} className="max-h-full max-w-full object-contain mx-auto" />
            ) : (
              <span className="text-7xl">🦀</span>
            )}
            
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {discount && (
                <span className="bg-[#93731e] text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">
                  {discount}% OFF
                </span>
              )}
              {product.is_featured && (
                <span className="bg-[#0f1a0e] text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">
                  ★ Featured
                </span>
              )}
            </div>

            {product.stock === 0 && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
                <span className="text-xs font-black uppercase tracking-widest text-gray-400 border border-gray-100 bg-white px-4 py-2 rounded-xl shadow-xs">
                  Out of Stock
                </span>
              </div>
            )}

            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <button onClick={handleShare} className="w-8 h-8 rounded-xl border border-gray-100 bg-white/90 shadow-xs flex items-center justify-center hover:bg-white transition-colors">
                <Share2 size={13} className="text-gray-400" />
              </button>
              <button onClick={() => { setWishlisted(!wishlisted); toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist') }}
                className="w-8 h-8 rounded-xl border border-gray-100 bg-white/90 shadow-xs flex items-center justify-center hover:bg-white transition-colors">
                <Heart size={13} fill={wishlisted ? '#ef4444' : 'none'} color={wishlisted ? '#ef4444' : '#9ca3af'} />
              </button>
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border bg-white flex-shrink-0 flex items-center justify-center p-1 transition-all ${
                    activeImg === i ? 'border-[#93731e] ring-1 ring-[#93731e]/20' : 'border-gray-100'
                  }`}>
                  {img ? <img src={img} alt="" className="max-h-full max-w-full object-contain" /> : <span className="text-xl">🦀</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ===== RIGHT: PREMIUM MINIMALIST SPECIFICATION SHEET ===== */}
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            {product.categories && (
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                {product.categories.name}
              </span>
            )}
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black leading-tight">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {avgRating ? (
              <>
                <StarRating rating={Math.round(parseFloat(avgRating))} size={12} />
                <span className="text-xs font-black text-[#93731e] ml-0.5">{avgRating}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                </span>
              </>
            ) : (
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">No reviews yet</span>
            )}
          </div>

          <p className="text-xs font-semibold leading-relaxed text-gray-400">
            {product.short_description || product.description}
          </p>

          <div className="flex items-center gap-3 py-3 border-y border-gray-100">
            <span className="text-2xl font-black text-[#93731e]">
              ₹{product.price}
            </span>
            {product.original_price && (
              <>
                <span className="text-sm font-semibold line-through text-gray-300">
                  ₹{product.original_price}
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4 flex-wrap text-[10px] font-black uppercase tracking-widest text-gray-400">
            <div className="flex items-center gap-1">
              {product.stock > 0 ? (
                <>
                  <CheckCircle size={13} className="text-emerald-600" />
                  <span className="text-emerald-700 font-black">
                    {product.stock < 10 ? `Only ${product.stock} left!` : 'In Stock'}
                  </span>
                </>
              ) : (
                <span className="text-red-500 font-black">Out of Stock</span>
              )}
            </div>
            {product.weight_grams && (
              <div className="flex items-center gap-1">
                <Tag size={11} className="text-gray-400" /> {product.weight_grams}ml
              </div>
            )}
          </div>

          {product.stock > 0 && (
            <div className="flex items-center justify-between border border-gray-100 rounded-2xl p-2.5 bg-white shadow-xs max-w-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1.5">Qty</span>
                <div className="flex items-center border border-gray-50 rounded-xl overflow-hidden bg-gray-50/50 ml-1">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-2.5 py-1.5 text-gray-400 hover:text-black" disabled={qty <= 1}>
                    <Minus size={11} />
                  </button>
                  <span className="px-2.5 py-1.5 text-xs font-black text-black border-x border-gray-50 bg-white min-w-[28px] text-center">
                    {qty}
                  </span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-2.5 py-1.5 text-gray-400 hover:text-black" disabled={qty >= product.stock}>
                    <Plus size={11} />
                  </button>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mr-1.5">
                Total: <strong className="text-[#93731e] text-xs font-black ml-1">₹{(product.price * qty).toFixed(0)}</strong>
              </span>
            </div>
          )}

          {/* ===== CALL TO ACTION FOOTER DECK (MATCHES CART BUTTON FRAMEWORDS) ===== */}
          <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
            <button onClick={handleAddToCart} disabled={product.stock === 0}
              className="flex-1 inline-flex items-center justify-center py-3.5 px-4 rounded-xl border border-gray-100 font-black text-xs uppercase tracking-widest text-gray-500 hover:text-black hover:bg-gray-50 transition-all active:scale-[0.99] disabled:opacity-50 gap-2">
              <ShoppingCart size={13} /> Add to Cart
            </button>
            <button onClick={handleBuyNow} disabled={product.stock === 0}
              className="flex-1 inline-flex items-center justify-center py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-widest text-white transition-all active:scale-[0.98] bg-[#0f1a0e] shadow-xs shadow-black/10 disabled:opacity-50 gap-2">
              <Zap size={13} /> Buy Now
            </button>
          </div>

          <a href={`https://wa.me/919921297518?text=Hi! I want to order: ${product.name} (₹${product.price}) — Qty: ${qty}`}
            target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-1.5 max-w-xl py-3 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100 bg-emerald-50/40 text-emerald-700 transition-colors hover:bg-emerald-50">
            <Phone size={13} /> Order via WhatsApp
          </a>

          <div className="grid grid-cols-2 gap-2 pt-1 max-w-xl">
            {[
              { icon: <Truck size={13} />, text: 'Free delivery all orders' },
              { icon: <Shield size={13} />, text: '100% natural formula' },
              { icon: <RefreshCw size={13} />, text: '7-day easy return' },
              { icon: <Shield size={13} />, text: 'Online payment only' },
              { icon: <Clock size={13} />, text: 'Ships within 24 hours' },
              { icon: <Award size={13} />, text: 'Certified pure batch' },
            ].map(c => (
              <div key={c.text} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-2.5 rounded-xl border border-gray-50 bg-gray-50/40 text-gray-400">
                <span style={{ color: '#93731e' }}>{c.icon}</span>
                <span className="truncate">{c.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== LOWER ACCORDION & EDITORIAL SPECIFICATION AREA ===== */}
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-10">
        <div>
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3 pl-1">Product Specifications</h2>
          <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm">
            <Accordion title="Usage Instructions" icon={<Leaf size={14} />} defaultOpen>
              <div className="flex flex-col gap-3">
                {(product.usage_instructions || 'Apply sufficient oil on affected area. Massage gently for 10–15 minutes. Use twice daily.')
                  .split('. ')
                  .filter(Boolean)
                  .map((step, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                     
                      <span className="leading-relaxed">{step.trim()}{step.trim().endsWith('.') ? '' : '.'}</span>
                    </div>
                  ))
                }
              </div>
            </Accordion>

            {product.ingredients && (
              <Accordion title="Ingredients" icon={<Leaf size={14} />}>
                <div className="flex items-start gap-2">
                  <Leaf size={12} className="mt-0.5 flex-shrink-0 text-[#93731e]" />
                  <span>{product.ingredients}</span>
                </div>
              </Accordion>
            )}

            <Accordion title="Delivery Information" icon={<Truck size={14} />}>
              <div className="flex flex-col gap-2.5">
                {[
                  { icon: <Truck size={12} />, text: 'Standard delivery: 3–7 business days across India' },
                  { icon: <Package size={12} />, text: 'Free delivery on all orders' },
                  { icon: <Clock size={12} />, text: 'Orders shipped within 24 hours of payment verification' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0 text-[#93731e]">{item.icon}</span>
                    <span className="leading-snug">{item.text}</span>
                  </div>
                ))}
              </div>
            </Accordion>

            <Accordion title="Return & Refund Policy" icon={<RefreshCw size={14} />}>
              <div className="flex flex-col gap-2 font-semibold">
                <p>• Returns accepted within <strong className="text-black font-black">7 days</strong> of delivery for unused, sealed products</p>
                <p>• Refund processed in <strong className="text-black font-black">5–7 business days</strong> to original payment method</p>
                <p>• WhatsApp us at <a href="https://wa.me/919921297518" className="underline text-emerald-700 font-bold">+91 99212 97518</a> to initiate returns</p>
              </div>
            </Accordion>

            <Accordion title="Payment Options (Online Only)" icon={<Shield size={14} />} defaultOpen>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {paymentMethods.map(m => (
                  <div key={m.name} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest p-2 rounded-xl border border-gray-50 bg-gray-50/30">
                    {m.icon}
                    <span className="truncate text-gray-500">{m.name}</span>
                  </div>
                ))}
              </div>
            </Accordion>
          </div>
        </div>

        {/* ===== CUSTOMER APPRAISAL REVIEWS COLUMN ===== */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3 pl-1">
            Customer Reviews {reviews.length > 0 && `(${reviews.length})`}
          </h2>

          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 p-8 text-center bg-white shadow-sm">
              <Star size={24} className="mx-auto mb-2 text-gray-200" />
              <p className="font-black uppercase tracking-widest text-xs text-gray-400 mb-1">No reviews yet</p>
              <p className="text-[10px] font-semibold text-gray-300">Be the first to review this formulation!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {avgRating && (
                <div className="rounded-2xl border border-gray-100 p-4 flex items-center gap-5 bg-white shadow-sm">
                  <div className="text-center shrink-0 border-r border-gray-50 pr-4">
                    <div className="text-3xl font-black text-[#93731e] leading-none mb-1">{avgRating}</div>
                    <StarRating rating={Math.round(parseFloat(avgRating))} size={10} />
                    <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1.5">{reviews.length} reviews</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    {[5, 4, 3, 2, 1].map(star => {
                      const count = reviews.filter(r => r.rating === star).length
                      const pct = (count / reviews.length) * 100
                      return (
                        <div key={star} className="flex items-center gap-2 mb-1 last:mb-0">
                          <span className="text-[10px] font-bold text-gray-400 w-2 text-right">{star}</span>
                          <div className="flex-1 h-1 rounded-full bg-gray-50 border border-gray-100">
                            <div className="h-full rounded-full transition-all bg-[#93731e]" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-gray-300 w-3">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-1">
                {reviews.map(r => (
                  <div key={r.id} className="rounded-2xl border border-gray-100 p-4 bg-white shadow-sm space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-[10px] font-black uppercase tracking-wider shrink-0 bg-[#0f1a0e]">
                          {r.reviewer_name[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-black truncate leading-tight">{r.reviewer_name}</p>
                          <StarRating rating={r.rating} size={10} />
                        </div>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-350 shrink-0 mt-0.5">
                        {new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    {r.comment && (
                      <p className="text-xs font-semibold leading-relaxed text-gray-400 pl-9">
                        "{r.comment}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-4">
            <ReviewForm productId={product.id} />
          </div>
        </div>
      </div>

      {/* ===== FOOTER: RELATED CROSS-SELL INTERFACES ===== */}
      {related.length > 0 && (
        <footer className="max-w-5xl mx-auto px-4 border-t border-gray-100 pt-8">
          <div className="flex items-center justify-between mb-4 pl-1">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-500">You May Also Like</h2>
            <Link href="/products" className="text-xs font-black uppercase tracking-widest text-[#93731e] hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </footer>
      )}
    </div>
  )
}