import Link from 'next/link'
import { Leaf, Phone, Mail, ExternalLink, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-16 border-t" style={{ backgroundColor: 'var(--brand-green)', borderColor: 'var(--brand-green)' }}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Leaf size={16} color="white" />
              </div>
              <div className="font-semibold text-white text-sm">Shrilekha Mehndi Art</div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Where every design tells a story. Premium quality henna products crafted with love from Pune, Maharashtra.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium text-sm mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[{ href: '/', label: 'Home' },{ href: '/products', label: 'Shop' },{ href: '/blog', label: 'Tips & Blog' },{ href: '/track-order', label: 'Track Order' }].map(l => (
                <Link key={l.href} href={l.href} className="text-sm text-white/70 hover:text-white transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-medium text-sm mb-3">Policies</h4>
            <div className="flex flex-col gap-2">
              {['Return & Refund Policy','Shipping Policy','Privacy Policy','Terms of Service'].map(l => (
                <span key={l} className="text-sm text-white/70 cursor-pointer hover:text-white transition-colors">{l}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-medium text-sm mb-3">Contact Us</h4>
            <div className="flex flex-col gap-2.5">
              <a href="tel:+919623740541" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
                <Phone size={14} /> +91 96237 40541
              </a>
              <a href="mailto:info@shrilekha.com" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
                <Mail size={14} /> info@shrilekha.com
              </a>
              <a href="https://instagram.com/shrilekha_mehndi" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
                <ExternalLink size={14} /> @shrilekha_mehndi
              </a>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <MapPin size={14} /> Pune, Maharashtra
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-white/50">© 2024 Shrilekha Mehndi Art. All rights reserved.</p>
          <div className="flex items-center gap-1 text-xs text-white/50">
            <span>Free shipping above ₹499</span><span className="mx-2">·</span><span>COD on orders above ₹999</span>
          </div>
        </div>
      </div>
    </footer>
  )
}