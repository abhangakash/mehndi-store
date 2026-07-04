import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import FloatingButtons from '@/components/FloatingButtons'
import {
  Truck, Shield, Leaf, Star, ArrowRight, Phone,
  Sparkles, Heart, Award, Users, MapPin, CheckCircle,
  Palette, Camera, ChevronRight, ShoppingCart
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
  { image: '/img13.webp', label: 'Joint Pain Relief', tag: 'joints' },
  { image: '/img14.webp', label: 'Muscle Recovery', tag: 'muscles' },
  { image: '/img15.webp', label: '100% Organic Herbs', tag: 'ingredients' },
  { image: '/img11.webp', label: 'Therapeutic Massage', tag: 'application' },
  { image: '/img16.webp', label: 'CrabVeda 200ml Bottle', tag: 'product' },
  { image: '/img12.webp', label: 'Inflammation Reduction', tag: 'healing' },
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
  title: 'CrabVeda — Ayurvedic Crab Oil for Joint & Muscle Care',
  description: 'Premium Ayurvedic Crab Oil to relieve joint pain, stiffness, and inflammation. Natural healing for improved mobility and flexibility. Shop CrabVeda 200ml bottles online.',
  keywords: 'CrabVeda, crab oil, Ayurvedic oil, joint pain relief, muscle care, inflammation remedy, natural healing, stiffness relief, mobility',
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([getFeaturedProducts(), getCategories()])

  return (
    <div>
      <FloatingButtons />
{/* ===== HERO SECTION ===== */}
<section className="relative min-h-[1svh] flex items-center bg-slate-50 pt-8 pb-12 md:pt-24 md:pb-16 lg:pt-12 lg:pb-20 overflow-hidden">
  
  {/* S-Wave */}
  <div className="absolute top-0 left-0 w-full z-0 pointer-events-none">
    <svg
      viewBox="0 0 1440 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-[30vh] md:h-[45vh] lg:h-auto"
      preserveAspectRatio="none"
    >
      <path fill="white" d="M0,0H1440V300C1440,300 1250,550 1000,450C750,350 500,650 0,550V0Z" />
      <path d="M0,550C500,650 750,350 1000,450C1250,550 1440,300 1440,300"
        stroke="#c9a84c" strokeWidth="2" strokeOpacity="0.2" />
    </svg>
  </div>

  {/* Ambient glow */}
  <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] bg-[#c9a84c]/20 rounded-full blur-[160px] pointer-events-none" />

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-16 items-center">

      {/* ===== BENTO GRID (FIRST ON MOBILE) ===== */}
      <div className="lg:col-span-7 order-1 lg:order-2 w-full">
        <div className="grid grid-cols-12 gap-3 md:gap-4 h-auto lg:h-[600px]">

          {/* Main image */}
          <div className="col-span-12 lg:col-span-8 relative rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-black/5 shadow-xl group h-[280px] sm:h-[360px] md:h-[420px] lg:h-full">
            <img src="/img2.jpeg" alt="Therapeutic Oil Formulation"
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8">
              <p className="text-[#c9a84c] font-bold uppercase tracking-[0.4em] text-[10px] mb-1">
                Targeted Care
              </p>
              <h3 className="text-white text-2xl md:text-4xl font-black uppercase leading-none tracking-tight">
                CRABVEDA<br />OIL
              </h3>
            </div>
          </div>

          {/* Side items */}
          <div className="col-span-12 lg:col-span-4 flex flex-row lg:flex-col gap-3 md:gap-4">
            <div className="w-1/2 lg:w-full h-[140px] lg:flex-1 relative rounded-2xl overflow-hidden border border-black/5 shadow-md">
              <img src="/img8.png" alt="Herbal Ingredients" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/5" />
            </div>
            
            <div className="w-1/2 lg:w-full lg:h-[35%] relative rounded-2xl border border-[#c9a84c]/30 bg-white flex flex-col items-center justify-center p-4 text-center shadow-md">
              <div className="w-10 h-10 rounded-full bg-[#c9a84c]/10 flex items-center justify-center mb-2">
                <Leaf size={20} className="text-[#c9a84c]" />
              </div>
              <p className="text-[#0a0f0d] font-black text-[10px] md:text-xs uppercase tracking-wider leading-tight">
                100% Organic<br />Certified
              </p>
            </div>
          </div>
          
        </div>
      </div>

      {/* ===== TEXT CONTENT & PRICE/BUY (SECOND ON MOBILE) ===== */}
      <div className="lg:col-span-5 flex flex-col gap-5 md:gap-6 lg:gap-8 text-center lg:text-left order-2 lg:order-1">

        {/* ===== MOBILE ONLY: HIGH-VISIBILITY TOP PRICING & BUY BLOCK ===== */}
        <div className="flex flex-col gap-3 lg:hidden w-full max-w-md mx-auto mt-4">
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl font-black text-[#0a0f0d]">₹360</span>
            <span className="text-sm text-gray-400 line-through font-bold">₹720</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded">50% OFF</span>
          </div>
          <Link href="/checkout?item=crabveda"
            className="bg-[#0a0f0d] text-white py-4 rounded-xl font-black flex items-center justify-center gap-3 active:scale-[0.98] transition-all text-base shadow-lg shadow-black/10">
            <ShoppingCart size={18} />
            <span>BUY NOW</span>
          </Link>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black/5 border border-black/10 backdrop-blur-xl self-center lg:self-start">
          <span className="flex h-2 w-2 rounded-full bg-[#c9a84c]" />
          <span className="text-[#0a0f0d] text-[10px] font-black tracking-[0.3em] uppercase">Premium Wellness</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-black leading-[0.9] tracking-tighter text-[#0a0f0d]">
          BOLD <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#a48434]">
            RELIEF.
          </span>
        </h1>

        <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-sm md:max-w-md mx-auto lg:mx-0 font-medium">
          Redefining pain management with highly concentrated Ayurvedic extracts. 
          Where ancient holistic wisdom meets targeted joint restoration.
        </p>

        {/* ===== DESKTOP ONLY: PRICING & ACTION BLOCK ===== */}
        <div className="hidden lg:flex flex-col gap-6">
          <div className="flex items-center gap-3 my-2">
            <span className="text-4xl font-black text-[#0a0f0d]">₹360</span>
            <span className="text-base text-gray-400 line-through font-bold">₹720</span>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-1 rounded-md">50% OFF</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <Link href="/checkout?item=crabveda"
              className="group bg-[#0a0f0d] text-white px-8 py-4 rounded-xl font-black flex items-center justify-center gap-3 hover:bg-[#c9a84c] hover:text-[#0a0f0d] transition-all text-base w-full shadow-lg shadow-black/10">
              <ShoppingCart size={18} />
              <span>BUY NOW</span>
            </Link>
            
            <Link href="/products"
              className="group border border-black/10 bg-white text-[#0a0f0d] px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all text-base w-full">
              <span>Explore Suite</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Secondary exploration button specifically structured for mobile layout trail */}
        <div className="lg:hidden w-full max-w-md mx-auto">
          <Link href="/products"
            className="group border border-black/10 bg-white text-[#0a0f0d] py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm w-full">
            <span>Explore Entire Suite</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>

    </div>
  </div>
</section>

{/* ===== TRUST BAR ===== */}
<section className="bg-white py-10 border-y border-black/5 relative z-10">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
      {[
        { icon: Truck, label: 'EXPRESS DELIVERY', sub: 'Pan India Shipping' },
        { icon: Shield, label: 'PURE ORGANIC', sub: 'Lab Tested Goods' },
        { icon: Star, label: '5-STAR RATINGS', sub: 'Trusted Recovery' },
        { icon: Award, label: "AYURVEDIC POTENCY", sub: 'Expert Formulation' },
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left gap-3 group">
          <div className="w-12 h-12 rounded-xl bg-[#0a0f0d]/5 flex items-center justify-center text-[#c9a84c] group-hover:bg-[#0a0f0d] group-hover:text-white transition-all duration-300">
            <item.icon size={22} strokeWidth={2} />
          </div>
          <div>
            <p className="text-[#0a0f0d] font-black text-xs md:text-sm tracking-tight uppercase">{item.label}</p>
            <p className="text-gray-400 text-[10px] font-bold tracking-wider uppercase mt-0.5">{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
{/* ===== RECOVERY SECTION ===== */}
<section className="py-14 md:py-20 lg:py-24 bg-[#0a0f0d] relative overflow-hidden">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 lg:gap-20 items-center">

      {/* Images — on mobile stack vertically, on tablet go side by side, on desktop overlap */}
      <div className="relative order-2 lg:order-1">
        {/* Mobile / Tablet: simple 2-image row */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:hidden h-[240px] sm:h-[280px] md:h-[340px]">
          <div className="rounded-2xl md:rounded-3xl overflow-hidden border-2 border-[#0f2418]">
            <img src="/img13.webp" alt="Ayurvedic Extraction" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl md:rounded-3xl overflow-hidden border-2 border-[#0f2418] mt-6 md:mt-10">
            <img src="/img16.webp" alt="Therapeutic Massage" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Desktop: overlapping rotated cards */}
        <div className="hidden lg:block relative h-[500px]">
          <div className="absolute top-0 right-0 w-[85%] h-[80%] rounded-[3.5rem] overflow-hidden border-4 border-[#0f2418] rotate-3 hover:rotate-0 transition-all duration-500 shadow-2xl">
            <img src="/img13.webp" alt="Ayurvedic Extraction" className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-0 left-0 w-[70%] h-[60%] rounded-[3rem] overflow-hidden border-4 border-[#0f2418] -rotate-6 hover:rotate-0 transition-all duration-500 shadow-2xl z-20">
            <img src="/img16.webp" alt="Therapeutic Massage" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="order-1 lg:order-2 flex flex-col gap-5 md:gap-6 text-center lg:text-left">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight uppercase">
          THE <span className="text-[#c9a84c]">RECOVERY</span> <br />
          EXPERIENCE
        </h2>
        <p className="text-gray-400 text-sm md:text-base lg:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
          From deep muscle soreness to persistent joint discomfort, our authentic Ayurvedic blends
          offer a profound healing sanctuary for long-lasting pain relief and mobility.
        </p>

        <div className="grid grid-cols-2 gap-3 max-w-sm md:max-w-md mx-auto lg:mx-0">
          {['Joint Care', 'Muscle Relief', '100% Organic', 'Fast Acting'].map(item => (
            <div key={item} className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl bg-[#c9a84c]/5 border border-[#c9a84c]/10">
              <CheckCircle size={15} className="text-[#c9a84c] flex-shrink-0 md:hidden" />
              <CheckCircle size={18} className="text-[#c9a84c] flex-shrink-0 hidden md:block" />
              <span className="text-white font-bold text-[10px] md:text-xs uppercase tracking-wider">{item}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 md:pt-4">
          <a href="https://wa.me/919921297518"
            className="inline-flex items-center gap-3 bg-[#c9a84c] text-[#0a0f0d] px-8 md:px-10 py-3.5 md:py-4 rounded-full font-black hover:bg-white transition-colors text-sm md:text-base">
            CONSULT NOW <Phone size={16} className="md:hidden" /><Phone size={18} className="hidden md:block" />
          </a>
        </div>
      </div>
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
          <span className="text-[#c9a84c] text-[10px] sm:text-xs font-black uppercase tracking-[0.4em]">Healing Collection</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-[#0a0f0d] tracking-tighter leading-[0.9]">
          PURE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#f3d382]">RELIEF.</span>
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

     {/* ===== PACKAGES PREVIEW ===== 
<section className="py-24 px-4 bg-[#0a0f0d] relative overflow-hidden">
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
          <span className="text-[#c9a84c] text-[10px] sm:text-xs font-black uppercase tracking-[0.4em]">Our Sourcing</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-[#0a0f0d] tracking-tighter leading-none">
          RESTORING <br className="md:hidden" /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0a0f0d] via-[#c9a84c] to-[#0a0f0d]">VITALITY.</span>
        </h2>
      </div>

      <Link 
        href="/gallery" 
        className="group flex items-center gap-3 text-[#0a0f0d] font-black text-xs tracking-widest hover:text-[#c9a84c] transition-all"
      >
        VIEW FULL JOURNEY
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
  </div>
</section>
      {/* ===== TESTIMONIALS: THE WALL OF LOVE ===== */}
<section className="py-2 px-4 bg-white relative">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16 space-y-4">
      <div className="flex justify-center items-center gap-2">
        <Heart size={16} className="text-[#c9a84c] fill-[#c9a84c]" />
        <span className="text-[#c9a84c] text-xs font-black uppercase tracking-[0.4em]">Real Stories</span>
      </div>
      <h2 className="text-5xl md:text-6xl font-black text-[#0a0f0d] tracking-tighter">
        VOICES OF <span className="italic font-serif text-[#c9a84c]">Relief.</span>
      </h2>
    </div>

    {/* Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { name: "Ramesh Patil", location: "Pune, MH", rating: 5, text: "I have been suffering from knee pain for 5 years. After using CrabVeda for just 3 weeks, the difference is unbelievable. I can walk without pain now.", condition: "Knee Pain" },
        { name: "Sunita Deshpande", location: "Nashik, MH", rating: 5, text: "My husband has severe arthritis. We tried many oils but nothing worked as well as CrabVeda. The relief is fast and long-lasting. Bahut accha product hai!", condition: "Arthritis" },
        { name: "Anil Sharma", location: "Mumbai, MH", rating: 5, text: "As a gym trainer, muscle soreness is a daily issue. CrabVeda Crab Oil has become my go-to recovery product. Natural, effective and smells great too.", condition: "Muscle Soreness" },
        { name: "Meena Joshi", location: "Kolhapur, MH", rating: 5, text: "My mother-in-law was unable to move her shoulder properly. After regular use of CrabVeda oil, her mobility has improved so much. We ordered 2 more bottles!", condition: "Joint Mobility" }
      ].map((t, i) => (
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
                {t.condition}
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
          <span className="text-[#c9a84c]">CRABVEDA</span> <br />
          PROMISE.
        </h2>
        <p className="text-gray-400 text-lg font-medium">
          Trusted by over 5000+ individuals across India for target-deep recovery and long-lasting joint comfort.
        </p>
        <div className="w-20 h-1 bg-[#c9a84c]" />
      </div>

      {/* Right Grid Content */}
      <div className="lg:col-span-8 grid sm:grid-cols-2 gap-8">
        {[
          { icon: <Leaf size={32} />, title: 'Pure & Ayurvedic', desc: '100% natural compounds with zero side effects. Safe, authentic, and completely toxin-free.' },
          { icon: <Palette size={32} />, title: 'Deep Absorption', desc: 'Fast-acting formula engineered for rapid, target-deep penetration into stiff joints.' },
          { icon: <Truck size={32} />, title: 'Free Pan-India Delivery', desc: 'Enjoy reliable, completely free shipping right to your doorstep anywhere in India.' },
          { icon: <Award size={32} />, title: '98% Recovery Rate', desc: 'Clinically tested efficacy backed by thousands of verified clinical relief success stories.' },
          { icon: <Camera size={32} />, title: 'Restores Mobility', desc: 'Specially crafted to reduce painful inflammation and rebuild flexible, long-term mobility.' },
          { icon: <Heart size={32} />, title: 'Made with Care', desc: 'Meticulously processed to ensure premium therapeutic strength and maximum comfort.' },
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
          RECLAIM YOUR <br />
          <span className="text-[#c9a84c]">MOBILITY.</span>
        </h2>
        <p className="text-gray-500 text-lg md:text-xl font-medium max-w-md mx-auto md:mx-0">
          From target-deep relief to natural long-term wellness. India's clinical Ayurvedic standard.
        </p>
      </div>

      {/* Clean Button Stack */}
      <div className="flex flex-col gap-4 w-full md:w-auto">
        <Link 
          href="/products" 
          className="group flex items-center justify-between gap-8 bg-[#0a0f0d] text-white px-8 py-5 rounded-2xl hover:bg-[#c9a84c] hover:text-[#0a0f0d] transition-all duration-300"
        >
          <span className="font-black text-xs tracking-widest uppercase">Shop Pain Relief Oil</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link 
          href="https://wa.me/919921297518" 
          className="group flex items-center justify-between gap-8 border-2 border-[#0a0f0d] text-[#0a0f0d] px-8 py-5 rounded-2xl hover:bg-[#0a0f0d] hover:text-white transition-all duration-300"
        >
          <span className="font-black text-xs tracking-widest uppercase">Consult via WhatsApp</span>
          <Phone size={20} />
        </Link>
      </div>
    </div>

    {/* Elegant Footer Link */}
    <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {[1,2,3].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-bold">
              {i === 3 ? '4.9★' : ''}
            </div>
          ))}
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trusted by 5000+ Verified Users</p>
      </div>
      
      <a 
        href="https://wa.me/919921297518" 
        className="text-[#c9a84c] font-black text-xs tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity"
      >
        WHATSAPP ORDER INQUIRY <Phone size={14} />
      </a>
    </div>
  </div>
</section>
    </div>
  )
}
