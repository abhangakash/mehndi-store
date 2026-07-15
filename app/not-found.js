import Link from 'next/link'
import { ArrowRight, ShoppingBag } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Soft brand glow matching your other pages */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#93731e]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-md w-full text-center relative z-10 py-12">
        
        {/* Minimalist Header Typography */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-center gap-2">
            <span className="h-[1.5px] w-6 bg-[#93731e]"></span>
            <span className="text-[#93731e] text-[10px] sm:text-xs font-black uppercase tracking-[0.4em]">
              Page Not Found
            </span>
            <span className="h-[1.5px] w-6 bg-[#93731e]"></span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black text-[#0a0f0d] tracking-tighter leading-none">
            404
          </h1>
          
          <h2 className="text-lg sm:text-xl font-black text-[#0a0f0d] tracking-tight uppercase mt-4">
            Eased Away.
          </h2>
        </div>

        {/* Clear, elegant copy */}
        <p className="text-xs sm:text-sm leading-relaxed text-gray-500 mb-8 max-w-sm mx-auto">
          Like targeted relief soothing away discomfort, this page has dissolved. However, our signature Ayurvedic pain relief oils and premium wellness solutions are still fully available to explore.
        </p>

        {/* Primary Action Button matches the Buy Now style */}
        <div className="mb-10 px-2">
          <Link 
            href="/products" 
            className="flex items-center justify-center w-full py-4 rounded-xl bg-[#0a0f0d] text-white font-black tracking-widest text-[11px] gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-[#0a0f0d]/10"
          >
            EXPLORE ALL PRODUCTS
            <ShoppingBag size={14} />
          </Link>
        </div>

        {/* Custom Quick Navigation Deck - Exact links requested */}
        <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm text-left">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3.5">
            Quick Navigation Links
          </p>
          
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: '/', label: 'Home' },
              { href: '/products', label: 'Shop Oils' },
              { href: '/track-order', label: 'Track Order' },
              { href: '/contact', label: 'Contact Us' },
            ].map(l => (
              <Link 
                key={l.href} 
                href={l.href}
                className="group flex items-center justify-between px-3 py-2.5 rounded-xl text-[11px] font-bold border border-gray-100 text-[#0a0f0d] hover:border-[#93731e] hover:bg-gray-50/50 transition-all"
              >
                {l.label} 
                <ArrowRight size={12} className="text-gray-400 group-hover:text-[#93731e] transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* WhatsApp Footer Helper */}
        <p className="text-[11px] font-medium text-gray-400 mt-8">
          Need immediate guidance?{' '}
          <a 
            href="https://wa.me/919921297518" 
            target="_blank" 
            rel="noreferrer"
            className="font-black text-[#93731e] underline uppercase tracking-wider ml-1"
          >
            Chat on WhatsApp
          </a>
        </p>
      </div>
    </div>
  )
}