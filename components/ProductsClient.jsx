'use client'

import ProductCard from './ProductCard'
import { Sparkles, ShieldCheck, Zap } from 'lucide-react'

export default function ProductsClient({ products = [] }) {
  const productList = products.slice(0, 2)

  return (
    <div className="bg-slate-50 min-h-screen text-[#0a0f0d] antialiased pb-12">
      
      {/* ===== HEADER ===== */}
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 mb-3">
          <Sparkles size={12} className="text-[#c9a84c] animate-pulse" />
          <span className="text-[#0a0f0d] text-[10px] font-black tracking-[0.2em] uppercase">Premium Wellness</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">
          SELECT YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#a48434]">PACK</span>
        </h1>
        <p className="text-gray-500 text-xs md:text-sm mt-2 max-w-md mx-auto font-medium">
          Choose between our standard starter pack or upgraded savings bundle.
        </p>
      </div>

      {/* ===== STRICT ZERO-SCROLL 2-COLUMN GRID ===== */}
      <div className="max-w-4xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-6 items-stretch">
          {productList.map((product, idx) => {
            const isCombo = product.name?.toLowerCase().includes('combo') || idx === 1;

            return (
              <div 
                key={product.id || idx} 
                className={`bg-white rounded-2xl sm:rounded-[2rem] p-3 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative border-2 ${
                  isCombo 
                    ? 'border-[#c9a84c] shadow-amber-100/10' 
                    : 'border-black/5'
                }`}
              >
                {/* Micro Floating Badges */}
                <div className={`absolute -top-2 left-3 sm:left-6 text-[8px] sm:text-[10px] font-black tracking-widest px-2.5 py-0.5 sm:py-1 rounded-md shadow-xs ${
                  isCombo 
                    ? 'bg-[#c9a84c] text-[#0a0f0d]' 
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {isCombo ? 'POPULAR DEAL' : 'STARTER'}
                </div>

                {/* Main Product Card Output */}
                <div className="flex-1 w-full pt-2 sm:pt-4">
                  <ProductCard product={product} />
                </div>

                {/* Micro Benefit Banner */}
                <div className={`mt-3 pt-2 border-t border-gray-100 text-[9px] sm:text-xs font-bold flex items-center justify-center gap-1 ${
                  isCombo ? 'text-emerald-700' : 'text-gray-400'
                }`}>
                  <Zap size={10} fill="currentColor" className={isCombo ? 'text-emerald-600' : 'hidden'} />
                  <span>{isCombo ? 'Best Price / Save Big' : 'Single Bottle Pack'}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ===== MINI TRUST BAR ===== */}
      <div className="max-w-4xl mx-auto px-2 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-black/5 shadow-xs">
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck size={16} className="text-[#c9a84c] shrink-0" />
            <span className="text-[10px] sm:text-xs font-black tracking-tight text-gray-700 uppercase">100% Ayurvedic Purity</span>
          </div>
          <div className="flex items-center gap-2 px-1 border-l border-gray-100">
            <Zap size={16} className="text-[#c9a84c] shrink-0" />
            <span className="text-[10px] sm:text-xs font-black tracking-tight text-gray-700 uppercase">Fast Delivery India</span>
          </div>
        </div>
      </div>

    </div>
  )
}