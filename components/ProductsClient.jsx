'use client'

import ProductCard from './ProductCard'
import { Sparkles, ShieldCheck, Check, ShoppingBag } from 'lucide-react'

export default function ProductsClient({ products = [] }) {
  // Pull exactly 2 options for an instant zero-scroll side-by-side compare
  const productList = products.slice(0, 2)

  return (
    <div className="bg-white min-h-screen text-black antialiased pb-12">
      
      {/* ===== HEADER (MATCHES CART PAGE HEADER STYLE) ===== */}
      <header className="px-4 pt-8 pb-4 text-center">
        <h1 className="text-2xl font-black uppercase tracking-tight text-black flex items-center justify-center gap-2">
          <ShoppingBag size={20} className="sm:hidden" style={{ color: '#c9a84c' }} />
          Official Store
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: '#c9a84c' }}>
          Select your wellness regimen below
        </p>
      </header>

      {/* ===== TWO-COLUMN HIGH-IMPACT PRODUCT GRID ===== */}
      <main className="max-w-5xl mx-auto px-4 pb-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-6 items-stretch">
          {productList.map((product, idx) => {
            const isCombo = product?.name?.toLowerCase().includes('combo') || idx === 1

            return (
              <div 
                key={product?.id || idx} 
                className={`rounded-2xl border overflow-hidden bg-white flex flex-col justify-between relative transition-all duration-200 ${
                  isCombo 
                    ? 'border-[#c9a84c] shadow-md shadow-[#c9a84c]/5' 
                    : 'border-gray-100 shadow-sm'
                }`}
              >
                {/* Header Strip inside Card (Matches Cart Inner Heading) */}
                <div className="px-3 py-2.5 sm:px-5 sm:py-3.5 flex items-center justify-between border-b border-gray-50 bg-gray-50/50">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Sparkles size={12} style={{ color: isCombo ? '#c9a84c' : '#9ca3af' }} className="shrink-0" />
                    <p className="text-[9px] sm:text-xs font-black uppercase tracking-widest text-gray-500 truncate">
                      {isCombo ? 'Recommended Deal' : 'Starter Option'}
                    </p>
                  </div>
                  <span className="text-[8px] sm:text-[10px] font-black text-gray-300 uppercase tracking-wider shrink-0">
                    0{idx + 1}
                  </span>
                </div>

                {/* Main Product Component Wrapper Frame */}
                <div className="flex-1 w-full p-3 sm:p-5 min-h-0">
                  <ProductCard product={product} />
                </div>

                {/* Card footer (Matches Cart Item Line Pricing Layout Style) */}
                <div className="px-3 py-3 sm:px-5 sm:py-4 border-t border-gray-50 bg-gray-50/20 flex items-center justify-between">
                  <div className={`text-[8px] sm:text-[11px] font-black uppercase tracking-widest flex items-center gap-1 ${
                    isCombo ? 'text-emerald-600' : 'text-gray-400'
                  }`}>
                    <Check size={12} strokeWidth={3} className={isCombo ? 'text-emerald-600' : 'text-gray-300'} />
                    <span>{isCombo ? 'Max Savings' : 'Standard'}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* ===== OPTIMIZED TRUST INFOBAR ===== */}
      <footer className="max-w-5xl mx-auto px-4 mt-2">
        <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl border border-gray-100 bg-white shadow-xs">
          <div className="flex items-center justify-center gap-1.5 py-1">
            <ShieldCheck size={14} style={{ color: '#c9a84c' }} className="shrink-0" />
            <span className="text-[9px] sm:text-xs font-black tracking-widest text-gray-500 uppercase text-center">
              100% Verified Pure
            </span>
          </div>
          <div className="flex items-center justify-center gap-1.5 py-1 border-l border-gray-100">
            <Check size={14} style={{ color: '#c9a84c' }} className="shrink-0" />
            <span className="text-[9px] sm:text-xs font-black tracking-widest text-gray-500 uppercase text-center">
              Free Express Delivery
            </span>
          </div>
        </div>
      </footer>

    </div>
  )
}