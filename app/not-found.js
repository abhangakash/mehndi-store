import Link from 'next/link'
import { Leaf, Home, ShoppingBag, Phone, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #fdf8f0 50%, #f9f5ed 100%)' }}>
      <div className="max-w-lg w-full text-center">
        {/* Animated design */}
        <div className="relative mb-8 mx-auto w-32 h-32">
          <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto"
            style={{ backgroundColor: 'var(--brand-green)', opacity: 0.1, position: 'absolute', inset: 0 }} />
          <div className="w-32 h-32 flex items-center justify-center relative text-7xl">
            🌱
          </div>
        </div>

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 mx-auto"
          style={{ backgroundColor: 'var(--brand-green)' }}>
          <Leaf size={28} color="white" />
        </div>

        <h1 className="text-7xl font-bold mb-2" style={{ color: 'var(--brand-green)' }}>404</h1>
        <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--brand-text)' }}>
          This page seems to have eased away
        </h2>
        <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--brand-muted)' }}>
          Like targeted relief soothing away discomfort — this page has disappeared. But don't worry, 
          our natural Ayurvedic pain relief oils and wellness solutions are still here to help!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link href="/" className="btn-primary text-sm justify-center">
            <Home size={15} /> Back to Home
          </Link>
          <Link href="/products" className="btn-secondary text-sm justify-center">
            <ShoppingBag size={15} /> Browse Products
          </Link>
        </div>

        <div className="card p-4">
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--brand-muted)' }}>
            Quick links you might be looking for:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: '/products', label: 'Shop Oil' },
              { href: '/packages', label: 'Wellness Bundles' },
              { href: '/gallery', label: 'Our Ingredients' },
              { href: '/blog', label: 'Health Blog' },
              { href: '/track-order', label: 'Track Order' },
              { href: '/contact', label: 'Contact Us' },
            ].map(l => (
              <Link key={l.href} href={l.href}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                style={{ color: 'var(--brand-green)', border: '1px solid var(--brand-border)' }}>
                {l.label} <ArrowRight size={12} />
              </Link>
            ))}
          </div>
        </div>

        <p className="text-xs mt-6" style={{ color: 'var(--brand-muted)' }}>
          Need expert help?{' '}
          <a href="https://wa.me/919921297518" target="_blank" rel="noreferrer"
            className="underline" style={{ color: 'var(--brand-green)' }}>
            Chat with us on WhatsApp
          </a>
        </p>
      </div>
    </div>
  )
}