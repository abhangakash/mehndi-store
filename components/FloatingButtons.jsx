'use client'
import { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'

export default function FloatingButtons() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col gap-3 items-end">
      {/* Instagram */}
      <a href="https://www.instagram.com/shrilekha_mehandi_art"
        target="_blank"
        rel="noreferrer"
        aria-label="Follow us on Instagram"
        className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
        }}>
        {/* Instagram SVG icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="white" stroke="white" />
        </svg>
      </a>

      {/* WhatsApp */}
      <a href="https://wa.me/919623740541?text=Hi! I want to know more about Shrilekha Mehndi Art"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex items-center gap-2.5 pl-4 pr-5 h-12 rounded-full shadow-lg text-white text-sm font-medium transition-all hover:scale-105 active:scale-95"
        style={{ backgroundColor: '#25D366' }}>
        <MessageCircle size={20} fill="white" color="white" />
        <span className="hidden sm:block">Chat with us</span>
      </a>
    </div>
  )
}