'use client'
import { useState, useEffect } from 'react'
import { X, Sparkles, ArrowRight, Phone } from 'lucide-react'
import Link from 'next/link'

// Change this content anytime without touching code
const POPUP_CONFIG = {
  // Set to false to disable popup completely
  enabled: true,
  // Delay in milliseconds before popup shows (10 seconds)
  delay: 10000,
  // How many days before showing again to same visitor
  cooldownDays: 3,
  storageKey: 'shrilekha_popup_last_shown',
}

const POPUP_CONTENT = {
  badge: '🎉 Limited Time Offer',
  title: 'Bridal Package Special',
  subtitle: 'Book This Month & Save',
  highlight: '20% OFF',
  highlightSub: 'on all bridal combos',
  description: 'Complete bridal mehndi + makeup combo starting at ₹5,600 (was ₹7,000). Limited slots available for wedding season!',
  ctaPrimary: { label: 'Book via WhatsApp', href: 'https://wa.me/919623740541?text=Hi! I want to book the bridal combo with 20% off offer' },
  ctaSecondary: { label: 'View All Packages', href: '/packages' },
  features: ['Full bridal mehndi (hands + feet)', 'HD bridal makeup', 'Hairstyling included', 'Free touch-up kit'],
  tag: 'offer', // 'offer' | 'class' | 'new' | 'event'
}

export default function PromoPopup() {
  const [show, setShow] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (!POPUP_CONFIG.enabled) return

    // Check cooldown — don't show if shown recently
    const lastShown = localStorage.getItem(POPUP_CONFIG.storageKey)
    if (lastShown) {
      const daysSince = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24)
      if (daysSince < POPUP_CONFIG.cooldownDays) return
    }

    // Show after delay
    const timer = setTimeout(() => setShow(true), POPUP_CONFIG.delay)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setClosing(true)
    localStorage.setItem(POPUP_CONFIG.storageKey, Date.now().toString())
    setTimeout(() => { setShow(false); setClosing(false) }, 300)
  }

  if (!show) return null

  const tagColors = {
    offer: { bg: '#fef3c7', color: '#d97706' },
    class: { bg: '#ede9fe', color: '#7c3aed' },
    new: { bg: '#dcfce7', color: '#15803d' },
    event: { bg: '#dbeafe', color: '#1d4ed8' },
  }
  const tag = tagColors[POPUP_CONTENT.tag] || tagColors.offer

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] transition-opacity duration-300"
        style={{ backgroundColor: closing ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={handleClose}
      />

      {/* Popup */}
      <div
        className="fixed z-[201] transition-all duration-300"
        style={{
          // Center on all screens
          top: '50%',
          left: '50%',
          transform: closing
            ? 'translate(-50%, -50%) scale(0.95)'
            : 'translate(-50%, -50%) scale(1)',
          opacity: closing ? 0 : 1,
          width: 'min(90vw, 480px)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}>
        <div className="relative rounded-3xl overflow-hidden shadow-2xl"
          style={{ backgroundColor: '#fcfaf6' }}>

          {/* Top green banner */}
          <div className="px-6 py-5 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #0f1a0e, #1a3020)' }}>
            <div className="flex items-center gap-2">
              <Sparkles size={16} style={{ color: '#c9a84c' }} />
              <span className="text-xs font-black uppercase tracking-widest text-white">
                {POPUP_CONTENT.badge}
              </span>
            </div>
            <button onClick={handleClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
              style={{ color: 'rgba(255,255,255,0.6)' }}>
              <X size={16} />
            </button>
          </div>

          {/* Main content */}
          <div className="px-6 pt-5 pb-2">
            {/* Highlight badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4"
              style={{ backgroundColor: tag.bg, color: tag.color }}>
              {POPUP_CONTENT.badge}
            </div>

            {/* Title + discount */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight" style={{ color: '#0f1a0e' }}>
                  {POPUP_CONTENT.title}
                </h2>
                <p className="text-xs font-bold uppercase tracking-widest mt-0.5"
                  style={{ color: 'rgba(15,26,14,0.4)' }}>
                  {POPUP_CONTENT.subtitle}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-3xl font-black leading-none" style={{ color: '#c9a84c' }}>
                  {POPUP_CONTENT.highlight}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(15,26,14,0.4)' }}>
                  {POPUP_CONTENT.highlightSub}
                </div>
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(15,26,14,0.6)' }}>
              {POPUP_CONTENT.description}
            </p>

            {/* Feature list */}
            <div className="grid grid-cols-2 gap-1.5 mb-5">
              {POPUP_CONTENT.features.map(f => (
                <div key={f} className="flex items-center gap-1.5 text-xs"
                  style={{ color: 'rgba(15,26,14,0.6)' }}>
                  <span className="text-green-600">✓</span> {f}
                </div>
              ))}
            </div>

            {/* Urgency bar */}
            <div className="flex items-center gap-2 mb-5 px-3 py-2.5 rounded-xl"
              style={{ backgroundColor: '#fef3c7' }}>
              <span className="text-base">⏰</span>
              <p className="text-xs font-bold" style={{ color: '#d97706' }}>
                Limited slots! Offer valid till end of month only.
              </p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="px-6 pb-6 flex flex-col gap-2">
            <a href={POPUP_CONTENT.ctaPrimary.href}
              target="_blank" rel="noreferrer"
              onClick={handleClose}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: '#25D366', boxShadow: '0 4px 16px rgba(37,211,102,0.3)' }}>
              <Phone size={14} /> {POPUP_CONTENT.ctaPrimary.label}
            </a>
            <Link href={POPUP_CONTENT.ctaSecondary.href}
              onClick={handleClose}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:bg-gray-50"
              style={{ color: 'rgba(15,26,14,0.5)', border: '1.5px solid rgba(15,26,14,0.08)' }}>
              {POPUP_CONTENT.ctaSecondary.label} <ArrowRight size={13} />
            </Link>
          </div>

          {/* Footer note */}
          <div className="px-6 pb-4 text-center">
            <button onClick={handleClose}
              className="text-xs font-medium underline"
              style={{ color: 'rgba(15,26,14,0.3)' }}>
              No thanks, close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

