import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import { Filter } from 'lucide-react'

async function getProducts(category) {
  let query = supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  const { data } = await query
  if (category) return (data || []).filter(p => p.categories?.slug === category)
  return data || []
}

async function getCategories() {
  const { data } = await supabase.from('categories').select('*')
  return data || []
}

export default async function ProductsPage({ searchParams }) {
  const category = searchParams?.category || ''
  const [products, categories] = await Promise.all([getProducts(category), getCategories()])
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="section-title">Our Products</h1>
        <p className="section-subtitle">Premium henna products for every occasion</p>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-52 flex-shrink-0">
          <div className="card p-4 sticky top-20">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={15} style={{ color: 'var(--brand-green)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>Categories</span>
            </div>
            <div className="flex flex-col gap-1">
              <a href="/products" className="text-sm px-3 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: !category ? 'var(--brand-green)' : 'transparent', color: !category ? 'white' : 'var(--brand-muted)' }}>
                All Products
              </a>
              {categories.map(cat => (
                <a key={cat.id} href={`/products?category=${cat.slug}`}
                  className="text-sm px-3 py-2 rounded-lg transition-colors"
                  style={{ backgroundColor: category === cat.slug ? 'var(--brand-green)' : 'transparent', color: category === cat.slug ? 'white' : 'var(--brand-muted)' }}>
                  {cat.name}
                </a>
              ))}
            </div>
          </div>
        </aside>
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-lg mb-2" style={{ color: 'var(--brand-text)' }}>No products found</p>
              <p className="text-sm" style={{ color: 'var(--brand-muted)' }}>Try a different category</p>
            </div>
          ) : (
            <>
              <p className="text-sm mb-4" style={{ color: 'var(--brand-muted)' }}>{products.length} products found</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
