'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function FloatingButtons() {
  const [visible, setVisible] = useState(false)
  const [pulse, setPulse] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const pulseTimer = setTimeout(() => setPulse(false), 8000)
    return () => clearTimeout(pulseTimer)
  }, [visible])

  if (!visible) return null

  return (
    <div className="fixed bottom-5 right-4 z-50">
      {/* Clean Circular WhatsApp Action Button */}
      <a
        href="https://wa.me/919921297518?text=Hi! I want to know more about crabveda oil"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex items-center justify-center bg-[#25D366] hover:bg-[#20ba56] w-14 h-14 rounded-full shadow-[0_4px_16px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 ease-out"
        suppressHydrationWarning={true}
      >
        {/* Elegant Branded Pulse Dot (No spammy numbers or red flashes) */}
        {pulse && (
          <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white p-[2px]">
              <span className="h-full w-full rounded-full bg-[#128C7E]"></span>
            </span>
          </span>
        )}

        {/* Your Downloaded Local WhatsApp SVG */}
        <div className="w-7 h-7 flex items-center justify-center transition-transform group-hover:rotate-12 duration-300 shrink-0">
          <Image 
            src="/whatsapp.svg" 
            alt="WhatsApp" 
            width={28} 
            height={28} 
            className="w-full h-full object-contain"
            priority
          />
        </div>
      </a>
    </div>
  )
}