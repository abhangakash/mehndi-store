'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Star } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function ProductCard({ product, displayName, displayDescription, hideDiscountBadge }) {
  const addItem = useCartStore(s => s.addItem)
  const [ratingStats, setRatingStats] = useState({ avg: 0, count: 0 })

  // Fetch real review ratings for this specific product
  useEffect(() => {
    async function fetchProductReviews() {
      if (!product?.id) return
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('rating')
          .eq('product_id', product.id)

        if (!error && data && data.length > 0) {
          const total = data.reduce((acc, r) => acc + (r.rating || 0), 0)
          const avg = (total / data.length).toFixed(1)
          setRatingStats({ avg, count: data.length })
        }
      } catch (err) {
        console.error('Error fetching product rating stats:', err)
      }
    }
    fetchProductReviews()
  }, [product?.id])
  
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : null

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation() // Prevents the link from firing when clicking the button
    addItem(product)
    toast.success(`${product.name} added!`, { 
      icon: '🦀', 
      style: { borderRadius: '10px', fontSize: '14px' } 
    })
  }

  return (
    <Link href={`/products/${product.slug}`} className="block group h-full">
      <div className="card overflow-hidden transition-all duration-200 hover:shadow-md h-full flex flex-col bg-white border border-gray-100 rounded-xl">
        
        {/* Image Container - Responsive Height */}
        <div className="relative h-44 md:h-60 lg:h-90 w-full overflow-hidden bg-[var(--brand-surface)]">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl sm:text-5xl">🦀</div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount && !hideDiscountBadge && (
              <span className="badge badge-brown text-[10px] sm:text-xs px-2 py-0.5 shadow-sm">
                {discount}% OFF
              </span>
            )}
          </div>

          {product.stock < 10 && product.stock > 0 && (
            <span className="absolute top-2 right-2 badge badge-red text-[10px] sm:text-xs px-2 py-0.5">
              Only {product.stock}
            </span>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[1px]">
              <span className="text-xs font-bold text-gray-600 uppercase">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          <p className="text-[10px] sm:text-xs mb-1 font-medium uppercase tracking-wider" style={{ color: 'var(--brand-muted)' }}>
            {product.categories?.name || 'Ayurvedic Care'}
          </p>
          
          <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-1 sm:line-clamp-2" style={{ color: 'var(--brand-text)' }}>
            {displayName || product.name}
          </h3>

          <p className="text-[11px] sm:text-xs mb-3 line-clamp-2 flex-1 hidden xs:block" style={{ color: 'var(--brand-muted)' }}>
            {displayDescription || product.short_description}
          </p>

          {/* Real Dynamic Ratings */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
               {[1,2,3,4,5].map(s => (
                 <Star 
                   key={s} 
                   size={10} 
                   fill={s <= Math.round(ratingStats.avg) ? '#93731e' : 'none'} 
                   color="#93731e" 
                 />
               ))}
            </div>
            <span className="text-[10px] sm:text-xs ml-1 font-bold" style={{ color: 'var(--brand-text)' }}>
              {ratingStats.count > 0 ? `${ratingStats.avg} (${ratingStats.count})` : 'No reviews'}
            </span>
          </div>

          {/* Pricing & Button */}
          <div className="flex items-center justify-between mt-auto gap-2">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
              <span className="font-bold text-sm sm:text-base" style={{ color: 'var(--brand-brown)' }}>₹{product.price}</span>
              {product.original_price && (
                <span className="text-[10px] sm:text-xs line-through opacity-60" style={{ color: 'var(--brand-muted)' }}>₹{product.original_price}</span>
              )}
            </div>
            
            <button 
              onClick={handleAddToCart} 
              disabled={product.stock === 0}
              className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold px-3 py-2 rounded-lg transition-all active:scale-95 shrink-0"
              style={{ 
                backgroundColor: product.stock === 0 ? '#e5e7eb' : 'var(--brand-green)', 
                color: product.stock === 0 ? '#9ca3af' : 'white' 
              }}>
              <ShoppingCart size={14} className="sm:w-[13px]" /> 
              <span className="hidden xs:inline">Add</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}