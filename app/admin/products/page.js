'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Plus, Edit2, Eye, EyeOff, Trash2, Search,
  Package, Tag, AlertCircle, X, Star, Save,
  ChevronDown, Image, RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

const EMPTY_PRODUCT = {
  name: '', slug: '', short_description: '', description: '',
  price: '', original_price: '', stock: '', weight_grams: '',
  ingredients: '', usage_instructions: '', image_url: '',
  images: '', category_id: '', is_featured: false, is_active: true,
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function ProductForm({ form, setForm, categories, onSave, onCancel, saving, isEdit }) {
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const inputCls = "w-full px-4 py-3 text-sm rounded-xl outline-none transition-all"
  const inputStyle = {
    backgroundColor: 'white',
    border: '1.5px solid rgba(15,26,14,0.08)',
    color: '#0f1a0e',
  }

  return (
    <div className="rounded-2xl overflow-hidden mb-5" style={{ backgroundColor: '#fcfaf6', border: '1.5px solid rgba(201,168,76,0.3)' }}>
      <div className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(15,26,14,0.06)', backgroundColor: '#fef9ee' }}>
        <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(15,26,14,0.5)' }}>
          {isEdit ? 'Edit Product' : 'New Product'}
        </p>
        <button onClick={onCancel}><X size={16} style={{ color: 'rgba(15,26,14,0.4)' }} /></button>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(15,26,14,0.5)' }}>Product Name *</label>
          <input className={inputCls} style={inputStyle}
            value={form.name}
            onChange={e => { set('name', e.target.value); if (!isEdit) set('slug', slugify(e.target.value)) }}
            placeholder="e.g. Natural Henna Cone Premium" />
        </div>

        {/* Slug */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(15,26,14,0.5)' }}>
            URL Slug * <span style={{ color: 'rgba(15,26,14,0.3)', fontWeight: 400, textTransform: 'none' }}>(auto-generated, edit if needed)</span>
          </label>
          <input className={inputCls} style={inputStyle}
            value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="natural-henna-cone-premium" />
        </div>

        {/* Price + Original Price */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(15,26,14,0.5)' }}>Price ₹ *</label>
          <input className={inputCls} style={inputStyle}
            type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="49" />
        </div>
        <div>
          <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(15,26,14,0.5)' }}>
            Original Price ₹ <span style={{ color: 'rgba(15,26,14,0.3)', fontWeight: 400, textTransform: 'none' }}>(for showing discount)</span>
          </label>
          <input className={inputCls} style={inputStyle}
            type="number" value={form.original_price} onChange={e => set('original_price', e.target.value)} placeholder="65 (optional)" />
        </div>

        {/* Stock + Weight */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(15,26,14,0.5)' }}>Stock Qty *</label>
          <input className={inputCls} style={inputStyle}
            type="number" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="100" />
        </div>
        <div>
          <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(15,26,14,0.5)' }}>Weight (grams)</label>
          <input className={inputCls} style={inputStyle}
            type="number" value={form.weight_grams} onChange={e => set('weight_grams', e.target.value)} placeholder="25" />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(15,26,14,0.5)' }}>Category</label>
          <div className="relative">
            <select className={`${inputCls} appearance-none pr-8 cursor-pointer`} style={inputStyle}
              value={form.category_id} onChange={e => set('category_id', e.target.value)}>
              <option value="">Select category...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(15,26,14,0.4)' }} />
          </div>
        </div>

        {/* Short description */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(15,26,14,0.5)' }}>Short Description</label>
          <input className={inputCls} style={inputStyle}
            value={form.short_description} onChange={e => set('short_description', e.target.value)} placeholder="One line summary for product cards" />
        </div>

        {/* Full description */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(15,26,14,0.5)' }}>Full Description</label>
          <textarea className={inputCls} style={inputStyle} rows={3}
            value={form.description} onChange={e => set('description', e.target.value)} placeholder="Detailed product description..." />
        </div>

        {/* Main image URL */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(15,26,14,0.5)' }}>
            Main Image URL *
          </label>
          <input className={inputCls} style={inputStyle}
            value={form.image_url} onChange={e => set('image_url', e.target.value)}
            placeholder="https://your-supabase.co/storage/v1/object/public/product-images/..." />
          {form.image_url && (
            <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(15,26,14,0.1)' }}>
              <img src={form.image_url} alt="Preview" className="w-full h-full object-cover"
                onError={e => e.target.style.display = 'none'} />
            </div>
          )}
        </div>

        {/* Extra images */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(15,26,14,0.5)' }}>
            Additional Images <span style={{ color: 'rgba(15,26,14,0.3)', fontWeight: 400, textTransform: 'none' }}>(one URL per line, up to 4 total)</span>
          </label>
          <textarea className={inputCls} style={inputStyle} rows={3}
            value={form.images} onChange={e => set('images', e.target.value)}
            placeholder={"https://...image2.jpg\nhttps://...image3.jpg\nhttps://...image4.jpg"} />
          <p className="text-xs mt-1" style={{ color: 'rgba(15,26,14,0.35)' }}>
            These show as thumbnails on the product detail page
          </p>
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(15,26,14,0.5)' }}>Ingredients</label>
          <input className={inputCls} style={inputStyle}
            value={form.ingredients} onChange={e => set('ingredients', e.target.value)} placeholder="Natural henna powder, rose water..." />
        </div>

        {/* Usage instructions */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(15,26,14,0.5)' }}>Usage Instructions</label>
          <input className={inputCls} style={inputStyle}
            value={form.usage_instructions} onChange={e => set('usage_instructions', e.target.value)} placeholder="Apply on clean dry skin..." />
        </div>

        {/* Toggles */}
        <div className="sm:col-span-2 flex flex-wrap gap-4 pt-2">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <div onClick={() => set('is_active', !form.is_active)}
              className="w-11 h-6 rounded-full transition-colors relative flex-shrink-0 cursor-pointer"
              style={{ backgroundColor: form.is_active ? '#0f1a0e' : 'rgba(15,26,14,0.15)' }}>
              <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                style={{ left: form.is_active ? '24px' : '4px' }} />
            </div>
            <span className="text-sm font-bold" style={{ color: '#0f1a0e' }}>
              {form.is_active ? 'Active (visible in store)' : 'Hidden from store'}
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <div onClick={() => set('is_featured', !form.is_featured)}
              className="w-11 h-6 rounded-full transition-colors relative flex-shrink-0 cursor-pointer"
              style={{ backgroundColor: form.is_featured ? '#c9a84c' : 'rgba(15,26,14,0.15)' }}>
              <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                style={{ left: form.is_featured ? '24px' : '4px' }} />
            </div>
            <span className="text-sm font-bold" style={{ color: '#0f1a0e' }}>
              {form.is_featured ? 'Featured on homepage' : 'Not featured'}
            </span>
          </label>
        </div>

        {/* Save / Cancel */}
        <div className="sm:col-span-2 flex gap-3 pt-2">
          <button onClick={onSave} disabled={saving}
            className="flex-1 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 transition-all"
            style={{ backgroundColor: saving ? 'rgba(15,26,14,0.4)' : '#0f1a0e' }}>
            <Save size={14} /> {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
          </button>
          <button onClick={onCancel}
            className="px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all"
            style={{ borderColor: 'rgba(15,26,14,0.1)', color: 'rgba(15,26,14,0.5)' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_PRODUCT)
  const [saving, setSaving] = useState(false)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ])
    setProducts(p || [])
    setCategories(c || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const parseImages = (imagesText) => {
    if (!imagesText || !imagesText.trim()) return []
    return imagesText.split('\n').map(u => u.trim()).filter(Boolean).slice(0, 4)
  }

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Product name is required'); return }
    if (!form.price || Number(form.price) <= 0) { toast.error('Valid price is required'); return }
    if (!form.stock && form.stock !== 0) { toast.error('Stock quantity is required'); return }

    setSaving(true)
    const payload = {
      name: form.name.trim(),
      slug: form.slug || slugify(form.name),
      short_description: form.short_description?.trim() || null,
      description: form.description?.trim() || null,
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      stock: Number(form.stock),
      weight_grams: form.weight_grams ? Number(form.weight_grams) : null,
      ingredients: form.ingredients?.trim() || null,
      usage_instructions: form.usage_instructions?.trim() || null,
      image_url: form.image_url?.trim() || null,
      images: parseImages(form.images),
      category_id: form.category_id || null,
      is_featured: Boolean(form.is_featured),
      is_active: Boolean(form.is_active),
    }

    const { error } = editingId
      ? await supabase.from('products').update(payload).eq('id', editingId)
      : await supabase.from('products').insert(payload)

    if (error) {
      toast.error('Failed to save: ' + error.message)
    } else {
      toast.success(editingId ? 'Product updated!' : 'Product added!')
      setShowForm(false)
      setEditingId(null)
      setForm(EMPTY_PRODUCT)
      fetchAll()
    }
    setSaving(false)
  }

  const handleEdit = (product) => {
    setForm({
      name: product.name || '',
      slug: product.slug || '',
      short_description: product.short_description || '',
      description: product.description || '',
      price: product.price || '',
      original_price: product.original_price || '',
      stock: product.stock || '',
      weight_grams: product.weight_grams || '',
      ingredients: product.ingredients || '',
      usage_instructions: product.usage_instructions || '',
      image_url: product.image_url || '',
      images: (product.images || []).join('\n'),
      category_id: product.category_id || '',
      is_featured: product.is_featured || false,
      is_active: product.is_active !== false,
    })
    setEditingId(product.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleToggleActive = async (id, current) => {
    const { error } = await supabase.from('products').update({ is_active: !current }).eq('id', id)
    if (error) { toast.error('Failed to update'); return }
    toast.success(current ? 'Product hidden' : 'Product visible')
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !current } : p))
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) { toast.error('Failed to delete'); return }
    toast.success('Product deleted')
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const filtered = products.filter(p => {
    if (!search) return true
    const s = search.toLowerCase()
    return p.name?.toLowerCase().includes(s) || p.categories?.name?.toLowerCase().includes(s)
  })

  const lowStockProducts = products.filter(p => p.stock < 5 && p.is_active)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0f0d' }}>
      {/* Header */}
      <div className="px-4 sm:px-6 pt-8 pb-5 max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-white">Products</h1>
            <p className="text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color: 'rgba(201,168,76,0.6)' }}>
              {products.length} total · {products.filter(p => p.is_active).length} active
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchAll} className="p-2.5 rounded-xl hover:bg-white/10 transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <RefreshCw size={16} />
            </button>
            <button
              onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(EMPTY_PRODUCT) }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
              style={{ backgroundColor: showForm ? 'rgba(255,255,255,0.1)' : '#c9a84c', color: showForm ? 'white' : '#0f1a0e' }}>
              {showForm ? <X size={14} /> : <Plus size={14} />}
              {showForm ? 'Cancel' : 'Add Product'}
            </button>
          </div>
        </div>

        {/* Low stock alert */}
        {lowStockProducts.length > 0 && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl mb-4"
            style={{ backgroundColor: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)' }}>
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
            <div>
              <p className="text-xs font-black uppercase tracking-wide" style={{ color: '#dc2626' }}>Low Stock Alert</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(220,38,38,0.7)' }}>
                {lowStockProducts.map(p => `${p.name} (${p.stock} left)`).join(' · ')}
              </p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-10 py-3 rounded-xl text-sm text-white outline-none"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.08)' }} />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
            </button>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-6 pb-10 max-w-6xl mx-auto">
        {/* Add/Edit form */}
        {showForm && (
          <ProductForm
            form={form} setForm={setForm}
            categories={categories}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingId(null); setForm(EMPTY_PRODUCT) }}
            saving={saving}
            isEdit={!!editingId}
          />
        )}

{/* Product list */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto border-[#c9a84c]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: '#fcfaf6' }}>
            <Package size={40} className="mx-auto mb-3" style={{ color: 'rgba(15,26,14,0.15)' }} />
            <p className="font-black text-sm" style={{ color: '#0f1a0e' }}>No products found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(product => {
              const discount = product.original_price
                ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : null
              const isLow = product.stock < 5

              return (
                <div key={product.id}
                  className="rounded-2xl p-4 flex items-center gap-4 transition-all"
                  style={{
                    backgroundColor: '#fcfaf6',
                    border: `1.5px solid ${!product.is_active ? 'rgba(15,26,14,0.06)' : isLow ? 'rgba(220,38,38,0.2)' : 'rgba(15,26,14,0.06)'}`,
                    opacity: product.is_active ? 1 : 0.6,
                  }}>

                  {/* Image */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(15,26,14,0.05)' }}>
                    {product.image_url
                      ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      : <Package size={20} style={{ color: 'rgba(15,26,14,0.2)' }} />
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-0.5">
                      <p className="font-black text-sm truncate" style={{ color: '#0f1a0e' }}>{product.name}</p>
                      {product.is_featured && <Star size={12} fill="#c9a84c" color="#c9a84c" className="flex-shrink-0 mt-0.5" />}
                    </div>
                    <p className="text-xs truncate mb-1" style={{ color: 'rgba(15,26,14,0.4)' }}>
                      {product.categories?.name || 'No category'}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-sm" style={{ color: '#c9a84c' }}>₹{product.price}</span>
                      {product.original_price && (
                        <span className="text-xs line-through" style={{ color: 'rgba(15,26,14,0.3)' }}>₹{product.original_price}</span>
                      )}
                      {discount && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full font-black"
                          style={{ backgroundColor: '#fef3c7', color: '#d97706', fontSize: '9px' }}>
                          {discount}% OFF
                        </span>
                      )}
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                        style={{
                          backgroundColor: isLow ? '#fee2e2' : product.stock === 0 ? '#fee2e2' : '#dcfce7',
                          color: isLow || product.stock === 0 ? '#dc2626' : '#15803d',
                          fontSize: '9px',
                        }}>
                        {product.stock === 0 ? 'OUT OF STOCK' : isLow ? `⚠️ ${product.stock} left` : `${product.stock} in stock`}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => handleEdit(product)}
                      className="p-2 rounded-xl hover:bg-gray-100 transition-colors" title="Edit">
                      <Edit2 size={14} style={{ color: 'rgba(15,26,14,0.5)' }} />
                    </button>
                    <button onClick={() => handleToggleActive(product.id, product.is_active)}
                      className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                      title={product.is_active ? 'Hide from store' : 'Show in store'}>
                      {product.is_active
                        ? <Eye size={14} style={{ color: '#15803d' }} />
                        : <EyeOff size={14} style={{ color: 'rgba(15,26,14,0.3)' }} />
                      }
                    </button>
                    <button onClick={() => handleDelete(product.id, product.name)}
                      className="p-2 rounded-xl hover:bg-red-50 transition-colors" title="Delete">
                      <Trash2 size={14} style={{ color: '#dc2626' }} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
