// import { supabase } from '@/lib/supabase'
// import { notFound } from 'next/navigation'
// import ProductDetail from '@/components/ProductDetail'

// async function getProduct(slug) {
//   const { data } = await supabase
//     .from('products')
//     .select('*, categories(name, slug)')
//     .eq('slug', slug)
//     .eq('is_active', true)
//     .single()
//   return data
// }

// async function getReviews(productId) {
//   const { data } = await supabase
//     .from('reviews')
//     .select('*')
//     .eq('product_id', productId)
//     .eq('is_approved', true)
//     .order('created_at', { ascending: false })
//   return data || []
// }

// async function getRelated(categoryId, currentId) {
//   const { data } = await supabase
//     .from('products')
//     .select('*, categories(name)')
//     .eq('category_id', categoryId)
//     .eq('is_active', true)
//     .neq('id', currentId)
//     .limit(4)
//   return data || []
// }

// export async function generateMetadata({ params }) {
//   const product = await getProduct(params.slug)
//   if (!product) return { title: 'Product Not Found' }
//   return {
//     title: `${product.name} — Shrilekha Mehndi Art`,
//     description: product.short_description,
//   }
// }

// export default async function ProductPage({ params }) {
//   const product = await getProduct(params.slug)
//   if (!product) notFound()
//   const [reviews, related] = await Promise.all([
//     getReviews(product.id),
//     getRelated(product.category_id, product.id),
//   ])
//   return <ProductDetail product={product} reviews={reviews} related={related} />
// }
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ProductDetail from '@/components/ProductDetail'

async function getProduct(slug) {
  const { data } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  return data
}

async function getReviews(productId) {
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  return data || []
}

async function getRelated(categoryId, currentId) {
  const { data } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .neq('id', currentId)
    .limit(4)

  return data || []
}

export async function generateMetadata({ params }) {
  const { slug } = await params   // ✅ FIX

  const product = await getProduct(slug)

  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: `${product.name} — Shrilekha Mehndi Art`,
    description: product.short_description,
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params   // ✅ FIX

  const product = await getProduct(slug)

  if (!product) notFound()

  const [reviews, related] = await Promise.all([
    getReviews(product.id),
    getRelated(product.category_id, product.id),
  ])

  return (
    <ProductDetail
      product={product}
      reviews={reviews}
      related={related}
    />
  )
}