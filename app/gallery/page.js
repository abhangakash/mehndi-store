import Link from 'next/link'
import { Camera, Phone, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Gallery — Shrilekha Mehndi Art & Glowup',
  description: 'Browse our portfolio of bridal mehndi designs and professional makeup work. See intricate henna patterns, bridal looks and more from Shrilekha in Pune.',
}

const GALLERY_ITEMS = [
  { emoji: '🌸', title: 'Bridal Mehndi', category: 'mehndi', tag: 'Bridal', desc: 'Intricate bridal designs for the special day' },
  { emoji: '🌿', title: 'Arabic Patterns', category: 'mehndi', tag: 'Arabic', desc: 'Bold Arabic motifs with floral touch' },
  { emoji: '✨', title: 'Glitter Mehndi', category: 'mehndi', tag: 'Festival', desc: 'Sparkle & shine for festive occasions' },
  { emoji: '🌺', title: 'Rajasthani Design', category: 'mehndi', tag: 'Traditional', desc: 'Classic Rajasthani patterns' },
  { emoji: '🍃', title: 'Minimalist Mehndi', category: 'mehndi', tag: 'Modern', desc: 'Clean modern minimalist style' },
  { emoji: '🌻', title: 'Floral Mehndi', category: 'mehndi', tag: 'Floral', desc: 'Beautiful floral patterns' },
  { emoji: '💄', title: 'Bridal Makeup', category: 'makeup', tag: 'Bridal', desc: 'Complete bridal glam look' },
  { emoji: '✨', title: 'Party Makeup', category: 'makeup', tag: 'Party', desc: 'Stunning party and event looks' },
  { emoji: '🌸', title: 'Engagement Look', category: 'makeup', tag: 'Engagement', desc: 'Soft romantic engagement glam' },
  { emoji: '👑', title: 'Airbrush Bridal', category: 'makeup', tag: 'Premium', desc: 'Long-lasting airbrush technique' },
  { emoji: '💋', title: 'Smokey Eye', category: 'makeup', tag: 'Evening', desc: 'Dramatic evening glam' },
  { emoji: '🎀', title: 'Mehndi + Makeup', category: 'combo', tag: 'Combo', desc: 'Complete bridal transformation' },
]

const TAG_COLORS = {
  Bridal: { bg: '#dcfce7', color: '#15803d' },
  Arabic: { bg: '#e0f2fe', color: '#0369a1' },
  Festival: { bg: '#fef3c7', color: '#d97706' },
  Traditional: { bg: '#fdf4ff', color: '#9333ea' },
  Modern: { bg: '#f0fdf4', color: '#16a34a' },
  Floral: { bg: '#fdf2f8', color: '#be185d' },
  Party: { bg: '#fff7ed', color: '#ea580c' },
  Engagement: { bg: '#fefce8', color: '#ca8a04' },
  Premium: { bg: '#ede9fe', color: '#7c3aed' },
  Evening: { bg: '#1e1b4b', color: '#a5b4fc' },
  Combo: { bg: '#ecfdf5', color: '#059669' },
}

export default function GalleryPage() {
  const mehndiItems = GALLERY_ITEMS.filter(i => i.category === 'mehndi')
  const makeupItems = GALLERY_ITEMS.filter(i => i.category === 'makeup')
  const comboItems = GALLERY_ITEMS.filter(i => i.category === 'combo')

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="section-title">Our Portfolio</h1>
        <p className="section-subtitle max-w-xl mx-auto">
          A glimpse of our work — from intricate bridal mehndi to stunning makeup transformations
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {['All', 'Mehndi', 'Makeup', 'Combo'].map(cat => (
            <span key={cat} className="px-3 py-1 rounded-full text-xs font-medium border"
              style={{ borderColor: 'var(--brand-border)', color: 'var(--brand-muted)' }}>
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Mehndi Gallery */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <div className="text-xl">🌿</div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--brand-green)' }}>Mehndi Designs</h2>
            <p className="text-xs" style={{ color: 'var(--brand-muted)' }}>{mehndiItems.length} designs</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 md:gap-4">
          {mehndiItems.map((item, i) => (
            <GalleryCard key={i} item={item} />
          ))}
        </div>
      </section>

      {/* Makeup Gallery */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <div className="text-xl">💄</div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--brand-brown)' }}>Makeup Looks</h2>
            <p className="text-xs" style={{ color: 'var(--brand-muted)' }}>{makeupItems.length} looks</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 md:gap-4">
          {makeupItems.map((item, i) => (
            <GalleryCard key={i} item={item} />
          ))}
        </div>
      </section>

      {/* Combo */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <div className="text-xl">✨</div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: '#7c3aed' }}>Complete Transformations</h2>
            <p className="text-xs" style={{ color: 'var(--brand-muted)' }}>Mehndi + Makeup combos</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 md:gap-4">
          {comboItems.map((item, i) => (
            <GalleryCard key={i} item={item} />
          ))}
        </div>
      </section>

      {/* Instagram CTA */}
      <div className="card p-6 md:p-8 text-center"
        style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', border: 'none' }}>
        <Camera size={32} className="mx-auto mb-3 text-white" />
        <h3 className="text-xl font-bold text-white mb-2">See More on Instagram</h3>
        <p className="text-white/80 text-sm mb-5">
          Follow us for daily mehndi designs, makeup looks and behind-the-scenes
        </p>
        <a href="https://instagram.com/shrilekha_mehndi" target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-sm font-semibold transition-all hover:opacity-90"
          style={{ color: '#dc2743' }}>
          Follow @shrilekha_mehndi <ArrowRight size={16} />
        </a>
      </div>

      {/* Book CTA */}
      <div className="text-center mt-8">
        <p className="text-sm mb-4" style={{ color: 'var(--brand-muted)' }}>
          Like what you see? Book your appointment today!
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="https://wa.me/919623740541?text=Hi! I saw your gallery and want to book an appointment"
            target="_blank" rel="noreferrer" className="btn-primary text-sm">
            <Phone size={15} /> Book via WhatsApp
          </a>
          <Link href="/packages" className="btn-secondary text-sm">
            View Packages <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}

function GalleryCard({ item }) {
  const tagStyle = TAG_COLORS[item.tag] || { bg: '#f3f4f6', color: '#6b7280' }
  const bgColors = {
    mehndi: '#f0fdf4',
    makeup: '#fdf2f8',
    combo: '#f5f3ff',
  }
  return (
    <div className="card overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300">
      <div className="aspect-square flex items-center justify-center text-5xl sm:text-6xl relative overflow-hidden"
        style={{ backgroundColor: bgColors[item.category] || 'var(--brand-surface)' }}>
        {item.emoji}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        <div className="absolute bottom-2 left-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: tagStyle.bg, color: tagStyle.color }}>
            {item.tag}
          </span>
        </div>
      </div>
      <div className="p-3">
        <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--brand-text)' }}>{item.title}</p>
        <p className="text-xs line-clamp-1" style={{ color: 'var(--brand-muted)' }}>{item.desc}</p>
      </div>
    </div>
  )
}