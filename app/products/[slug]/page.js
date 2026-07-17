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
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} — CrabVeda`,
    description: product.short_description,
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()
  const [reviews, related] = await Promise.all([
    getReviews(product.id),
    getRelated(product.category_id, product.id),
  ])
  return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",

          name: product.name,

          image: product.images?.length
            ? product.images
            : [product.image_url],

          description:
            product.description || product.short_description,

          brand: {
            "@type": "Brand",
            name: "CrabVeda",
          },

          sku: product.id,

          offers: {
            "@type": "Offer",
            url: `https://www.crabveda.com/products/${product.slug}`,
            priceCurrency: "INR",
            price: product.price,
            availability:
              product.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          },

          ...(reviews.length > 0 && {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue:
                reviews.reduce((sum, r) => sum + r.rating, 0) /
                reviews.length,
              reviewCount: reviews.length,
            },

            review: reviews.map((r) => ({
              "@type": "Review",
              author: {
                "@type": "Person",
                name: r.reviewer_name,
              },
              reviewRating: {
                "@type": "Rating",
                ratingValue: r.rating,
              },
              reviewBody: r.comment,
            })),
          }),
        }),
      }}
    />

    <ProductDetail
      product={product}
      reviews={reviews}
      related={related}
    />
  </>
)
}