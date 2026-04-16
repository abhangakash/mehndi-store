import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import FloatingButtons from '@/components/FloatingButtons'
import {
  Truck, Shield, Leaf, Star, ArrowRight, Phone,
  Sparkles, Heart, Award, Users, MapPin, CheckCircle,
  Palette, Camera, ChevronRight
} from 'lucide-react'

async function getFeaturedProducts() {
  const { data } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('is_featured', true)
    .eq('is_active', true)
    .limit(6)
  return data || []
}

async function getCategories() {
  const { data } = await supabase.from('categories').select('*').limit(5)
  return data || []
}

const GALLERY_ITEMS = [
  { emoji: '🌸', label: 'Bridal Mehndi', tag: 'bridal' },
  { emoji: '🌿', label: 'Arabic Patterns', tag: 'arabic' },
  { emoji: '✨', label: 'Glitter Mehndi', tag: 'glitter' },
  { emoji: '🎨', label: 'Bridal Makeup', tag: 'makeup' },
  { emoji: '💄', label: 'Party Makeup', tag: 'makeup' },
  { emoji: '🌺', label: 'Rajasthani Mehndi', tag: 'traditional' },
]

const PACKAGES = [
  {
    name: 'Bridal Mehndi',
    price: '₹2,500',
    color: 'var(--brand-green)',
    bg: '#f0fdf4',
    icon: '👰',
    features: ['Full hands & feet mehndi', 'Bridal cone quality', 'Dark color guaranteed', 'Free touch-up', '2-3 hours session'],
  },
  {
    name: 'Bridal Makeup',
    price: '₹5,000',
    color: 'var(--brand-brown)',
    bg: '#fef9ee',
    icon: '💄',
    features: ['Airbrush foundation', 'HD makeup', 'Hairstyling included', 'Saree draping', 'Touch-up kit'],
    popular: true,
  },
  {
    name: 'Mehndi + Makeup Combo',
    price: '₹7,000',
    color: '#534AB7',
    bg: '#f5f3ff',
    icon: '✨',
    features: ['Full bridal mehndi', 'Bridal makeup', 'Hairstyling', 'Pre-bridal skin prep', 'Saree draping', 'Best value'],
  },
]

const TESTIMONIALS = [
  { name: 'Sneha Patil', location: 'Pune', rating: 5, text: 'Absolutely stunning bridal mehndi! The design was intricate and the color was so dark. Got compliments from everyone at my wedding!', service: 'Bridal Mehndi' },
  { name: 'Priya Sharma', location: 'Mumbai', rating: 5, text: 'Shrilekha did my bridal makeup and I looked like a completely different person — in the best way! Very professional and skilled.', service: 'Bridal Makeup' },
  { name: 'Anita Kulkarni', location: 'Nashik', rating: 5, text: 'Ordered the natural henna cones and the quality is amazing. Smooth flow, dark color, lasts 2+ weeks. Definitely ordering again!', service: 'Mehndi Products' },
  { name: 'Ritu Verma', location: 'Pune', rating: 4, text: 'The beginner mehndi kit is perfect for home use. Design booklet is helpful and the cones are easy to use.', service: 'Mehndi Kit' },
]

export const metadata = {
  title: 'Shrilekha Mehndi Art & Glowup Studio — Pune',
  description: 'Premium mehndi art and professional bridal makeup studio in Pune. Shop natural henna cones, bridal mehndi packages and makeup services. Free shipping above ₹499.',
  keywords: 'mehndi, henna, bridal mehndi Pune, makeup artist Pune, henna cones, Shrilekha',
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([getFeaturedProducts(), getCategories()])

  return (
    <div>
      <FloatingButtons />

      {/* ===== HERO ===== */}
      <section style={{ background: 'linear-gradient(135deg, #1a3320 0%, #2d5016 40%, #3a5a40 100%)' }}
        className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #c9a84c 0%, transparent 50%), radial-gradient(circle at 80% 20%, #588157 0%, transparent 40%)' }} />
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
                style={{ backgroundColor: 'rgba(201,168,76,0.2)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)' }}>
                <Sparkles size={12} /> Pune's Trusted Mehndi & Makeup Studio
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 text-white">
                Where Every<br />
                <span style={{ color: '#c9a84c' }}>Design</span> Tells<br />
                a Story
              </h1>
              <p className="text-base mb-8 leading-relaxed text-white/70 max-w-md">
                Premium natural henna products, bridal mehndi art and professional makeup services.
                Crafted with love in Pune, delivered across India.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/products" className="btn-brown text-sm">
                  Shop Products <ArrowRight size={16} />
                </Link>
                <Link href="/packages" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border border-white/30 text-white hover:bg-white/10 transition-colors">
                  <Palette size={16} /> View Packages
                </Link>
              </div>
              <div className="flex flex-wrap gap-5 mt-8">
                {[
                  { icon: <Truck size={14} />, text: 'Free shipping ₹499+' },
                  { icon: <Shield size={14} />, text: '100% Natural' },
                  { icon: <Star size={14} />, text: '4.8★ Rated' },
                  { icon: <Users size={14} />, text: '500+ Happy Customers' },
                ].map(b => (
                  <div key={b.text} className="flex items-center gap-1.5 text-xs text-white/60">
                    <span style={{ color: '#c9a84c' }}>{b.icon}</span>
                    {b.text}
                  </div>
                ))}
              </div>
            </div>
            {/* Hero cards */}
            <div className="hidden md:grid grid-cols-2 gap-4">
              {[
                { emoji: '🌿', title: 'Natural Henna', sub: 'Pure Rajasthani henna cones', bg: 'rgba(255,255,255,0.08)' },
                { emoji: '👰', title: 'Bridal Mehndi', sub: 'Intricate bridal designs', bg: 'rgba(201,168,76,0.15)' },
                { emoji: '💄', title: 'Bridal Makeup', sub: 'Shrilekha Glowup Studio', bg: 'rgba(255,255,255,0.08)' },
                { emoji: '✨', title: 'Glitter Mehndi', sub: 'Festival & party special', bg: 'rgba(201,168,76,0.15)' },
              ].map(c => (
                <div key={c.title} className="rounded-2xl p-5 flex flex-col items-center text-center"
                  style={{ backgroundColor: c.bg, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="text-4xl mb-2">{c.emoji}</div>
                  <p className="text-white font-medium text-sm">{c.title}</p>
                  <p className="text-white/50 text-xs mt-1">{c.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="border-y py-3 overflow-x-auto" style={{ borderColor: 'var(--brand-border)', backgroundColor: 'white' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-6 md:gap-8 justify-start md:justify-center min-w-max md:min-w-0">
            {[
              { icon: <Truck size={16} />, title: 'Free Shipping', sub: 'Orders above ₹499' },
              { icon: <Shield size={16} />, title: '100% Natural', sub: 'No harmful chemicals' },
              { icon: <Leaf size={16} />, title: 'Eco Friendly', sub: 'Sustainable packaging' },
              { icon: <Phone size={16} />, title: 'COD Available', sub: 'Orders above ₹999' },
              { icon: <Award size={16} />, title: 'Certified Artist', sub: 'Professional services' },
            ].map(b => (
              <div key={b.title} className="flex items-center gap-2.5 py-2 flex-shrink-0">
                <span style={{ color: 'var(--brand-green)' }}>{b.icon}</span>
                <div>
                  <div className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>{b.title}</div>
                  <div className="text-xs" style={{ color: 'var(--brand-muted)' }}>{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SHRILEKHA GLOWUP SECTION ===== */}
      <section className="py-14 px-4" style={{ backgroundColor: 'var(--brand-surface)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
                style={{ backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
                <Sparkles size={12} /> Introducing Shrilekha Glowup
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight" style={{ color: 'var(--brand-text)' }}>
                Your Complete<br />
                <span style={{ color: 'var(--brand-brown)' }}>Bridal Beauty</span> Studio
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--brand-muted)' }}>
                Shrilekha Glowup is our professional makeup studio in Pune. From pre-bridal sessions to wedding day glam,
                we make sure you look and feel your absolute best. Combined with our signature mehndi art,
                we're your one-stop destination for complete bridal beauty.
              </p>
              <div className="flex flex-col gap-3 mb-6">
                {[
                  'Professional HD & Airbrush makeup',
                  'Hairstyling & saree draping',
                  'Pre-bridal skin preparation',
                  'Mehndi + Makeup combo packages',
                ].map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle size={16} style={{ color: 'var(--brand-green)', flexShrink: 0 }} />
                    <span className="text-sm" style={{ color: 'var(--brand-text)' }}>{f}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/packages" className="btn-brown text-sm">
                  View Packages <ArrowRight size={15} />
                </Link>
                <a href="https://wa.me/919623740541?text=Hi! I want to book a makeup appointment"
                  target="_blank" rel="noreferrer" className="btn-secondary text-sm">
                  <Phone size={15} /> Book Appointment
                </a>
              </div>
            </div>
            {/* Makeup service cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji: '💄', title: 'Bridal Makeup', desc: 'Complete bridal look with HD makeup', color: '#fef9ee', border: '#fde68a' },
                { emoji: '✨', title: 'Party Makeup', desc: 'Glam looks for every occasion', color: '#f5f3ff', border: '#c4b5fd' },
                { emoji: '🌸', title: 'Pre-Bridal', desc: 'Skin prep & facial sessions', color: '#fdf2f8', border: '#f9a8d4' },
                { emoji: '💆', title: 'Hair Styling', desc: 'Traditional & modern hairstyles', color: '#f0fdf4', border: '#86efac' },
              ].map(s => (
                <div key={s.title} className="rounded-xl p-4 border"
                  style={{ backgroundColor: s.color, borderColor: s.border }}>
                  <div className="text-3xl mb-2">{s.emoji}</div>
                  <p className="font-semibold text-sm mb-1" style={{ color: 'var(--brand-text)' }}>{s.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--brand-muted)' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="section-title justify-center">Shop by Category</h2>
            <p className="section-subtitle">Find exactly what you need</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {categories.map(cat => (
              <Link key={cat.id} href={`/products?category=${cat.slug}`}
                className="card p-4 text-center hover:shadow-md transition-all group hover:border-green-300">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🌿</div>
                <div className="text-xs font-medium" style={{ color: 'var(--brand-green)' }}>{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-12 px-4" style={{ backgroundColor: 'var(--brand-surface)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Our most loved henna picks</p>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-1 text-sm font-medium"
              style={{ color: 'var(--brand-green)' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 md:gap-4">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="text-center mt-6 sm:hidden">
            <Link href="/products" className="btn-secondary text-sm">
              View All Products <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PACKAGES PREVIEW ===== */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-title">Our Packages</h2>
            <p className="section-subtitle">Complete mehndi & makeup packages for every occasion</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {PACKAGES.map(pkg => (
              <div key={pkg.name} className="card overflow-hidden relative"
                style={{ borderColor: pkg.popular ? pkg.color : 'var(--brand-border)' }}>
                {pkg.popular && (
                  <div className="absolute top-0 left-0 right-0 py-1.5 text-center text-xs font-semibold text-white"
                    style={{ backgroundColor: pkg.color }}>
                    ⭐ Most Popular
                  </div>
                )}
                <div className={`p-6 ${pkg.popular ? 'pt-10' : ''}`} style={{ backgroundColor: pkg.bg }}>
                  <div className="text-4xl mb-3">{pkg.icon}</div>
                  <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--brand-text)' }}>{pkg.name}</h3>
                  <div className="text-2xl font-bold mb-4" style={{ color: pkg.color }}>
                    {pkg.price} <span className="text-sm font-normal text-gray-400">onwards</span>
                  </div>
                  <ul className="flex flex-col gap-2 mb-5">
                    {pkg.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm" style={{ color: 'var(--brand-muted)' }}>
                        <CheckCircle size={14} className="mt-0.5 flex-shrink-0" style={{ color: pkg.color }} />
                        {f}
                      </li>
                    ))}
                  </ul>
<a
  href={`https://wa.me/919623740541?text=${encodeURIComponent(
    `Hi! I want to book the ${pkg.name} package`
  )}`}
                      target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium text-white transition-colors"
                    style={{ backgroundColor: pkg.color }}>
                    <Phone size={14} /> Book via WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/packages" className="btn-secondary text-sm">
              See All Packages & Pricing <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== GALLERY PREVIEW ===== */}
      <section className="py-14 px-4" style={{ backgroundColor: 'var(--brand-surface)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="section-title">Our Work</h2>
              <p className="section-subtitle">A glimpse of our mehndi & makeup portfolio</p>
            </div>
            <Link href="/gallery" className="hidden sm:flex items-center gap-1 text-sm font-medium"
              style={{ color: 'var(--brand-green)' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            {GALLERY_ITEMS.map((item, i) => (
              <div key={i} className="card overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
                <div className="aspect-square flex items-center justify-center text-6xl relative"
                  style={{ backgroundColor: i % 2 === 0 ? 'var(--brand-surface)' : '#fef9ee' }}>
                  {item.emoji}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-end p-3 opacity-0 group-hover:opacity-100">
                    <span className="badge badge-green text-xs">{item.tag}</span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium" style={{ color: 'var(--brand-text)' }}>{item.label}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6 sm:hidden">
            <Link href="/gallery" className="btn-secondary text-sm">View Gallery</Link>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Real experiences from real customers</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card p-5">
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, s) => (
                    <Star key={s} size={13} fill="#c9a84c" color="#c9a84c" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4 italic" style={{ color: 'var(--brand-muted)' }}>
                  "{t.text}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>{t.name}</p>
                    <p className="text-xs flex items-center gap-1" style={{ color: 'var(--brand-muted)' }}>
                      <MapPin size={10} /> {t.location}
                    </p>
                  </div>
                  <span className="badge badge-green text-xs">{t.service}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section className="py-14 px-4" style={{ backgroundColor: 'var(--brand-surface)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-title">Why Choose Shrilekha?</h2>
            <p className="section-subtitle">Trusted by 500+ customers across Maharashtra</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { emoji: '🌿', title: 'Pure & Natural', desc: '100% natural henna with no PPD or harmful chemicals. Safe for all skin types including sensitive skin.' },
              { emoji: '🎨', title: 'Expert Artists', desc: 'Trained professional mehndi and makeup artists with 5+ years experience in bridal services.' },
              { emoji: '🚚', title: 'Pan India Delivery', desc: 'Fast shipping across India. Free delivery on orders above ₹499. COD available above ₹999.' },
              { emoji: '💍', title: 'Bridal Specialists', desc: 'Specializing in bridal mehndi and makeup. Complete bridal beauty packages available.' },
              { emoji: '📸', title: 'Portfolio Ready', desc: 'Every design is photo-ready. We ensure your look is perfect for photos and videos.' },
              { emoji: '❤️', title: 'Made with Love', desc: 'Every cone, every design, every makeover is crafted with love and attention to detail.' },
            ].map(f => (
              <div key={f.title} className="card p-6 hover:shadow-md transition-all">
                <div className="text-4xl mb-3">{f.emoji}</div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--brand-green)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--brand-muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-14 px-4" style={{ background: 'linear-gradient(135deg, #1a3320, #3a5a40)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to Look Your Best?
          </h2>
          <p className="text-white/70 mb-8 text-sm leading-relaxed">
            Shop our premium henna products or book a mehndi/makeup appointment in Pune.
            Free shipping on orders above ₹499.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/products" className="btn-brown text-sm">
              Shop Products <ArrowRight size={16} />
            </Link>
            <Link href="/packages" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border border-white/30 text-white hover:bg-white/10 transition-colors">
              <Palette size={16} /> Book Service
            </Link>
            <a href="https://wa.me/919623740541?text=Hi! I want to know more about your services"
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border border-white/30 text-white hover:bg-white/10 transition-colors">
              <Phone size={16} /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}