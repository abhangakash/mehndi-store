'use client'

import ProductCard from './ProductCard'
import { ShieldCheck, Truck, Lock, RotateCcw, BadgeCheck, Check } from 'lucide-react'

const GOLD = '#93731e'

// Mobile: full width. Desktop: centered, limited width.
const CONTAINER = 'w-full mx-auto lg:max-w-4xl'

export default function ProductsClient({ products = [] }) {
  const productList = products.slice(0, 2)

  return (
    <div className="bg-[#f3f4f6] min-h-screen text-gray-900 antialiased pb-10">

      {/* ===== HEADER ===== */}
      <div className="bg-white border-b border-gray-200">
        <div className={`${CONTAINER} px-3 lg:px-0 py-3 lg:py-5 flex items-end justify-between gap-3`}>
          <div className="min-w-0">
            <p className="text-[11px] lg:text-xs text-gray-500">Home › Pain Relief Oils</p>
            <h1 className="text-lg lg:text-2xl font-bold leading-tight mt-0.5">
              CrabVeda Official Store
            </h1>
          </div>
          <span className="shrink-0 text-[11px] lg:text-sm text-gray-500">
            {productList.length} results
          </span>
        </div>

        <div className="border-t border-gray-100 bg-[#fafafa]">
          <div className={`${CONTAINER} px-3 lg:px-0 py-2 lg:py-2.5 flex items-center justify-between lg:justify-start lg:gap-10 gap-2 text-[10px] sm:text-[11px] lg:text-xs text-gray-600`}>
            {[
              { icon: Truck, label: 'Free Delivery' },
              { icon: ShieldCheck, label: '100% Pure' },
              { icon: Lock, label: 'Secure Checkout' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1 whitespace-nowrap">
                <Icon size={13} style={{ color: GOLD }} /> {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ===== 2-COLUMN GRID ===== */}
      <main className="px-1.5 sm:px-3 lg:px-4 pt-2 lg:pt-6">
        <div className={`${CONTAINER} grid grid-cols-2 gap-1.5 sm:gap-3 lg:gap-6 items-stretch`}>
          {productList.map((product, idx) => {
            const isCombo = idx === 0

            return (
              <article
                key={product?.id || idx}
                className={`flex flex-col h-full bg-white rounded-lg lg:rounded-xl overflow-hidden transition-shadow lg:hover:shadow-lg ${
                  isCombo ? 'ring-2 ring-[#93731e]' : 'ring-1 ring-gray-200'
                }`}
              >
                {isCombo ? (
                  <div
                    className="flex items-center justify-center gap-1 py-1 lg:py-1.5 text-[10px] sm:text-xs font-bold text-white"
                    style={{ backgroundColor: GOLD }}
                  >
                    <BadgeCheck size={12} /> BEST VALUE
                  </div>
                ) : (
                  <div className="py-1 lg:py-1.5 text-center text-[10px] sm:text-xs font-semibold text-gray-500 bg-gray-100">
                    STARTER PACK
                  </div>
                )}

                <div className="flex-1 p-1.5 sm:p-3 lg:p-4 [&>*]:!border-0 [&>*]:!shadow-none [&>*]:!w-full">
                  <ProductCard
                    product={product}
                    displayName={isCombo ? 'Advanced Recovery Combo' : 'Pain Relief Oil'}
                    displayDescription={
                      isCombo
                        ? 'Complete 2-bottle therapy for intensive recovery.'
                        : 'Standard 1-bottle pack for targeted relief.'
                    }
                    hideDiscountBadge={!isCombo}
                  />
                </div>

                <div className="px-2 lg:px-4 pb-2 lg:pb-4 flex items-center gap-1 text-[10px] sm:text-xs whitespace-nowrap overflow-hidden">
                  <Check size={11} strokeWidth={3} className="text-emerald-600 shrink-0" />
                  <span className="font-semibold text-emerald-700">In stock</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-600 truncate">Free delivery</span>
                </div>
              </article>
            )
          })}
        </div>

        {/* ===== TRUST PANEL ===== */}
        <section className={`${CONTAINER} mt-2 lg:mt-6 bg-white ring-1 ring-gray-200 rounded-lg lg:rounded-xl`}>
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            {[
              { icon: ShieldCheck, label: '100% Verified Pure' },
              { icon: Truck, label: 'Free Express Delivery' },
              { icon: RotateCcw, label: 'Easy Support' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col lg:flex-row lg:justify-center items-center gap-1 lg:gap-2 py-3 lg:py-4 px-1 text-center">
                <Icon size={18} style={{ color: GOLD }} />
                <span className="text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-700 leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}