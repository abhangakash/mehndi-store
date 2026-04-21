'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import ProductCard from './ProductCard'
import toast from 'react-hot-toast'
import {
  ShoppingCart, Zap, Star, ChevronDown, ChevronUp,
  Truck, RefreshCw, Shield, Phone, Package,
  CheckCircle, Leaf, Plus, Minus, Heart, Share2,
  Tag, Clock, Award, MapPin
} from 'lucide-react'

function StarRating({ rating, size = 16, interactive = false, onRate }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button"
          onClick={() => interactive && onRate && onRate(s)}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}>
          <Star size={size}
            fill={s <= (hover || rating) ? '#c9a84c' : 'none'}
            color={s <= (hover || rating) ? '#c9a84c' : '#d1d5db'} />
        </button>
      ))}
    </div>
  )
}

function Accordion({ title, icon, children, defaultOpen = false, badge }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b" style={{ borderColor: 'var(--brand-border)' }}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-3">
        <div className="flex items-center gap-2.5">
          {icon && <span style={{ color: 'var(--brand-green)' }}>{icon}</span>}
          <span className="font-medium text-sm" style={{ color: 'var(--brand-text)' }}>{title}</span>
          {badge && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>{badge}</span>
          )}
        </div>
        {open
          ? <ChevronUp size={16} style={{ color: 'var(--brand-muted)', flexShrink: 0 }} />
          : <ChevronDown size={16} style={{ color: 'var(--brand-muted)', flexShrink: 0 }} />}
      </button>
      {open && (
        <div className="pb-5 text-sm leading-relaxed" style={{ color: 'var(--brand-muted)' }}>
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
      icon: '🌿',
      style: { borderRadius: '10px', fontSize: '14px' },
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs mb-6 flex-wrap" style={{ color: 'var(--brand-muted)' }}>
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:underline">Shop</Link>
        {product.categories && (
          <>
            <span>/</span>
            <Link href={`/products?category=${product.categories.slug}`} className="hover:underline">
              {product.categories.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span style={{ color: 'var(--brand-text)' }} className="truncate max-w-32">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12">
        {/* ===== IMAGE SECTION ===== */}
        <div className="flex flex-col gap-3">
          {/* Main image */}
          <div className="card overflow-hidden relative group"
            style={{ backgroundColor: 'var(--brand-surface)', aspectRatio: '1/1' }}>
            {images[activeImg] ? (
              <img src={images[activeImg]} alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-9xl">🌿</span>
              </div>
            )}
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {discount && (
                <span className="badge badge-brown text-xs font-semibold">
                  {discount}% OFF
                </span>
              )}
              {product.is_featured && (
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold text-white"
                  style={{ backgroundColor: 'var(--brand-gold)' }}>
                  ⭐ Featured
                </span>
              )}
            </div>
            {product.stock === 0 && (
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}>
                <span className="font-semibold px-4 py-2 rounded-lg bg-white shadow text-sm"
                  style={{ color: 'var(--brand-muted)' }}>Out of Stock</span>
              </div>
            )}
            {/* Share + wishlist */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <button onClick={handleShare}
                className="w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors">
                <Share2 size={15} style={{ color: 'var(--brand-muted)' }} />
              </button>
              <button onClick={() => { setWishlisted(!wishlisted); toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist') }}
                className="w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors">
                <Heart size={15} fill={wishlisted ? '#ef4444' : 'none'} color={wishlisted ? '#ef4444' : 'var(--brand-muted)'} />
              </button>
            </div>
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className="w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0"
                  style={{
                    borderColor: activeImg === i ? 'var(--brand-green)' : 'var(--brand-border)',
                    backgroundColor: 'var(--brand-surface)',
                  }}>
                  {img
                    ? <img src={img} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ===== PRODUCT INFO ===== */}
        <div className="flex flex-col gap-4">
          {/* Category + name */}
          {product.categories && (
            <Link href={`/products?category=${product.categories.slug}`}>
              <span className="badge badge-green">{product.categories.name}</span>
            </Link>
          )}

          <h1 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: 'var(--brand-text)' }}>
            {product.name}
          </h1>

          {/* Rating row */}
          <div className="flex items-center gap-3 flex-wrap">
            {avgRating ? (
              <>
                <StarRating rating={Math.round(parseFloat(avgRating))} size={15} />
                <span className="text-sm font-semibold" style={{ color: '#c9a84c' }}>{avgRating}</span>
                <span className="text-sm" style={{ color: 'var(--brand-muted)' }}>
                  ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                </span>
              </>
            ) : (
              <span className="text-xs" style={{ color: 'var(--brand-muted)' }}>No reviews yet — be the first!</span>
            )}
          </div>

          {/* Short description */}
          <p className="text-sm leading-relaxed" style={{ color: 'var(--brand-muted)' }}>
            {product.short_description || product.description}
          </p>

          {/* Price */}
          <div className="flex items-center gap-3 py-3 border-y" style={{ borderColor: 'var(--brand-border)' }}>
            <span className="text-3xl font-bold" style={{ color: 'var(--brand-brown)' }}>
              ₹{product.price}
            </span>
            {product.original_price && (
              <>
                <span className="text-lg line-through" style={{ color: 'var(--brand-muted)' }}>
                  ₹{product.original_price}
                </span>
                <span className="badge badge-brown font-semibold">{discount}% OFF</span>
              </>
            )}
          </div>

          {/* Stock + weight */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              {product.stock > 0 ? (
                <>
                  <CheckCircle size={15} style={{ color: '#15803d' }} />
                  <span className="text-sm font-medium" style={{ color: '#15803d' }}>
                    {product.stock < 10 ? `Only ${product.stock} left!` : 'In Stock'}
                  </span>
                </>
              ) : (
                <span className="badge badge-red">Out of Stock</span>
              )}
            </div>
            {product.weight_grams && (
              <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--brand-muted)' }}>
                <Tag size={12} /> {product.weight_grams}g
              </div>
            )}
            {product.stock < 10 && product.stock > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full animate-pulse"
                style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                🔥 Almost gone!
              </span>
            )}
          </div>

          {/* Quantity selector */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>Quantity</span>
              <div className="flex items-center border rounded-lg overflow-hidden"
                style={{ borderColor: 'var(--brand-border)' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-3.5 py-2.5 hover:bg-gray-50 transition-colors"
                  disabled={qty <= 1}>
                  <Minus size={14} style={{ color: qty <= 1 ? '#d1d5db' : 'var(--brand-text)' }} />
                </button>
                <span className="px-5 py-2.5 text-sm font-semibold border-x"
                  style={{ borderColor: 'var(--brand-border)', color: 'var(--brand-text)' }}>
                  {qty}
                </span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  className="px-3.5 py-2.5 hover:bg-gray-50 transition-colors"
                  disabled={qty >= product.stock}>
                  <Plus size={14} style={{ color: qty >= product.stock ? '#d1d5db' : 'var(--brand-text)' }} />
                </button>
              </div>
              <span className="text-xs" style={{ color: 'var(--brand-muted)' }}>
                Total: <strong style={{ color: 'var(--brand-brown)' }}>₹{(product.price * qty).toFixed(0)}</strong>
              </span>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button onClick={handleAddToCart} disabled={product.stock === 0}
              className="btn-secondary flex-1 justify-center py-3 text-sm"
              style={{ opacity: product.stock === 0 ? 0.5 : 1 }}>
              <ShoppingCart size={17} /> Add to Cart
            </button>
            <button onClick={handleBuyNow} disabled={product.stock === 0}
              className="btn-primary flex-1 justify-center py-3 text-sm"
              style={{ opacity: product.stock === 0 ? 0.5 : 1 }}>
              <Zap size={17} /> Buy Now
            </button>
          </div>

          {/* WhatsApp order */}
          <a href={`https://wa.me/919623740541?text=Hi! I want to order: ${product.name} (₹${product.price}) — Qty: ${qty}`}
            target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-green-50"
            style={{ borderColor: '#86efac', color: '#15803d' }}>
            <Phone size={15} /> Order via WhatsApp
          </a>

          {/* Trust grid */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {[
              { icon: <Truck size={14} />, text: 'Free shipping ₹499+' },
              { icon: <Shield size={14} />, text: '100% natural & safe' },
              { icon: <RefreshCw size={14} />, text: '7-day easy return' },
              { icon: <Package size={14} />, text: 'COD on ₹999+' },
              { icon: <Clock size={14} />, text: 'Ships in 24 hours' },
              { icon: <Award size={14} />, text: 'Certified quality' },
            ].map(c => (
              <div key={c.text} className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg"
                style={{ backgroundColor: 'var(--brand-surface)', color: 'var(--brand-muted)' }}>
                <span style={{ color: 'var(--brand-green)' }}>{c.icon}</span>
                {c.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== ACCORDION DETAILS ===== */}
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-14">
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>Product Details</h2>
          <div className="card overflow-hidden">
            <Accordion title="Usage Instructions" icon={<Leaf size={16} />} defaultOpen>
              <div className="flex flex-col gap-2">
                {(product.usage_instructions || 'Apply on clean dry skin. Leave for 2–4 hours for best results. Scrape off without water. Avoid contact with water for 12 hours after removal for darkest color.')
                  .split('. ')
                  .filter(Boolean)
                  .map((step, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5 text-white"
                        style={{ backgroundColor: 'var(--brand-green)' }}>
                        {i + 1}
                      </span>
                      <span>{step.trim()}{step.trim().endsWith('.') ? '' : '.'}</span>
                    </div>
                  ))
                }
              </div>
            </Accordion>

            {product.ingredients && (
              <Accordion title="Ingredients" icon={<Leaf size={16} />}>
                <div className="flex items-start gap-2">
                  <Leaf size={13} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--brand-green)' }} />
                  <span>{product.ingredients}</span>
                </div>
              </Accordion>
            )}

            <Accordion title="Delivery Information" icon={<Truck size={16} />}>
              <div className="flex flex-col gap-3">
                {[
                  { icon: <Truck size={13} />, text: 'Standard delivery: 3–7 business days across India' },
                  { icon: <MapPin size={13} />, text: 'Pune delivery: 1–2 business days' },
                  { icon: <Package size={13} />, text: 'Free shipping on orders above ₹499' },
                  { icon: <CheckCircle size={13} />, text: 'COD available on orders above ₹999' },
                  { icon: <Clock size={13} />, text: 'Orders shipped within 24 hours of payment' },
                ].map(i => (
                  <div key={i.text} className="flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0" style={{ color: 'var(--brand-green)' }}>{i.icon}</span>
                    <span>{i.text}</span>
                  </div>
                ))}
              </div>
            </Accordion>

            <Accordion title="Return & Refund Policy" icon={<RefreshCw size={16} />}>
              <div className="flex flex-col gap-2">
                <p>• Returns accepted within <strong>7 days</strong> of delivery for unused, sealed products</p>
                <p>• Damaged or wrong item — contact us within <strong>48 hours</strong> with photos</p>
                <p>• Refund processed in <strong>5–7 business days</strong> to original payment method</p>
                <p>• WhatsApp us at <a href="https://wa.me/919623740541" className="underline" style={{ color: 'var(--brand-green)' }}>+91 96237 40541</a> to initiate returns</p>
              </div>
            </Accordion>

            <Accordion title="Payment Options" icon={<Shield size={16} />}>
              <div className="grid grid-cols-2 gap-2">
                {['UPI / GPay', 'PhonePe', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallets', 'Cash on Delivery', 'WhatsApp Order'].map(m => (
                  <div key={m} className="flex items-center gap-1.5 text-xs p-2 rounded-lg"
                    style={{ backgroundColor: 'var(--brand-surface)' }}>
                    <CheckCircle size={11} style={{ color: 'var(--brand-green)' }} /> {m}
                  </div>
                ))}
              </div>
            </Accordion>
          </div>
        </div>

        {/* ===== REVIEWS ===== */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--brand-text)' }}>
              Customer Reviews
              {reviews.length > 0 && (
                <span className="ml-2 text-sm font-normal" style={{ color: 'var(--brand-muted)' }}>
                  ({reviews.length})
                </span>
              )}
            </h2>
          </div>

          {reviews.length === 0 ? (
            <div className="card p-8 text-center">
              <Star size={32} className="mx-auto mb-2" style={{ color: '#e5e7eb' }} />
              <p className="font-medium mb-1 text-sm" style={{ color: 'var(--brand-text)' }}>No reviews yet</p>
              <p className="text-xs" style={{ color: 'var(--brand-muted)' }}>Be the first to review this product!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Rating summary */}
              {avgRating && (
                <div className="card p-5 flex items-center gap-5">
                  <div className="text-center">
                    <div className="text-4xl font-bold" style={{ color: 'var(--brand-brown)' }}>{avgRating}</div>
                    <StarRating rating={Math.round(parseFloat(avgRating))} size={13} />
                    <div className="text-xs mt-1" style={{ color: 'var(--brand-muted)' }}>{reviews.length} reviews</div>
                  </div>
                  <div className="flex-1">
                    {[5,4,3,2,1].map(star => {
                      const count = reviews.filter(r => r.rating === star).length
                      const pct = (count / reviews.length) * 100
                      return (
                        <div key={star} className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs w-3 text-right" style={{ color: 'var(--brand-muted)' }}>{star}</span>
                          <Star size={10} fill="#c9a84c" color="#c9a84c" />
                          <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'var(--brand-border)' }}>
                            <div className="h-full rounded-full transition-all"
                              style={{ width: `${pct}%`, backgroundColor: '#c9a84c' }} />
                          </div>
                          <span className="text-xs w-4" style={{ color: 'var(--brand-muted)' }}>{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Review cards */}
              {reviews.map(r => (
                <div key={r.id} className="card p-4">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                        style={{ backgroundColor: 'var(--brand-green)' }}>
                        {r.reviewer_name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--brand-text)' }}>{r.reviewer_name}</p>
                        <StarRating rating={r.rating} size={11} />
                      </div>
                    </div>
                    <span className="text-xs flex-shrink-0" style={{ color: 'var(--brand-muted)' }}>
                      {new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  {r.comment && (
                    <p className="text-sm leading-relaxed mt-2 pl-10" style={{ color: 'var(--brand-muted)' }}>
                      "{r.comment}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== RELATED PRODUCTS ===== */}
      {related.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--brand-text)' }}>You May Also Like</h2>
            <Link href="/products" className="text-sm font-medium flex items-center gap-1"
              style={{ color: 'var(--brand-green)' }}>
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}