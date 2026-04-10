import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import { Truck, Shield, Leaf, Star, ArrowRight, Phone } from 'lucide-react'

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
  const { data } = await supabase
    .from('categories')
    .select('*')
    .limit(5)
  return data || []
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ backgroundColor: 'var(--brand-surface)' }}>
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-4"
              style={{ backgroundColor: '#dcfce7', color: 'var(--brand-green)' }}>
              🌿 100% Natural Henna
            </span>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--brand-green)' }}>
              Where Every<br />
              <span style={{ color: 'var(--brand-brown)' }}>Design</span> Tells<br />
              a Story
            </h1>
            <p className="text-base mb-8 leading-relaxed" style={{ color: 'var(--brand-muted)' }}>
              Premium quality henna cones, bridal collections and mehndi accessories.
              Crafted with love from Pune, delivered across India.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary text-sm">
                Shop Now <ArrowRight size={16} />
              </Link>
              <a href="https://wa.me/919623740541" target="_blank" rel="noreferrer" className="btn-secondary text-sm">
                <Phone size={16} /> WhatsApp Us
              </a>
            </div>
            {/* Trust mini badges */}
            <div className="flex flex-wrap gap-4 mt-8">
              {[
                { icon: <Truck size={14} />, text: 'Free shipping ₹499+' },
                { icon: <Shield size={14} />, text: 'Safe & Natural' },
                { icon: <Star size={14} />, text: '4.8★ Rated' },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--brand-muted)' }}>
                  <span style={{ color: 'var(--brand-green)' }}>{b.icon}</span>
                  {b.text}
                </div>
              ))}
            </div>
          </div>
          {/* Hero visual */}
          <div className="hidden md:flex items-center justify-center">
            <div className="w-72 h-72 rounded-full flex items-center justify-center text-9xl"
              style={{ backgroundColor: 'var(--brand-green)', opacity: 0.1 }}>
            </div>
            <div className="absolute text-9xl select-none">🌿</div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y py-4" style={{ borderColor: 'var(--brand-border)', backgroundColor: 'white' }}>
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Truck size={18} />, title: 'Free Shipping', sub: 'On orders above ₹499' },
            { icon: <Shield size={18} />, title: '100% Natural', sub: 'No harmful chemicals' },
            { icon: <Leaf size={18} />, title: 'Eco Friendly', sub: 'Sustainable packaging' },
            { icon: <Phone size={18} />, title: 'COD Available', sub: 'On orders above ₹999' },
          ].map(b => (
            <div key={b.title} className="flex items-center gap-3 py-1">
              <span style={{ color: 'var(--brand-green)' }}>{b.icon}</span>
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>{b.title}</div>
                <div className="text-xs" style={{ color: 'var(--brand-muted)' }}>{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="section-title">Shop by Category</h2>
        <p className="section-subtitle">Find exactly what you need</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {categories.map(cat => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`}
              className="card p-4 text-center hover:shadow-md transition-all group">
              <div className="text-3xl mb-2">🌿</div>
              <div className="text-sm font-medium" style={{ color: 'var(--brand-green)' }}>{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Our most loved picks</p>
          </div>
          <Link href="/products" className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--brand-green)' }}>
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Why Us */}
      <section className="py-14" style={{ backgroundColor: 'var(--brand-surface)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="section-title text-center">Why Shrilekha?</h2>
          <p className="section-subtitle text-center">Trusted by thousands of customers across India</p>
          <div className="grid md:grid-cols-3 gap-6 mt-2">
            {[
              { emoji: '🌿', title: 'Pure & Natural', desc: 'All products made from 100% natural henna. No PPD, no harmful chemicals. Safe for all skin types.' },
              { emoji: '🎨', title: 'Artist Quality', desc: 'Professional-grade cones with smooth flow, perfect for intricate bridal and festive designs.' },
              { emoji: '🚚', title: 'Pan India Delivery', desc: 'Fast delivery across India. Free shipping on orders above ₹499. COD available on orders above ₹999.' },
            ].map(f => (
              <div key={f.title} className="card p-6 text-center">
                <div className="text-4xl mb-3">{f.emoji}</div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--brand-green)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--brand-muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-14" style={{ backgroundColor: 'var(--brand-green)' }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Ready to Create Beautiful Designs?</h2>
          <p className="text-white/70 mb-6 text-sm">Shop our premium collection and get free shipping on orders above ₹499</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/products" className="btn-brown text-sm">
              Shop Now <ArrowRight size={16} />
            </Link>
            <a href="https://wa.me/919623740541?text=Hi, I want to know more about your mehndi products"
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border border-white/30 text-white hover:bg-white/10 transition-colors">
              <Phone size={16} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}