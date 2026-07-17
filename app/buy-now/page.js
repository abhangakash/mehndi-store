'use client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { supabase } from '@/lib/supabase'

// Fallback slug if the ad link doesn't specify one — defaults to the single bottle
const DEFAULT_SLUG = 'crabveda-oil'

function BuyNowInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart, addItem } = useCartStore()
  const [error, setError] = useState(null)

  useEffect(() => {
    const slug = searchParams.get('slug') || DEFAULT_SLUG

    async function loadAndRedirect() {
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (fetchError || !product) {
        console.error('Buy-now product fetch failed:', fetchError)
        setError('Product not found — redirecting to shop')
        setTimeout(() => router.replace('/products'), 1500)
        return
      }

      // Reset cart to exactly this one product, quantity 1 — this is a direct
      // "buy now" flow for ad traffic, not an add-to-existing-cart action.
      clearCart()
      addItem(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
        },
        1
      )

      // GA4 — track this as ad-driven direct checkout intent
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'select_item', {
          currency: 'INR',
          value: Number(product.price),
          items: [{ item_id: product.id.toString(), item_name: product.name, price: Number(product.price), quantity: 1 }],
        })
      }

      router.replace('/checkout')
    }

    loadAndRedirect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#0f1a0e', borderTopColor: 'transparent' }} />
        <p className="text-xs font-black uppercase tracking-widest text-gray-500">
          {error || 'Preparing your order...'}
        </p>
      </div>
    </div>
  )
}

export default function BuyNowPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#0f1a0e', borderTopColor: 'transparent' }} />
      </div>
    }>
      <BuyNowInner />
    </Suspense>
  )
}