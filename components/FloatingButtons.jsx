'use client'
import { useState, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'

export default function FloatingButtons() {
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col gap-3 items-end">
      {/* Expandable options */}
      {expanded && (
        <>
          {/* Instagram */}
          <a href="https://www.instagram.com/shrilekha_mehandi_art/"
            target="_blank" rel="noreferrer"
            aria-label="Follow on Instagram"
            className="flex items-center gap-2 pl-3 pr-4 h-10 rounded-full shadow-lg text-white text-xs font-medium transition-all hover:scale-105 active:scale-95 animate-in"
            style={{ background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="white" stroke="white" />
            </svg>
            <span>Follow us</span>
          </a>

          {/* WhatsApp */}
          <a href="https://wa.me/919623740541?text=Hi! I want to know more about Shrilekha Mehndi Art"
            target="_blank" rel="noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex items-center gap-2 pl-3 pr-4 h-10 rounded-full shadow-lg text-white text-xs font-medium transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#25D366' }}>
            <MessageCircle size={16} fill="white" color="white" />
            <span>Chat with us</span>
          </a>
        </>
      )}

      {/* Main toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        aria-label="Contact options"
        className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
        style={{ backgroundColor: expanded ? '#6b7280' : 'var(--brand-green)' }}>
        {expanded
          ? <X size={22} />
          : <MessageCircle size={24} />
        }
      </button>
    </div>
  )
}