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
  { image: '/bridal-mehndi.webp', label: 'Bridal Mehndi', tag: 'bridal' },
  { image: '/arabic-patterns.webp', label: 'Arabic Patterns', tag: 'arabic' },
  { image: '/glitter-mehndi.webp', label: 'Glitter Mehndi', tag: 'glitter' },
  { image: '/bridal-makeup.webp', label: 'Bridal Makeup', tag: 'makeup' },
  { image: '/party-makeup.webp', label: 'Party Makeup', tag: 'makeup' },
  { image: '/rajasthani-mehndi.webp', label: 'Rajasthani Mehndi', tag: 'traditional' },
];

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
          <img src="/hero-makeup.webp" alt="Bridal Art" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d] via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-8 left-8 lg:bottom-12 lg:left-12">
            <p className="text-[#c9a84c] font-bold uppercase tracking-[0.4em] text-[10px] mb-3">Signature Artistry</p>
            <h3 className="text-white text-3xl lg:text-5xl font-black uppercase leading-none tracking-tighter">BRIDAL<br/>MEHNDI</h3>
          </div>
        </div>
        
        {/* Side Stack */}
        <div className="col-span-4 flex flex-col gap-4">
          <div className="h-[60%] relative rounded-[2rem] lg:rounded-[3rem] overflow-hidden border border-white/10 group">
            <img src="/hero-main.webp" alt="Makeup" className="w-full h-full object-cover" />
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
          <img src="/glowup-1.webp" alt="Makeup Studio" className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-0 left-0 w-[70%] h-[60%] rounded-[2rem] md:rounded-[3rem] overflow-hidden border-4 border-[#0f2418] -rotate-6 hover:rotate-0 transition-all duration-500 shadow-2xl z-20">
          <img src="/glowup-2.webp" alt="Bridal Prep" className="w-full h-full object-cover" />
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
<section className="py-20 px-4 bg-white relative overflow-hidden">
  {/* Elegant background accent */}
  <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a84c]/5 rounded-full blur-[100px] pointer-events-none" />
  
  <div className="max-w-7xl mx-auto relative z-10">
    
    {/* Header Section */}
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="h-[1.5px] w-6 bg-[#c9a84c]"></span>
          <span className="text-[#c9a84c] text-[10px] sm:text-xs font-black uppercase tracking-[0.4em]">Elite Collection</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-[#0a0f0d] tracking-tighter leading-[0.9]">
          MOST <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#f3d382]">LOVED.</span>
        </h2>
      </div>

      <Link 
        href="/products" 
        className="group hidden md:flex items-center gap-3 text-[#0a0f0d] font-black text-xs tracking-widest hover:text-[#c9a84c] transition-all"
      >
        EXPLORE ALL
        <div className="w-10 h-10 rounded-full border border-[#0a0f0d]/10 flex items-center justify-center group-hover:bg-[#0a0f0d] group-hover:text-white transition-all duration-300">
          <ArrowRight size={16} />
        </div>
      </Link>
    </div>

    {/* Products Grid: 2 columns on mobile, 3 on desktop */}
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-10">
      {products.slice(0, 6).map((p) => (
        <div key={p.id} className="group relative">
          <div className="transition-all duration-500 ease-out hover:-translate-y-2">
            <ProductCard product={p} />
          </div>
        </div>
      ))}
    </div>

    {/* Mobile View All Button - visible only on small screens */}
    <div className="text-center mt-10 md:hidden px-2">
      <Link 
        href="/products" 
        className="flex items-center justify-center w-full py-4 rounded-xl bg-[#0a0f0d] text-white font-black tracking-widest text-[11px] gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-[#0a0f0d]/20"
      >
        VIEW ALL PRODUCTS
        <ArrowRight size={14} />
      </Link>
    </div>
  </div>
</section>

     {/* ===== PACKAGES PREVIEW ===== */}
<section className="py-24 px-4 bg-[#0a0f0d] relative overflow-hidden">
  {/* Decorative Elements */}
  <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent opacity-10" />
  
  <div className="max-w-7xl mx-auto relative z-10">
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 mb-4">
        <Sparkles size={18} className="text-[#c9a84c]" />
        <span className="text-[#c9a84c] text-xs font-black uppercase tracking-[0.3em]">Exquisite Services</span>
      </div>
      <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
        OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] via-[#f3d382] to-[#c9a84c]">PACKAGES.</span>
      </h2>
      <p className="text-gray-400 max-w-2xl mx-auto font-medium text-lg">
        Premium bridal experiences tailored to your unique style. 
        From intimate ceremonies to grand celebrations.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {PACKAGES.map((pkg) => (
        <div 
          key={pkg.name} 
          className={`relative group rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${
            pkg.popular 
            ? 'bg-white border-[#c9a84c] scale-105 z-20 shadow-[0_20px_50px_rgba(201,168,76,0.15)]' 
            : 'bg-[#111815] border-white/5 hover:border-[#c9a84c]/50'
          }`}
        >
          {pkg.popular && (
            <div className="absolute top-0 left-0 right-0 py-2 bg-[#c9a84c] text-center text-[10px] font-black text-[#0a0f0d] uppercase tracking-[0.2em]">
              Most Requested
            </div>
          )}

          <div className={`p-8 lg:p-10 ${pkg.popular ? 'pt-12' : ''}`}>
            {/* Icon & Title */}
            <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-3xl ${
              pkg.popular ? 'bg-[#0a0f0d]/5' : 'bg-white/5'
            }`}>
              {pkg.icon}
            </div>

            <h3 className={`text-2xl font-black mb-2 uppercase tracking-tight ${
              pkg.popular ? 'text-[#0a0f0d]' : 'text-white'
            }`}>
              {pkg.name}
            </h3>

            <div className="flex items-baseline gap-1 mb-8">
              <span className={`text-3xl font-black ${pkg.popular ? 'text-[#c9a84c]' : 'text-[#c9a84c]'}`}>
                {pkg.price}
              </span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Onwards</span>
            </div>

            {/* Features List */}
            <ul className="space-y-4 mb-10">
              {pkg.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm font-medium">
                  <CheckCircle 
                    size={18} 
                    className={`mt-0.5 flex-shrink-0 ${pkg.popular ? 'text-[#0a0f0d]' : 'text-[#c9a84c]'}`} 
                  />
                  <span className={pkg.popular ? 'text-gray-700' : 'text-gray-400'}>{f}</span>
                </li>
              ))}
            </ul>

            {/* Booking Button */}
            <a
              href={`https://wa.me/919623740541?text=${encodeURIComponent(
                `Hi! I want to book the ${pkg.name} package`
              )}`}
              target="_blank" 
              rel="noreferrer"
              className={`flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-black text-xs tracking-widest transition-all ${
                pkg.popular 
                ? 'bg-[#0a0f0d] text-white hover:bg-[#c9a84c] hover:text-[#0a0f0d]' 
                : 'bg-[#c9a84c] text-[#0a0f0d] hover:bg-white hover:text-[#0a0f0d]'
              }`}
            >
              <Phone size={16} /> BOOK ON WHATSAPP
            </a>
          </div>
        </div>
      ))}
    </div>

    {/* Footer Link */}
    <div className="text-center mt-16">
      <Link 
        href="/packages" 
        className="inline-flex items-center gap-2 text-white/50 hover:text-[#c9a84c] font-bold tracking-widest text-xs transition-colors"
      >
        VIEW ALL DETAILED PRICING <ChevronRight size={16} />
      </Link>
    </div>
  </div>
</section>

{/* ===== GALLERY PREVIEW ===== */}
<section className="py-24 px-4 bg-white relative">
  <div className="max-w-7xl mx-auto">
    
    {/* Header: Editorial Style */}
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="h-[1.5px] w-6 bg-[#c9a84c]"></span>
          <span className="text-[#c9a84c] text-[10px] sm:text-xs font-black uppercase tracking-[0.4em]">The Portfolio</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-[#0a0f0d] tracking-tighter leading-none">
          CRAFTING <br className="md:hidden" /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0a0f0d] via-[#c9a84c] to-[#0a0f0d]">MOMENTS.</span>
        </h2>
      </div>

      <Link 
        href="/gallery" 
        className="group flex items-center gap-3 text-[#0a0f0d] font-black text-xs tracking-widest hover:text-[#c9a84c] transition-all"
      >
        VIEW FULL PORTFOLIO
        <div className="w-10 h-10 rounded-full border border-[#0a0f0d]/10 flex items-center justify-center group-hover:bg-[#0a0f0d] group-hover:text-white transition-all">
          <ArrowRight size={16} />
        </div>
      </Link>
    </div>

    {/* Gallery Grid */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
      {GALLERY_ITEMS.map((item, i) => (
        <div 
          key={i} 
          className="group relative overflow-hidden rounded-2xl md:rounded-[2rem] bg-[#f8f8f8] border border-[#0a0f0d]/5 cursor-pointer"
        >
          <div 
            className={`aspect-square flex flex-col items-center justify-center relative transition-transform duration-700 group-hover:scale-110 ${
              i % 2 === 0 ? 'bg-[#fcfaf2]' : 'bg-white'
            }`}
          >
            {/* ✅ ONLY CHANGE: IMAGE ADDED */}
            <img
              src={item.image}
              alt={item.label}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d]/80 via-[#0a0f0d]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4 md:p-8">
              <span className="text-[#c9a84c] text-[10px] font-black uppercase tracking-widest mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                {item.tag}
              </span>
              <p className="text-white text-sm md:text-lg font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                {item.label}
              </p>
            </div>
          </div>

          <div className="md:hidden p-3 bg-white border-t border-[#0a0f0d]/5">
             <p className="text-[10px] font-black text-[#0a0f0d] uppercase tracking-tighter opacity-60">
               {item.label}
             </p>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-12 text-center md:hidden">
      <Link href="/gallery" className="inline-block text-[#0a0f0d] font-black text-xs tracking-[0.3em] border-b-2 border-[#c9a84c] pb-2">
        EXPLORE ALL WORKS
      </Link>
    </div>
  </div>
</section>
      {/* ===== TESTIMONIALS: THE WALL OF LOVE ===== */}
<section className="py-24 px-4 bg-white relative">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16 space-y-4">
      <div className="flex justify-center items-center gap-2">
        <Heart size={16} className="text-[#c9a84c] fill-[#c9a84c]" />
        <span className="text-[#c9a84c] text-xs font-black uppercase tracking-[0.4em]">Bridal Stories</span>
      </div>
      <h2 className="text-5xl md:text-6xl font-black text-[#0a0f0d] tracking-tighter">
        VOICES OF <span className="italic font-serif text-[#c9a84c]">Elegance.</span>
      </h2>
    </div>

    {/* Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {TESTIMONIALS.map((t, i) => (
        <div key={i} className="group p-8 rounded-[2rem] bg-[#fcfaf2] border border-[#0a0f0d]/5 hover:bg-[#0a0f0d] transition-all duration-500">
          <div className="flex items-center gap-1 mb-6">
            {[...Array(t.rating)].map((_, s) => (
              <Star key={s} size={14} fill="#c9a84c" className="text-[#c9a84c]" />
            ))}
          </div>
          
          <p className="text-gray-600 group-hover:text-gray-300 text-sm leading-relaxed mb-8 font-medium transition-colors">
            "{t.text}"
          </p>

          <div className="pt-6 border-t border-[#0a0f0d]/5 group-hover:border-white/10 transition-colors">
            <p className="text-[#0a0f0d] group-hover:text-white font-black text-sm uppercase tracking-tight">
              {t.name}
            </p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[#c9a84c] text-[10px] font-bold flex items-center gap-1 uppercase">
                <MapPin size={10} /> {t.location}
              </p>
              <span className="text-[9px] font-black px-2 py-1 bg-[#0a0f0d]/5 group-hover:bg-white/10 text-[#0a0f0d] group-hover:text-[#c9a84c] rounded-md uppercase tracking-tighter">
                {t.service}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

{/* ===== WHY US: THE ELITE STANDARD ===== */}
<section className="py-24 px-4 bg-[#0a0f0d] rounded-t-[3rem] lg:rounded-t-[5rem]">
  <div className="max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-12 gap-16 items-start">
      
      {/* Left Sticky Content */}
      <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
        <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">
          THE <br />
          <span className="text-[#c9a84c]">SHRILEKHA</span> <br />
          PROMISE.
        </h2>
        <p className="text-gray-400 text-lg font-medium">
          Trusted by over 500+ brides across Maharashtra for our uncompromising quality and artistic vision.
        </p>
        <div className="w-20 h-1 bg-[#c9a84c]" />
      </div>

      {/* Right Grid Content */}
      <div className="lg:col-span-8 grid sm:grid-cols-2 gap-8">
        {[
          { icon: <Leaf size={32} />, title: 'Pure & Natural', desc: '100% organic henna with no PPD or harmful chemicals. Safe for all skin types.' },
          { icon: <Palette size={32} />, title: 'Expert Artists', desc: 'Professional artists with 5+ years experience in luxury bridal aesthetics.' },
          { icon: <Truck size={32} />, title: 'Pan India Delivery', desc: 'Fast shipping across India. Free delivery on orders above ₹499.' },
          { icon: <Award size={32} />, title: 'Bridal Specialists', desc: 'Specializing in intricate bridal mehndi and high-fashion makeup.' },
          { icon: <Camera size={32} />, title: 'Portfolio Ready', desc: 'Designs crafted to look flawless under professional camera lighting.' },
          { icon: <Heart size={32} />, title: 'Made with Love', desc: 'Every cone and every design is handled with meticulous attention to detail.' },
        ].map((f, i) => (
          <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#c9a84c]/50 transition-all group">
            <div className="text-[#c9a84c] mb-6 group-hover:scale-110 transition-transform duration-300">
              {f.icon}
            </div>
            <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight">{f.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
{/* ===== FINAL CTA: SIMPLE & ELITE ===== */}
<section className="py-20 px-6 bg-white">
  <div className="max-w-5xl mx-auto">
    {/* Decorative Top Line */}
    <div className="w-12 h-[2px] bg-[#c9a84c] mb-10 mx-auto md:mx-0" />

    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
      <div className="flex-1 space-y-6 text-center md:text-left">
        <h2 className="text-5xl md:text-7xl font-black text-[#0a0f0d] tracking-tighter leading-none">
          ELEVATE YOUR <br />
          <span className="text-[#c9a84c]">AESTHETIC.</span>
        </h2>
        <p className="text-gray-500 text-lg md:text-xl font-medium max-w-md mx-auto md:mx-0">
          From organic supplies to signature bridal transformations. Pune’s luxury standard.
        </p>
      </div>

      {/* Clean Button Stack */}
      <div className="flex flex-col gap-4 w-full md:w-auto">
        <Link 
          href="/products" 
          className="group flex items-center justify-between gap-8 bg-[#0a0f0d] text-white px-8 py-5 rounded-2xl hover:bg-[#c9a84c] hover:text-[#0a0f0d] transition-all duration-300"
        >
          <span className="font-black text-xs tracking-widest uppercase">Shop Collection</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link 
          href="/packages" 
          className="group flex items-center justify-between gap-8 border-2 border-[#0a0f0d] text-[#0a0f0d] px-8 py-5 rounded-2xl hover:bg-[#0a0f0d] hover:text-white transition-all duration-300"
        >
          <span className="font-black text-xs tracking-widest uppercase">Book Services</span>
          <Palette size={20} />
        </Link>
      </div>
    </div>

    {/* Elegant Footer Link */}
    <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {[1,2,3].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-bold">
              {i === 3 ? '50+' : ''}
            </div>
          ))}
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trusted by 500+ Pune Brides</p>
      </div>
      
      <a 
        href="https://wa.me/919623740541" 
        className="text-[#c9a84c] font-black text-xs tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity"
      >
        WHATSAPP INQUIRY <Phone size={14} />
      </a>
    </div>
  </div>
</section>
    </div>
  )
}
