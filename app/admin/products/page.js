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
    border: '1.5px solid #e2e8f0',
    color: '#0f172a',
  }

  return (
    <div className="rounded-2xl overflow-hidden mb-5 bg-white border border-slate-200 shadow-sm">
      <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/70">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {isEdit ? 'Modify Product File' : 'Register New Wellness Product'}
        </p>
        <button onClick={onCancel}><X size={16} className="text-slate-400 hover:text-slate-600" /></button>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Product Name *</label>
          <input className={inputCls} style={inputStyle}
            value={form.name}
            onChange={e => { set('name', e.target.value); if (!isEdit) set('slug', slugify(e.target.value)) }}
            placeholder="e.g. Crabveda Ortho Healing Oil Premium" />
        </div>

        {/* Slug */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            URL Slug * <span className="text-slate-400 font-normal normal-case">(auto-generated, edit if needed)</span>
          </label>
          <input className={inputCls} style={inputStyle}
            value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="crabveda-ortho-healing-oil-premium" />
        </div>

        {/* Price + Original Price */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Price ₹ *</label>
          <input className={inputCls} style={inputStyle}
            type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="599" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Original Price ₹ <span className="text-slate-400 font-normal normal-case">(for showing discount tag)</span>
          </label>
          <input className={inputCls} style={inputStyle}
            type="number" value={form.original_price} onChange={e => set('original_price', e.target.value)} placeholder="799 (optional)" />
        </div>

        {/* Stock + Weight */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Stock Qty *</label>
          <input className={inputCls} style={inputStyle}
            type="number" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="100" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Weight (ml / grams)</label>
          <input className={inputCls} style={inputStyle}
            type="number" value={form.weight_grams} onChange={e => set('weight_grams', e.target.value)} placeholder="100" />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Category Assignment</label>
          <div className="relative">
            <select className={`${inputCls} appearance-none pr-8 cursor-pointer`} style={inputStyle}
              value={form.category_id} onChange={e => set('category_id', e.target.value)}>
              <option value="">Select store category...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>
        </div>

        {/* Short description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Short Description</label>
          <input className={inputCls} style={inputStyle}
            value={form.short_description} onChange={e => set('short_description', e.target.value)} placeholder="One line summary for product showcase cards" />
        </div>

        {/* Full description */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Full Therapeutic Description</label>
          <textarea className={inputCls} style={inputStyle} rows={3}
            value={form.description} onChange={e => set('description', e.target.value)} placeholder="Detailed formulation benefits, herbal base notes..." />
        </div>

        {/* Main image URL */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Primary Asset Image URL *
          </label>
          <input className={inputCls} style={inputStyle}
            value={form.image_url} onChange={e => set('image_url', e.target.value)}
            placeholder="https://your-supabase.co/storage/v1/object/public/product-images/..." />
          {form.image_url ? (
            <div className="mt-2.5 w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <img 
                src={form.image_url} 
                alt="Preview" 
                className="w-full h-full object-cover"
                onError={e => { e.target.style.display = 'none' }} 
              />
            </div>
          ) : null}
        </div>

        {/* Extra images */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Secondary Gallery Assets <span className="text-slate-400 font-normal normal-case">(one URL per line, max 4 total)</span>
          </label>
          <textarea className={inputCls} style={inputStyle} rows={3}
            value={form.images} onChange={e => set('images', e.target.value)}
            placeholder={"https://...image2.jpg\nhttps://...image3.jpg"} />
          <p className="text-xs mt-1 text-slate-400">
            These render inside thumbnails on the active marketplace layout.
          </p>
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Active Ingredients / Herbs</label>
          <input className={inputCls} style={inputStyle}
            value={form.ingredients} onChange={e => set('ingredients', e.target.value)} placeholder="Mahanarayan Taila, Eucalyptus Extract, Wintergreen..." />
        </div>

        {/* Usage instructions */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Usage Application Instructions</label>
          <input className={inputCls} style={inputStyle}
            value={form.usage_instructions} onChange={e => set('usage_instructions', e.target.value)} placeholder="Massage gently over the affected area 2-3 times daily..." />
        </div>

        {/* Toggles */}
        <div className="sm:col-span-2 flex flex-wrap gap-6 pt-2">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <div onClick={() => set('is_active', !form.is_active)}
              className="w-11 h-6 rounded-full transition-colors relative flex-shrink-0 cursor-pointer"
              style={{ backgroundColor: form.is_active ? '#047857' : '#cbd5e1' }}>
              <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-xs"
                style={{ left: form.is_active ? '24px' : '4px' }} />
            </div>
            <span className="text-sm font-semibold text-slate-800">
              {form.is_active ? 'Active (Listed live on store)' : 'Hidden (Draft archiving state)'}
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <div onClick={() => set('is_featured', !form.is_featured)}
              className="w-11 h-6 rounded-full transition-colors relative flex-shrink-0 cursor-pointer"
              style={{ backgroundColor: form.is_featured ? '#047857' : '#cbd5e1' }}>
              <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-xs"
                style={{ left: form.is_featured ? '24px' : '4px' }} />
            </div>
            <span className="text-sm font-semibold text-slate-800">
              {form.is_featured ? 'Featured Collection' : 'Standard Catalog Grid'}
            </span>
          </label>
        </div>

        {/* Save / Cancel */}
        <div className="sm:col-span-2 flex gap-3 pt-3">
          <button onClick={onSave} disabled={saving}
            className="flex-1 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 transition-all bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300">
            <Save size={14} /> {saving ? 'Saving File...' : isEdit ? 'Commit Changes' : 'Append to Store'}
          </button>
          <button onClick={onCancel}
            className="px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 transition-all">
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
    <div className="min-h-screen" style={{ backgroundColor: '#f8faf9' }}>
      {/* Header */}
      <div className="px-4 sm:px-6 pt-8 pb-5 max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventory Index</h1>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1 text-slate-400">
              {products.length} catalog items · {products.filter(p => p.is_active).length} active visibility
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchAll} className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
              <RefreshCw size={15} />
            </button>
            <button
              onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(EMPTY_PRODUCT) }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
              style={{ backgroundColor: showForm ? '#e2e8f0' : '#047857', color: showForm ? '#475569' : '#ffffff' }}>
              {showForm ? <X size={14} /> : <Plus size={14} />}
              {showForm ? 'Close Form' : 'Add New Item'}
            </button>
          </div>
        </div>

        {/* Low stock alert */}
        {lowStockProducts.length > 0 && (
          <div className="flex items-start gap-2.5 p-4 rounded-xl mb-5 bg-red-50 border border-red-200 shadow-xs">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-red-700" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-red-800">Critical Stock Warnings</p>
              <p className="text-xs mt-1 text-red-600 font-medium leading-relaxed">
                {lowStockProducts.map(p => `${p.name} (${p.stock} left)`).join(' · ')}
              </p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Filter items by product name, catalog tag properties..."
            className="w-full pl-10 pr-10 py-3 rounded-xl text-sm bg-white border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-600/40 focus:ring-1 focus:ring-emerald-600/10 shadow-xs" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-6 pb-12 max-w-6xl mx-auto">
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
          <div className="text-center py-24">
            <div className="w-9 h-9 border-2 border-slate-200 border-t-emerald-700 rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl p-16 text-center bg-white border border-slate-200 shadow-sm">
            <Package size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="font-bold text-sm text-slate-700">No matching products matching parameters</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(product => {
              const discount = product.original_price
                ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : null
              const isLow = product.stock < 5

              return (
                <div key={product.id}
                  className="rounded-2xl p-4 flex items-center gap-4 transition-all bg-white border shadow-xs"
                  style={{
                    borderColor: !product.is_active ? '#e2e8f0' : isLow ? '#fee2e2' : '#e2e8f0',
                    opacity: product.is_active ? 1 : 0.65,
                  }}>

                  {/* Image */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-slate-50 border border-slate-100">
                    {product.image_url
                      ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      : <Package size={20} className="text-slate-300" />
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-sm text-slate-800 truncate">{product.name}</p>
                      {product.is_featured && <Star size={12} fill="#b45309" className="text-amber-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs truncate mb-1.5 text-slate-400">
                      {product.categories?.name || 'No catalog assignment'}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-emerald-800">₹{product.price}</span>
                      {product.original_price && (
                        <span className="text-xs line-through text-slate-400">₹{product.original_price}</span>
                      )}
                      {discount && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-amber-50 text-amber-700 border border-amber-100">
                          {discount}% OFF
                        </span>
                      )}
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold border"
                        style={{
                          backgroundColor: isLow ? '#fef2f2' : product.stock === 0 ? '#fef2f2' : '#f0fdf4',
                          color: isLow || product.stock === 0 ? '#b91c1c' : '#166534',
                          borderColor: isLow || product.stock === 0 ? '#fee2e2' : '#dcfce7',
                        }}>
                        {product.stock === 0 ? 'OUT OF STOCK' : isLow ? `⚠️ ${product.stock} units left` : `${product.stock} units ready`}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(product)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors" title="Edit Properties">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleToggleActive(product.id, product.is_active)}
                      className="p-2 rounded-xl transition-colors hover:bg-slate-50"
                      title={product.is_active ? 'Hide from store channel' : 'Publish to store channel'}>
                      {product.is_active
                        ? <Eye size={14} className="text-emerald-700" />
                        : <EyeOff size={14} className="text-slate-300" />
                      }
                    </button>
                    <button onClick={() => handleDelete(product.id, product.name)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-700 hover:bg-red-50 transition-colors" title="Remove Product">
                      <Trash2 size={14} />
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