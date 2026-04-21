'use client'
import { useState, useMemo } from 'react'
import ProductCard from './ProductCard'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
]

export default function ProductsClient({ products, categories, initialCategory }) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(initialCategory || '')
  const [sort, setSort] = useState('default')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let result = [...products]
    if (activeCategory) result = result.filter(p => p.categories?.slug === activeCategory)
    if (search.trim()) result = result.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.short_description?.toLowerCase().includes(search.toLowerCase())
    )
    if (sort === 'price-low') result.sort((a, b) => a.price - b.price)
    if (sort === 'price-high') result.sort((a, b) => b.price - a.price)
    if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name))
    return result
  }, [products, activeCategory, search, sort])

  const clearFilters = () => { setSearch(''); setActiveCategory(''); setSort('default') }
  const hasFilters = search || activeCategory || sort !== 'default'

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="section-title">Our Products</h1>
        <p className="section-subtitle">Premium natural henna products for every occasion</p>
      </div>

      {/* Search + controls bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--brand-muted)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            style={{ paddingLeft: '2.5rem', paddingRight: search ? '2.5rem' : '1rem' }}
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--brand-muted)' }}>
              <X size={15} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative sm:w-44">
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="appearance-none pr-8 cursor-pointer"
            style={{ paddingRight: '2rem' }}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--brand-muted)' }} />
        </div>

        {/* Mobile filter toggle */}
        <button onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium"
          style={{ borderColor: 'var(--brand-border)', color: showFilters ? 'var(--brand-green)' : 'var(--brand-muted)' }}>
          <SlidersHorizontal size={15} /> Filters
          {activeCategory && <span className="w-2 h-2 rounded-full bg-green-500" />}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar categories — hidden on mobile unless toggled */}
        <aside className={`sm:w-44 flex-shrink-0 ${showFilters ? 'block' : 'hidden sm:block'}`}>
          <div className="card p-4 sm:sticky sm:top-20">
            <p className="text-xs font-semibold mb-3 uppercase tracking-wider"
              style={{ color: 'var(--brand-muted)' }}>Categories</p>
            <div className="flex flex-row sm:flex-col gap-2 sm:gap-1 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0">
              <button onClick={() => setActiveCategory('')}
                className="flex-shrink-0 text-left text-sm px-3 py-2 rounded-lg transition-all"
                style={{
                  backgroundColor: !activeCategory ? 'var(--brand-green)' : 'transparent',
                  color: !activeCategory ? 'white' : 'var(--brand-muted)',
                  fontWeight: !activeCategory ? 500 : 400,
                }}>
                All Products
                <span className="ml-1 text-xs opacity-70">({products.length})</span>
              </button>
              {categories.map(cat => {
                const count = products.filter(p => p.categories?.slug === cat.slug).length
                return (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.slug)}
                    className="flex-shrink-0 text-left text-sm px-3 py-2 rounded-lg transition-all"
                    style={{
                      backgroundColor: activeCategory === cat.slug ? 'var(--brand-green)' : 'transparent',
                      color: activeCategory === cat.slug ? 'white' : 'var(--brand-muted)',
                      fontWeight: activeCategory === cat.slug ? 500 : 400,
                    }}>
                    {cat.name}
                    <span className="ml-1 text-xs opacity-70">({count})</span>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1 min-w-0">
          {/* Results count + clear */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm" style={{ color: 'var(--brand-muted)' }}>
              {filtered.length} product{filtered.length !== 1 ? 's' : ''}
              {activeCategory && ` in ${categories.find(c => c.slug === activeCategory)?.name}`}
              {search && ` matching "${search}"`}
            </p>
            {hasFilters && (
              <button onClick={clearFilters}
                className="flex items-center gap-1 text-xs font-medium hover:underline"
                style={{ color: 'var(--brand-brown)' }}>
                <X size={12} /> Clear filters
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <p className="font-medium mb-1" style={{ color: 'var(--brand-text)' }}>No products found</p>
              <p className="text-sm mb-4" style={{ color: 'var(--brand-muted)' }}>
                Try a different search term or category
              </p>
              <button onClick={clearFilters} className="btn-secondary text-sm">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}