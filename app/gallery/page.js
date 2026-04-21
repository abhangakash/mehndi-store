'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Camera, Phone, ArrowRight, X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'

const GALLERY = [
  // Mehndi
  { id: 1, emoji: '🌸', title: 'Full Bridal Mehndi', category: 'mehndi', tag: 'Bridal', desc: 'Intricate full hand & feet bridal design', featured: true },
  { id: 2, emoji: '🌿', title: 'Arabic Pattern', category: 'mehndi', tag: 'Arabic', desc: 'Bold Arabic motifs with fine details' },
  { id: 3, emoji: '✨', title: 'Glitter Mehndi', category: 'mehndi', tag: 'Festival', desc: 'Sparkle with golden glitter on fresh henna' },
  { id: 4, emoji: '🌺', title: 'Rajasthani Design', category: 'mehndi', tag: 'Traditional', desc: 'Classic Rajasthani patterns with peacocks', featured: true },
  { id: 5, emoji: '🍃', title: 'Minimalist Mehndi', category: 'mehndi', tag: 'Modern', desc: 'Clean lines, modern minimalist style' },
  { id: 6, emoji: '🌻', title: 'Floral Cascade', category: 'mehndi', tag: 'Floral', desc: 'Beautiful cascading floral mehndi' },
  { id: 7, emoji: '🦚', title: 'Peacock Mehndi', category: 'mehndi', tag: 'Bridal', desc: 'Elaborate peacock motif bridal design' },
  { id: 8, emoji: '🌙', title: 'Crescent & Stars', category: 'mehndi', tag: 'Arabic', desc: 'Geometric stars with Arabic flair' },
  { id: 9, emoji: '💫', title: 'Party Glitter', category: 'mehndi', tag: 'Festival', desc: 'Multi-color glitter for festive fun' },
  { id: 10, emoji: '🌱', title: 'Simple Mehndi', category: 'mehndi', tag: 'Simple', desc: 'Clean simple patterns for everyday' },
  { id: 11, emoji: '🎋', title: 'Indo-Arabic Fusion', category: 'mehndi', tag: 'Fusion', desc: 'Beautiful blend of Indian & Arabic art' },
  { id: 12, emoji: '🌹', title: 'Rose Mehndi', category: 'mehndi', tag: 'Floral', desc: 'Detailed rose patterns for bridal' },
  // Makeup
  { id: 13, emoji: '💄', title: 'Bridal Glam', category: 'makeup', tag: 'Bridal', desc: 'Complete HD bridal makeup look', featured: true },
  { id: 14, emoji: '✨', title: 'Smokey Eye', category: 'makeup', tag: 'Evening', desc: 'Dramatic evening smokey eye' },
  { id: 15, emoji: '🌸', title: 'Soft Engagement Look', category: 'makeup', tag: 'Engagement', desc: 'Romantic soft glam for engagement' },
  { id: 16, emoji: '👑', title: 'Airbrush Bridal', category: 'makeup', tag: 'Premium', desc: 'Long-lasting airbrush technique' },
  { id: 17, emoji: '💋', title: 'Party Makeup', category: 'makeup', tag: 'Party', desc: 'Fun party glam for celebrations' },
  { id: 18, emoji: '🌟', title: 'Reception Look', category: 'makeup', tag: 'Bridal', desc: 'Glamorous reception night makeup' },
  // Combo
  { id: 19, emoji: '🎀', title: 'Complete Bridal Transformation', category: 'combo', tag: 'Combo', desc: 'Mehndi + full bridal makeup', featured: true },
  { id: 20, emoji: '💍', title: 'Engagement Day Look', category: 'combo', tag: 'Combo', desc: 'Party mehndi + engagement glam' },
  { id: 21, emoji: '🌺', title: 'Festival Special', category: 'combo', tag: 'Combo', desc: 'Festive mehndi + party makeup' },
]

const CATEGORIES = [
  { key: 'all', label: 'All Work', count: GALLERY.length },
  { key: 'mehndi', label: 'Mehndi', count: GALLERY.filter(i => i.category === 'mehndi').length },
  { key: 'makeup', label: 'Makeup', count: GALLERY.filter(i => i.category === 'makeup').length },
  { key: 'combo', label: 'Combo', count: GALLERY.filter(i => i.category === 'combo').length },
]

const TAG_COLORS = {
  Bridal: '#15803d', Arabic: '#0369a1', Festival: '#d97706', Traditional: '#9333ea',
  Modern: '#16a34a', Floral: '#be185d', Party: '#ea580c', Engagement: '#ca8a04',
  Premium: '#7c3aed', Evening: '#6366f1', Combo: '#059669', Simple: '#6b7280', Fusion: '#0891b2',
}
const TAG_BG = {
  Bridal: '#dcfce7', Arabic: '#e0f2fe', Festival: '#fef3c7', Traditional: '#fdf4ff',
  Modern: '#f0fdf4', Floral: '#fdf2f8', Party: '#fff7ed', Engagement: '#fefce8',
  Premium: '#ede9fe', Evening: '#eef2ff', Combo: '#ecfdf5', Simple: '#f9fafb', Fusion: '#ecfeff',
}
const CAT_BG = { mehndi: '#f0fdf4', makeup: '#fdf2f8', combo: '#f5f3ff' }

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [lightbox, setLightbox] = useState(null) // index in filtered array

  const filtered = activeCategory === 'all' ? GALLERY : GALLERY.filter(i => i.category === activeCategory)

  const openLightbox = (idx) => setLightbox(idx)
  const closeLightbox = () => setLightbox(null)
  const prevItem = () => setLightbox(l => (l - 1 + filtered.length) % filtered.length)
  const nextItem = () => setLightbox(l => (l + 1) % filtered.length)

  const currentItem = lightbox !== null ? filtered[lightbox] : null

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="section-title">Our Portfolio</h1>
        <p className="section-subtitle">
          {GALLERY.length}+ designs & transformations — click any to view full size
        </p>
        <a href="https://www.instagram.com/shrilekha_mehandi_art/" target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium mt-2 hover:underline"
          style={{ color: '#dc2743' }}>
          <ExternalLink size={14} /> See all work on Instagram @shrilekha_mehandi_art
        </a>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap justify-center mb-8">
        {CATEGORIES.map(cat => (
          <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              backgroundColor: activeCategory === cat.key ? 'var(--brand-green)' : 'white',
              color: activeCategory === cat.key ? 'white' : 'var(--brand-muted)',
              border: `1px solid ${activeCategory === cat.key ? 'var(--brand-green)' : 'var(--brand-border)'}`,
            }}>
            {cat.label}
            <span className="text-xs opacity-70">({cat.count})</span>
          </button>
        ))}
      </div>

      {/* Gallery grid */}
      <div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3 mb-10">
        {filtered.map((item, idx) => (
          <div key={item.id}
            onClick={() => openLightbox(idx)}
            className={`break-inside-avoid card overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 ${item.featured ? 'ring-2' : ''}`}
            style={{ ringColor: item.featured ? 'var(--brand-gold)' : 'transparent' }}>
            <div className={`flex items-center justify-center relative overflow-hidden ${item.featured ? 'text-7xl py-10' : 'text-5xl py-7'}`}
              style={{ backgroundColor: CAT_BG[item.category] || 'var(--brand-surface)' }}>
              {item.emoji}
              {item.featured && (
                <div className="absolute top-2 right-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
                    style={{ backgroundColor: 'var(--brand-gold)' }}>★ Featured</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                  <Camera size={18} style={{ color: 'var(--brand-green)' }} />
                </div>
              </div>
            </div>
            <div className="p-2.5">
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs font-medium truncate" style={{ color: 'var(--brand-text)' }}>{item.title}</p>
                <span className="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: TAG_BG[item.tag] || '#f3f4f6', color: TAG_COLORS[item.tag] || '#6b7280', fontSize: '10px' }}>
                  {item.tag}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && currentItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          onClick={closeLightbox}>
          <div className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
            {/* Close */}
            <button onClick={closeLightbox}
              className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors">
              <X size={24} />
            </button>
            {/* Nav prev */}
            <button onClick={prevItem}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-white/70 hover:text-white transition-colors hidden sm:block">
              <ChevronLeft size={32} />
            </button>
            {/* Nav next */}
            <button onClick={nextItem}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-white/70 hover:text-white transition-colors hidden sm:block">
              <ChevronRight size={32} />
            </button>

            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="flex items-center justify-center py-16 text-9xl"
                style={{ backgroundColor: CAT_BG[currentItem.category] || 'var(--brand-surface)' }}>
                {currentItem.emoji}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-base" style={{ color: 'var(--brand-text)' }}>{currentItem.title}</h3>
                  <span className="text-xs px-2.5 py-1 rounded-full flex-shrink-0 font-medium"
                    style={{ backgroundColor: TAG_BG[currentItem.tag], color: TAG_COLORS[currentItem.tag] }}>
                    {currentItem.tag}
                  </span>
                </div>
                <p className="text-sm mb-4" style={{ color: 'var(--brand-muted)' }}>{currentItem.desc}</p>
                <div className="flex gap-2">
                  <a href={`https://wa.me/919623740541?text=Hi! I want to book a ${currentItem.title} appointment`}
                    target="_blank" rel="noreferrer"
                    className="btn-primary text-xs flex-1 justify-center">
                    <Phone size={13} /> Book This Style
                  </a>
                  <Link href="/packages" onClick={closeLightbox}
                    className="btn-secondary text-xs flex-1 justify-center">
                    View Packages
                  </Link>
                </div>
                <p className="text-xs text-center mt-3" style={{ color: 'var(--brand-muted)' }}>
                  {lightbox + 1} / {filtered.length}
                </p>
              </div>
            </div>

            {/* Mobile nav */}
            <div className="flex justify-between mt-4 sm:hidden">
              <button onClick={prevItem} className="flex items-center gap-1 text-white/70 text-sm">
                <ChevronLeft size={18} /> Previous
              </button>
              <button onClick={nextItem} className="flex items-center gap-1 text-white/70 text-sm">
                Next <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instagram CTA */}
      <div className="rounded-2xl p-6 md:p-10 text-center text-white"
        style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
        <div className="text-4xl mb-3">📸</div>
        <h3 className="text-xl font-bold mb-2">See 100+ More Designs on Instagram</h3>
        <p className="text-white/80 text-sm mb-5 max-w-md mx-auto">
          We post daily mehndi designs, makeup looks and behind-the-scenes on our Instagram.
          Follow for inspiration!
        </p>
        <a href="https://www.instagram.com/shrilekha_mehandi_art/" target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-sm font-bold transition-all hover:scale-105"
          style={{ color: '#dc2743' }}>
          Follow @shrilekha_mehandi_art <ArrowRight size={16} />
        </a>
      </div>

      <div className="text-center mt-8">
        <div className="flex flex-wrap justify-center gap-3">
          <a href="https://wa.me/919623740541?text=Hi! I want to book an appointment after seeing your gallery"
            target="_blank" rel="noreferrer" className="btn-primary text-sm">
            <Phone size={15} /> Book Appointment
          </a>
          <Link href="/packages" className="btn-secondary text-sm">
            View Packages & Pricing <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}