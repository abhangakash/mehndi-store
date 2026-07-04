'use client'
import { useState, useMemo } from 'react'
import ProductCard from './ProductCard'
import { Search, X, ChevronDown } from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
]

export default function ProductsClient({ products }) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')

  const filtered = useMemo(() => {
    let result = [...products]
    
    if (search.trim()) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.short_description?.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    if (sort === 'price-low') result.sort((a, b) => a.price - b.price)
    if (sort === 'price-high') result.sort((a, b) => b.price - a.price)
    if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name))
    
    return result
  }, [products, search, sort])

  const clearFilters = () => { 
    setSearch('')
    setSort('default') 
  }
  
  const hasFilters = search || sort !== 'default'

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      {/* Header */}
      <div className="mb-6 text-center sm:text-left">
        <h1 className="section-title text-2xl md:text-3xl font-bold">Our Products</h1>
        <p className="section-subtitle text-sm md:text-base mt-1">
          Premium Ayurvedic Crab Oil formulas for joint & muscle care
        </p>
      </div>

      {/* Search & Sort controls bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search 
            size={16} 
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--brand-muted)' }} 
          />
          <input
            className="w-full rounded-lg border text-sm py-2.5"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            style={{ 
              paddingLeft: '2.5rem', 
              paddingRight: search ? '2.5rem' : '1rem',
              borderColor: 'var(--brand-border)'
            }}
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80"
              style={{ color: 'var(--brand-muted)' }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative w-full sm:w-48">
          <select 
            value={sort} 
            onChange={e => setSort(e.target.value)}
            className="w-full appearance-none rounded-lg border text-sm py-2.5 pl-3 cursor-pointer bg-white"
            style={{ paddingRight: '2.5rem', borderColor: 'var(--brand-border)' }}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown 
            size={15} 
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--brand-muted)' }} 
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full">
        {/* Results count & Clear actions */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <p style={{ color: 'var(--brand-muted)' }}>
            Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            {search && ` matching "${search}"`}
          </p>
          {hasFilters && (
            <button 
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs font-medium hover:underline"
              style={{ color: 'var(--brand-brown)' }}
            >
              <X size={12} /> Clear layout
            </button>
          )}
        </div>

        {/* Dynamic Responsive Grid */}
        {filtered.length === 0 ? (
          <div className="card p-8 md:p-12 text-center rounded-xl border border-dashed">
            <div className="text-4xl md:text-5xl mb-4">🦀</div>
            <p className="font-medium mb-1" style={{ color: 'var(--brand-text)' }}>
              No products found
            </p>
            <p className="text-sm mb-4" style={{ color: 'var(--brand-muted)' }}>
              Try a different search term or clear filters
            </p>
            <button onClick={clearFilters} className="btn-secondary text-sm px-4 py-2 rounded-lg">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}