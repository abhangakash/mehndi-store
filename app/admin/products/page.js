'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Edit2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const EMPTY = { name: '', slug: '', short_description: '', description: '', price: '', original_price: '', stock: '', weight_grams: '', ingredients: '', usage_instructions: '', image_url: '', category_id: '', is_featured: false, is_active: true }

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*'),
    ])
    setProducts(p || [])
    setCategories(c || [])
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const autoSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.stock) return toast.error('Name, price and stock are required')
    setSaving(true)
    const payload = { ...form, slug: form.slug || autoSlug(form.name), price: Number(form.price), original_price: form.original_price ? Number(form.original_price) : null, stock: Number(form.stock), weight_grams: form.weight_grams ? Number(form.weight_grams) : null, category_id: form.category_id || null }
    const { error } = editing
      ? await supabase.from('products').update(payload).eq('id', editing)
      : await supabase.from('products').insert(payload)
    if (error) toast.error(error.message)
    else { toast.success(editing ? 'Updated!' : 'Product added!'); setShowForm(false); setEditing(null); setForm(EMPTY); fetchAll() }
    setSaving(false)
  }

  const toggleActive = async (id, val) => { await supabase.from('products').update({ is_active: !val }).eq('id', id); fetchAll(); toast.success(val ? 'Hidden' : 'Visible') }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="section-title mb-0">Products</h1><p className="text-sm" style={{ color: 'var(--brand-muted)' }}>{products.length} products</p></div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY) }} className="btn-primary text-sm"><Plus size={16} /> Add Product</button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          <h2 className="font-semibold mb-5" style={{ color: 'var(--brand-text)' }}>{editing ? 'Edit Product' : 'New Product'}</h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--brand-text)' }}>Name *</label>
              <input value={form.name} onChange={e => { set('name', e.target.value); set('slug', autoSlug(e.target.value)) }} placeholder="Product name" />
            </div>
            <div><label className="block text-sm font-medium mb-1" style={{ color: 'var(--brand-text)' }}>Price ₹ *</label><input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="49" /></div>
            <div><label className="block text-sm font-medium mb-1" style={{ color: 'var(--brand-text)' }}>Original Price ₹</label><input type="number" value={form.original_price} onChange={e => set('original_price', e.target.value)} placeholder="65 (optional)" /></div>
            <div><label className="block text-sm font-medium mb-1" style={{ color: 'var(--brand-text)' }}>Stock *</label><input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="100" /></div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--brand-text)' }}>Category</label>
              <select value={form.category_id} onChange={e => set('category_id', e.target.value)}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1" style={{ color: 'var(--brand-text)' }}>Short Description</label><input value={form.short_description} onChange={e => set('short_description', e.target.value)} placeholder="One line summary" /></div>
            <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1" style={{ color: 'var(--brand-text)' }}>Description</label><textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Full description..." /></div>
            <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1" style={{ color: 'var(--brand-text)' }}>Image URL</label><input value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="https://..." /></div>
            <div><label className="block text-sm font-medium mb-1" style={{ color: 'var(--brand-text)' }}>Ingredients</label><input value={form.ingredients} onChange={e => set('ingredients', e.target.value)} placeholder="Natural henna powder..." /></div>
            <div><label className="block text-sm font-medium mb-1" style={{ color: 'var(--brand-text)' }}>Weight (grams)</label><input type="number" value={form.weight_grams} onChange={e => set('weight_grams', e.target.value)} placeholder="25" /></div>
            <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1" style={{ color: 'var(--brand-text)' }}>Usage Instructions</label><textarea value={form.usage_instructions} onChange={e => set('usage_instructions', e.target.value)} rows={2} placeholder="How to use..." /></div>
            <div className="sm:col-span-2 flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--brand-text)' }}><input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} className="w-auto" /> Featured</label>
              <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--brand-text)' }}><input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} className="w-auto" /> Active</label>
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? 'Saving...' : editing ? 'Update' : 'Add Product'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="btn-secondary text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {products.map(p => (
          <div key={p.id} className="card p-4 flex items-center gap-4" style={{ opacity: p.is_active ? 1 : 0.6 }}>
            <div className="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ backgroundColor: 'var(--brand-surface)' }}>
              {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-2xl">🌿</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate" style={{ color: 'var(--brand-text)' }}>{p.name}</p>
              <p className="text-xs" style={{ color: 'var(--brand-muted)' }}>{p.categories?.name} · Stock: {p.stock}</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--brand-brown)' }}>₹{p.price}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => toggleActive(p.id, p.is_active)} className="p-2 rounded-lg hover:bg-gray-50">
                {p.is_active ? <Eye size={16} style={{ color: 'var(--brand-green)' }} /> : <EyeOff size={16} style={{ color: 'var(--brand-muted)' }} />}
              </button>
              <button onClick={() => { setForm({ ...p, category_id: p.category_id || '', original_price: p.original_price || '', weight_grams: p.weight_grams || '' }); setEditing(p.id); setShowForm(true) }} className="p-2 rounded-lg hover:bg-gray-50">
                <Edit2 size={16} style={{ color: 'var(--brand-muted)' }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}