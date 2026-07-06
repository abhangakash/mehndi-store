'use client'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'

export default function BuyNowButton({ product, className }) {
  const router = useRouter()
  const { addItem, clearCart } = useCartStore()

  const handleBuyNow = () => {
    clearCart() // ensures checkout total reflects only this product
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
      short_description: product.short_description,
    })
    router.push('/checkout')
  }

  return (
    <button onClick={handleBuyNow} className={className}>
      BUY NOW
    </button>
  )
}