'use client'
import Link from 'next/link'
import { ShoppingCart, Star } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const addItem = useCartStore(s => s.addItem)
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : null

  const handleAddToCart = (e) => {
    e.preventDefault()
    addItem(product)
    toast.success(`${product.name} added to cart!`, { icon: '🌿', style: { borderRadius: '10px', fontSize: '14px' } })
  }

  return (
    <Link href={`/products/${product.slug}`} className="block group">
      <div className="card overflow-hidden transition-all duration-200 hover:shadow-md h-full flex flex-col">
        <div className="relative h-52 overflow-hidden" style={{ backgroundColor: 'var(--brand-surface)' }}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">🌿</div>
          )}
          {discount && <span className="absolute top-2 left-2 badge badge-brown text-xs">{discount}% OFF</span>}
          {product.stock < 10 && product.stock > 0 && (
            <span className="absolute top-2 right-2 badge badge-red text-xs">Only {product.stock} left</span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-500">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <p className="text-xs mb-1" style={{ color: 'var(--brand-muted)' }}>{product.categories?.name || 'Mehndi Product'}</p>
          <h3 className="font-medium text-sm mb-1 line-clamp-2" style={{ color: 'var(--brand-text)' }}>{product.name}</h3>
          <p className="text-xs mb-3 line-clamp-2 flex-1" style={{ color: 'var(--brand-muted)' }}>{product.short_description}</p>
          <div className="flex items-center gap-1 mb-3">
            {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="#c9a84c" color="#c9a84c" />)}
            <span className="text-xs ml-1" style={{ color: 'var(--brand-muted)' }}>(4.8)</span>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <div>
              <span className="font-semibold" style={{ color: 'var(--brand-brown)' }}>₹{product.price}</span>
              {product.original_price && (
                <span className="text-xs line-through ml-1.5" style={{ color: 'var(--brand-muted)' }}>₹{product.original_price}</span>
              )}
            </div>
            <button onClick={handleAddToCart} disabled={product.stock === 0}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
              style={{ backgroundColor: product.stock === 0 ? '#e5e7eb' : 'var(--brand-green)', color: product.stock === 0 ? '#9ca3af' : 'white' }}>
              <ShoppingCart size={13} /> Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}