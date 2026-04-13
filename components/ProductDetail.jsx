'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import ProductCard from './ProductCard'
import toast from 'react-hot-toast'
import { ShoppingCart, Zap, Star, ChevronDown, ChevronUp, Truck, RefreshCw, Shield, Phone, Package, CheckCircle, Leaf, Plus, Minus } from 'lucide-react'

function StarRating({ rating, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => <Star key={s} size={size} fill={s <= rating ? '#c9a84c' : 'none'} color={s <= rating ? '#c9a84c' : '#d1d5db'} />)}
    </div>
  )
}

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b" style={{ borderColor: 'var(--brand-border)' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left" style={{ color: 'var(--brand-text)' }}>
        <span className="font-medium text-sm">{title}</span>
        {open ? <ChevronUp size={16} style={{ color: 'var(--brand-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--brand-muted)' }} />}
      </button>
      {open && <div className="pb-4 text-sm leading-relaxed" style={{ color: 'var(--brand-muted)' }}>{children}</div>}
    </div>
  )
}

export default function ProductDetail({ product, reviews, related }) {
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const addItem = useCartStore(s => s.addItem)

  const images = product.images?.length ? product.images : [product.image_url].filter(Boolean)
  const discount = product.original_price ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : null
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null

  const handleAddToCart = () => { addItem(product, qty); toast.success(`${product.name} added to cart!`, { icon: '🌿' }) }
  const handleBuyNow = () => { addItem(product, qty); window.location.href = '/checkout' }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center gap-2 text-xs mb-8" style={{ color: 'var(--brand-muted)' }}>
        <Link href="/" className="hover:underline">Home</Link><span>/</span>
        <Link href="/products" className="hover:underline">Shop</Link><span>/</span>
        <span style={{ color: 'var(--brand-text)' }}>{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10 mb-14">
        <div>
          <div className="card overflow-hidden mb-3 aspect-square flex items-center justify-center" style={{ backgroundColor: 'var(--brand-surface)' }}>
            {images[activeImg] ? <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" /> : <div className="text-8xl">🌿</div>}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className="w-16 h-16 rounded-lg overflow-hidden border-2 transition-all"
                  style={{ borderColor: activeImg === i ? 'var(--brand-green)' : 'var(--brand-border)', backgroundColor: 'var(--brand-surface)' }}>
                  {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.categories && (
            <Link href={`/products?category=${product.categories.slug}`}>
              <span className="badge badge-green mb-3 inline-block">{product.categories.name}</span>
            </Link>
          )}
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--brand-text)' }}>{product.name}</h1>
          {avgRating && (
            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={Math.round(avgRating)} />
              <span className="text-sm font-medium" style={{ color: 'var(--brand-gold)' }}>{avgRating}</span>
              <span className="text-sm" style={{ color: 'var(--brand-muted)' }}>({reviews.length} reviews)</span>
            </div>
          )}
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--brand-muted)' }}>{product.description || product.short_description}</p>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl font-bold" style={{ color: 'var(--brand-brown)' }}>₹{product.price}</span>
            {product.original_price && <span className="text-lg line-through" style={{ color: 'var(--brand-muted)' }}>₹{product.original_price}</span>}
            {discount && <span className="badge badge-brown">{discount}% OFF</span>}
          </div>
          <div className="flex items-center gap-2 mb-5">
            {product.stock > 0
              ? <><CheckCircle size={15} style={{ color: '#15803d' }} /><span className="text-sm" style={{ color: '#15803d' }}>{product.stock < 10 ? `Only ${product.stock} left` : 'In Stock'}</span></>
              : <span className="badge badge-red">Out of Stock</span>}
            {product.weight_grams && <span className="text-xs ml-3" style={{ color: 'var(--brand-muted)' }}>Weight: {product.weight_grams}g</span>}
          </div>
          {product.stock > 0 && (
            <div className="flex items-center gap-3 mb-5">
              <span className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>Qty:</span>
              <div className="flex items-center border rounded-lg overflow-hidden" style={{ borderColor: 'var(--brand-border)' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-50"><Minus size={14} /></button>
                <span className="px-4 py-2 text-sm font-medium border-x" style={{ borderColor: 'var(--brand-border)' }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-3 py-2 hover:bg-gray-50"><Plus size={14} /></button>
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-secondary flex-1 justify-center" style={{ opacity: product.stock === 0 ? 0.5 : 1 }}>
              <ShoppingCart size={17} /> Add to Cart
            </button>
            <button onClick={handleBuyNow} disabled={product.stock === 0} className="btn-primary flex-1 justify-center" style={{ opacity: product.stock === 0 ? 0.5 : 1 }}>
              <Zap size={17} /> Buy Now
            </button>
          </div>
          <a href={`https://wa.me/919623740541?text=Hi! I want to order: ${product.name} (₹${product.price})`} target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium border hover:bg-green-50 mb-6"
            style={{ borderColor: '#86efac', color: '#15803d' }}>
            <Phone size={15} /> Order via WhatsApp
          </a>
          <div className="grid grid-cols-2 gap-2">
            {[{ icon: <Truck size={14} />, text: 'Free shipping ₹499+' },{ icon: <Shield size={14} />, text: '100% natural & safe' },{ icon: <RefreshCw size={14} />, text: '7-day return policy' },{ icon: <Package size={14} />, text: 'COD on ₹999+' }].map(c => (
              <div key={c.text} className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--brand-surface)', color: 'var(--brand-muted)' }}>
                <span style={{ color: 'var(--brand-green)' }}>{c.icon}</span>{c.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mb-14">
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>Product Details</h2>
        <Accordion title="Usage Instructions" defaultOpen>{product.usage_instructions || 'Apply on clean dry skin. Leave for 2-4 hours. Scrape off without water. Avoid water for 12 hours.'}</Accordion>
        {product.ingredients && <Accordion title="Ingredients"><div className="flex items-start gap-2"><Leaf size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--brand-green)' }} /><span>{product.ingredients}</span></div></Accordion>}
        <Accordion title="Delivery Information">
          <ul className="flex flex-col gap-2">
            <li className="flex items-start gap-2"><Truck size={13} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--brand-green)' }} /> Standard delivery: 3-7 business days across India</li>
            <li className="flex items-start gap-2"><Package size={13} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--brand-green)' }} /> Free shipping on orders above ₹499</li>
            <li className="flex items-start gap-2"><CheckCircle size={13} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--brand-green)' }} /> Cash on delivery on orders above ₹999</li>
          </ul>
        </Accordion>
        <Accordion title="Return & Refund Policy">
          <ul className="flex flex-col gap-2">
            <li>• Returns accepted within 7 days for unused, sealed products</li>
            <li>• Damaged or wrong product — contact within 48 hours</li>
            <li>• Refund in 5-7 business days to original payment method</li>
            <li>• WhatsApp us at +91 96237 40541 for return requests</li>
          </ul>
        </Accordion>
        <Accordion title="Payment Options">
          <ul className="flex flex-col gap-2">
            <li>• UPI (GPay, PhonePe, Paytm)</li>
            <li>• Credit / Debit Cards</li>
            <li>• Net Banking</li>
            <li>• Cash on Delivery (orders above ₹999)</li>
          </ul>
        </Accordion>
      </div>

      <div className="mb-14">
        <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--brand-text)' }}>Customer Reviews {reviews.length > 0 && `(${reviews.length})`}</h2>
        {reviews.length === 0 ? (
          <div className="card p-8 text-center"><Star size={32} className="mx-auto mb-2" style={{ color: 'var(--brand-muted)' }} /><p className="text-sm" style={{ color: 'var(--brand-muted)' }}>No reviews yet.</p></div>
        ) : (
          <div className="flex flex-col gap-4">
            {avgRating && (
              <div className="card p-5 flex items-center gap-6 mb-2">
                <div className="text-center">
                  <div className="text-4xl font-bold" style={{ color: 'var(--brand-brown)' }}>{avgRating}</div>
                  <StarRating rating={Math.round(avgRating)} />
                  <div className="text-xs mt-1" style={{ color: 'var(--brand-muted)' }}>{reviews.length} reviews</div>
                </div>
                <div className="flex-1">
                  {[5,4,3,2,1].map(star => {
                    const count = reviews.filter(r => r.rating === star).length
                    const pct = reviews.length ? (count / reviews.length) * 100 : 0
                    return (
                      <div key={star} className="flex items-center gap-2 mb-1">
                        <span className="text-xs w-3" style={{ color: 'var(--brand-muted)' }}>{star}</span>
                        <Star size={11} fill="#c9a84c" color="#c9a84c" />
                        <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'var(--brand-border)' }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: '#c9a84c' }} />
                        </div>
                        <span className="text-xs w-4 text-right" style={{ color: 'var(--brand-muted)' }}>{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            {reviews.map(r => (
              <div key={r.id} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div><p className="font-medium text-sm" style={{ color: 'var(--brand-text)' }}>{r.reviewer_name}</p><StarRating rating={r.rating} size={13} /></div>
                  <span className="text-xs" style={{ color: 'var(--brand-muted)' }}>{new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                {r.comment && <p className="text-sm leading-relaxed" style={{ color: 'var(--brand-muted)' }}>{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {related.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--brand-text)' }}>You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}