import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import { Filter } from 'lucide-react'

async function getProducts(category) {
  const { data } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  if (category) return (data || []).filter(p => p.categories?.slug === category)
  return data || []
}

async function getCategories() {
  const { data } = await supabase.from('categories').select('*')
  return data || []
}

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams
  const category = params?.category || ''
  const [products, categories] = await Promise.all([getProducts(category), getCategories()])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="section-title">Our Products</h1>
        <p className="section-subtitle">Premium henna products for every occasion</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar — horizontal scroll on mobile */}
        <aside className="md:w-52 flex-shrink-0">
          <div className="card p-3 md:p-4 md:sticky md:top-20">
            <div className="flex items-center gap-2 mb-3">
              <Filter size={15} style={{ color: 'var(--brand-green)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>Categories</span>
            </div>
            {/* Horizontal scroll on mobile, vertical on desktop */}
            <div className="flex flex-row md:flex-col gap-2 md:gap-1 overflow-x-auto pb-1 md:pb-0">
              <a href="/products"
                className="text-sm px-3 py-2 rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
                style={{
                  backgroundColor: !category ? 'var(--brand-green)' : 'transparent',
                  color: !category ? 'white' : 'var(--brand-muted)',
                  border: !category ? 'none' : '1px solid var(--brand-border)',
                }}>
                All Products
              </a>
              {categories.map(cat => (
                <a key={cat.id} href={`/products?category=${cat.slug}`}
                  className="text-sm px-3 py-2 rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
                  style={{
                    backgroundColor: category === cat.slug ? 'var(--brand-green)' : 'transparent',
                    color: category === cat.slug ? 'white' : 'var(--brand-muted)',
                    border: category === cat.slug ? 'none' : '1px solid var(--brand-border)',
                  }}>
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
              <p className="text-sm mb-4" style={{ color: 'var(--brand-muted)' }}>
                {products.length} product{products.length !== 1 ? 's' : ''} found
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}