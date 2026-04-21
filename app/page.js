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

 {/* ===== HERO SECTION ===== */}
<section className="relative min-h-screen flex items-center bg-[#0a0f0d] pt-20 pb-12 lg:pt-32 lg:pb-20 overflow-hidden">
  
  {/* THE LUXURY "S" WAVE TRANSITION */}
  <div className="absolute top-0 left-0 w-full z-0 pointer-events-none">
    {/* Layer 1: Main White Flow */}
    <svg 
      viewBox="0 0 1440 700" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className="w-full h-[50vh] lg:h-auto"
      preserveAspectRatio="none"
    >
      <path 
        fill="white" 
        d="M0,0H1440V300C1440,300 1250,550 1000,450C750,350 500,650 0,550V0Z"
      />
      {/* Layer 2: Gold Accent Path - Gives the "S" its luxury edge */}
      <path 
        d="M0,550C500,650 750,350 1000,450C1250,550 1440,300 1440,300" 
        stroke="#c9a84c" 
        strokeWidth="2" 
        strokeOpacity="0.3"
      />
    </svg>
  </div>

  {/* Ambient Background Glows */}
  <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] bg-[#c9a84c] rounded-full blur-[160px] opacity-10 pointer-events-none" />

  <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 w-full">
    <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
      
      {/* Text Content */}
      <div className="lg:col-span-5 space-y-6 lg:space-y-10 text-center lg:text-left order-2 lg:order-1 mt-16 lg:mt-0">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black/5 border border-black/10 backdrop-blur-xl">
          <span className="flex h-2 w-2 rounded-full bg-[#c9a84c] animate-pulse" />
          <span className="text-[#0a0f0d] text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase">Pune's Elite Studio</span>
        </div>
        
        {/* TYPOGRAPHY: mix-blend-exclusion makes the text flip colors over the wave */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tighter mix-blend-exclusion text-white">
          BOLD <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] via-[#f3d382] to-[#c9a84c] animate-gradient-x">
            BEAUTY.
          </span>
        </h1>

        <p className="text-gray-600 lg:text-gray-400 text-base md:text-xl leading-relaxed max-w-md mx-auto lg:mx-0 font-medium">
          Redefining bridal elegance with organic henna and high-fashion makeup. 
          Where tradition meets the modern edge.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 lg:pt-0">
          <Link href="/products" className="group relative overflow-hidden bg-[#0a0f0d] text-white lg:bg-[#c9a84c] lg:text-[#0a0f0d] px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:shadow-[0_20px_50px_rgba(201,168,76,0.3)] transition-all">
            <span className="relative z-10">SHOP COLLECTION</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform" />
          </Link>
          <Link href="/packages" className="px-10 py-5 rounded-2xl border-2 border-[#0a0f0d]/10 lg:border-[#c9a84c]/30 text-[#0a0f0d] lg:text-white font-black hover:bg-white/5 transition-all text-center">
            BOOK SERVICES
          </Link>
        </div>
      </div>

      {/* Visual Bento Grid */}
      <div className="lg:col-span-7 grid grid-cols-12 gap-4 h-[450px] lg:h-[700px] order-1 lg:order-2">
        {/* Main Bridal Image */}
        <div className="col-span-8 relative rounded-[2.5rem] lg:rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl group">
          <img src="/hero-main.jpg" alt="Bridal Art" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d] via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-8 left-8 lg:bottom-12 lg:left-12">
            <p className="text-[#c9a84c] font-bold uppercase tracking-[0.4em] text-[10px] mb-3">Signature Artistry</p>
            <h3 className="text-white text-3xl lg:text-5xl font-black uppercase leading-none tracking-tighter">BRIDAL<br/>MEHNDI</h3>
          </div>
        </div>
        
        {/* Side Stack */}
        <div className="col-span-4 flex flex-col gap-4">
          <div className="h-[60%] relative rounded-[2rem] lg:rounded-[3rem] overflow-hidden border border-white/10 group">
            <img src="/hero-makeup.jpg" alt="Makeup" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="h-[40%] relative rounded-[2rem] lg:rounded-[3rem] overflow-hidden border-2 border-[#c9a84c]/20 bg-white flex flex-col items-center justify-center p-6 text-center shadow-xl">
            <div className="w-12 h-12 rounded-full bg-[#c9a84c]/10 flex items-center justify-center mb-3">
              <Leaf size={24} className="text-[#c9a84c]" />
            </div>
            <p className="text-[#0a0f0d] font-black text-[10px] lg:text-xs uppercase tracking-widest leading-tight">100% Organic<br/>Certified</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

{/* ===== TRUST BAR ===== */}
<section className="bg-white py-14 border-y border-[#0a0f0d]/5 relative z-10">
  <div className="max-w-7xl mx-auto px-4 sm:px-8">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
      {[
        { icon: Truck, label: "EXPRESS DELIVERY", sub: "Pan India Shipping" },
        { icon: Shield, label: "PURE ORGANIC", sub: "Lab Tested Goods" },
        { icon: Star, label: "5-STAR RATING", sub: "Trusted by Brides" },
        { icon: Award, label: "PUNE'S BEST", sub: "Expert Artistry" }
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 group">
          <div className="w-14 h-14 rounded-2xl bg-[#0a0f0d]/5 flex items-center justify-center text-[#c9a84c] group-hover:bg-[#0a0f0d] group-hover:text-white transition-all duration-500">
            <item.icon size={28} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[#0a0f0d] font-black text-sm tracking-tight uppercase">{item.label}</p>
            <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mt-1">{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

{/* ===== SHRILEKHA GLOWUP SECTION ===== */}
<section className="py-20 lg:py-24 bg-[#0a0f0d] relative overflow-hidden">
  <div className="max-w-7xl mx-auto px-4 sm:px-6">
    <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
      
      <div className="relative h-[350px] md:h-[500px] order-2 lg:order-1">
        <div className="absolute top-0 right-0 w-[85%] h-[80%] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden border-4 border-[#0f2418] rotate-3 hover:rotate-0 transition-all duration-500 shadow-2xl">
          <img src="/glowup-1.jpg" alt="Makeup Studio" className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-0 left-0 w-[70%] h-[60%] rounded-[2rem] md:rounded-[3rem] overflow-hidden border-4 border-[#0f2418] -rotate-6 hover:rotate-0 transition-all duration-500 shadow-2xl z-20">
          <img src="/glowup-2.jpg" alt="Bridal Prep" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="order-1 lg:order-2 space-y-6 text-center lg:text-left">
        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase">
          THE <span className="text-[#c9a84c]">GLOWUP</span> <br />
          EXPERIENCE
        </h2>
        <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
          From the first stroke of henna to the final touch of lipstick, our Pune-based studio 
          offers a complete transformation sanctuary for the modern bride.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-md mx-auto lg:mx-0">
          {['HD Makeup', 'Airbrush Tech', 'Saree Draping', 'Hair Styling'].map(item => (
            <div key={item} className="flex items-center gap-3 p-4 rounded-2xl bg-[#c9a84c]/5 border border-[#c9a84c]/10">
              <CheckCircle size={18} className="text-[#c9a84c] flex-shrink-0" />
              <span className="text-white font-bold text-xs uppercase tracking-wider">{item}</span>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <a href="https://wa.me/919623740541" className="inline-flex items-center gap-3 bg-[#c9a84c] text-[#0a0f0d] px-10 py-4 rounded-full font-black hover:bg-white transition-colors text-sm md:text-base">
            BOOK APPOINTMENT <Phone size={18} />
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

{/* ===== MINIMAL CATEGORIES SECTION ===== */}
<section className="py-12 lg:py-16 bg-[#0a0f0d]">
  <div className="max-w-7xl mx-auto px-6">
    
    {/* Compact Header */}
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl lg:text-3xl font-black text-white uppercase tracking-tighter">The Shop</h2>
        <p className="text-[#c9a84c] font-bold text-[10px] uppercase tracking-widest">Organic Collection</p>
      </div>
      <Link href="/products" className="text-white/40 hover:text-[#c9a84c] text-[10px] font-bold uppercase tracking-widest border-b border-white/10 pb-1 transition-all">
        View All
      </Link>
    </div>

    {/* Compact Square Grid */}
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 lg:gap-4">
      {categories.map((cat) => (
        <Link 
          key={cat.id} 
          href={`/products?category=${cat.slug}`}
          className="group relative aspect-square rounded-2xl lg:rounded-[2rem] overflow-hidden bg-[#0f1a14] border border-white/5"
        >
          <img 
            src={`/cat-${cat.slug}.jpg`} 
            alt={cat.name} 
            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
          />
          
          {/* Simple Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          {/* Centered Minimal Label */}
          <div className="absolute inset-0 flex items-end justify-center pb-4 lg:pb-6">
            <span className="text-white font-bold uppercase tracking-widest text-[9px] lg:text-[11px] group-hover:text-[#c9a84c] transition-colors">
              {cat.name}
            </span>
          </div>
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