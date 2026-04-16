import Link from 'next/link'
import { CheckCircle, Phone, Star, ArrowRight, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Mehndi & Makeup Packages — Shrilekha Mehndi Art & Glowup',
  description: 'Complete bridal mehndi and makeup packages in Pune. Affordable pricing for weddings, engagements and all occasions. Book via WhatsApp.',
}

const MEHNDI_PACKAGES = [
  {
    name: 'Simple Mehndi',
    price: '₹500',
    icon: '🌿',
    color: '#3a5a40',
    bg: '#f0fdf4',
    border: '#86efac',
    desc: 'Perfect for casual occasions and festivals',
    features: ['Both hands up to wrists', 'Simple floral patterns', 'Natural henna cone', 'Approx 45 mins'],
  },
  {
    name: 'Party Mehndi',
    price: '₹1,200',
    icon: '🌸',
    color: '#0369a1',
    bg: '#f0f9ff',
    border: '#7dd3fc',
    desc: 'Great for engagements and family events',
    features: ['Full hands mehndi', 'Intricate Arabic patterns', 'Dark color guaranteed', 'Approx 1.5 hours'],
  },
  {
    name: 'Bridal Mehndi',
    price: '₹2,500',
    icon: '👰',
    color: '#3a5a40',
    bg: '#f0fdf4',
    border: '#4ade80',
    popular: true,
    desc: 'Complete bridal mehndi experience',
    features: ['Full hands & arms mehndi', 'Both feet mehndi', 'Intricate bridal designs', 'Husband name hidden', 'Free touch-up next day', '3-4 hours session'],
  },
  {
    name: 'Premium Bridal',
    price: '₹4,000',
    icon: '✨',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#c4b5fd',
    desc: 'The ultimate bridal mehndi experience',
    features: ['Full hands, arms & feet', 'Custom bridal design', 'Rajasthani + Arabic fusion', 'Glitter mehndi add-on', 'Touch-up kit included', 'Certificate of authenticity', '4-5 hours session'],
  },
]

const MAKEUP_PACKAGES = [
  {
    name: 'Party Makeup',
    price: '₹1,500',
    icon: '💋',
    color: '#be185d',
    bg: '#fdf2f8',
    border: '#f9a8d4',
    desc: 'Perfect for parties and celebrations',
    features: ['Foundation & contouring', 'Smokey eye / party look', 'Lipstick & gloss', 'Approx 1 hour'],
  },
  {
    name: 'Engagement Makeup',
    price: '₹3,000',
    icon: '💍',
    color: '#d97706',
    bg: '#fefce8',
    border: '#fde68a',
    desc: 'Look stunning for your special day',
    features: ['HD foundation & setting', 'Full eye makeup', 'Hairstyling included', 'Touch-up kit', 'Approx 2 hours'],
  },
  {
    name: 'Bridal Makeup',
    price: '₹5,000',
    icon: '👑',
    color: '#7c4a1e',
    bg: '#fef9ee',
    border: '#fcd34d',
    popular: true,
    desc: 'Complete bridal glam experience',
    features: ['Airbrush HD makeup', 'Full bridal hairstyling', 'Saree draping', 'Bridal accessories help', 'Touch-up during event', '2.5-3 hours session'],
  },
  {
    name: 'Airbrush Premium',
    price: '₹7,000',
    icon: '🌟',
    color: '#1d4ed8',
    bg: '#eff6ff',
    border: '#93c5fd',
    desc: 'Top-tier professional bridal glam',
    features: ['Premium airbrush technique', 'Long-lasting 12+ hours', 'Hairstyling & draping', 'Pre-bridal consultation', 'On-site touch-up artist', 'Full day support'],
  },
]

const COMBO_PACKAGES = [
  {
    name: 'Mehndi + Makeup Basic',
    price: '₹3,500',
    icon: '🎀',
    color: '#0f766e',
    bg: '#f0fdfa',
    border: '#5eead4',
    desc: 'Party mehndi + engagement makeup',
    features: ['Full hands mehndi', 'Party/engagement makeup', 'Hairstyling', 'Approx 3 hours'],
    saving: 'Save ₹700',
  },
  {
    name: 'Bridal Complete',
    price: '₹7,000',
    icon: '👑',
    color: '#7c4a1e',
    bg: '#fef9ee',
    border: '#fcd34d',
    popular: true,
    desc: 'Full bridal mehndi + bridal makeup',
    features: ['Full bridal mehndi (hands + feet)', 'Bridal HD makeup', 'Hairstyling & draping', 'Touch-up kit included', 'Free consultation', '5-6 hours full service'],
    saving: 'Save ₹1,500',
  },
  {
    name: 'Premium Bridal All-In',
    price: '₹10,000',
    icon: '✨',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#c4b5fd',
    desc: 'The complete luxury bridal experience',
    features: ['Premium bridal mehndi', 'Airbrush premium makeup', 'Pre-bridal skin session', 'Hairstyling & draping', 'Full day touch-up support', 'Professional photos included'],
    saving: 'Save ₹2,000',
  },
]

function PackageCard({ pkg }) {
  const waText = `Hi! I want to book the "${pkg.name}" package (${pkg.price})`
  return (
    <div className="card overflow-hidden relative flex flex-col"
      style={{ borderColor: pkg.popular ? pkg.color : 'var(--brand-border)', borderWidth: pkg.popular ? 2 : 1 }}>
      {pkg.popular && (
        <div className="py-1.5 text-center text-xs font-semibold text-white"
          style={{ backgroundColor: pkg.color }}>
          ⭐ Most Popular
        </div>
      )}
      <div className="p-5 flex flex-col flex-1" style={{ backgroundColor: pkg.bg }}>
        <div className="flex items-start justify-between mb-3">
          <div className="text-4xl">{pkg.icon}</div>
          {pkg.saving && (
            <span className="text-xs font-semibold px-2 py-1 rounded-full text-white"
              style={{ backgroundColor: pkg.color }}>
              {pkg.saving}
            </span>
          )}
        </div>
        <h3 className="font-bold text-base mb-1" style={{ color: 'var(--brand-text)' }}>{pkg.name}</h3>
        <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--brand-muted)' }}>{pkg.desc}</p>
        <div className="text-xl font-bold mb-4" style={{ color: pkg.color }}>
          {pkg.price}
          <span className="text-xs font-normal ml-1" style={{ color: 'var(--brand-muted)' }}>onwards</span>
        </div>
        <ul className="flex flex-col gap-1.5 mb-5 flex-1">
          {pkg.features.map(f => (
            <li key={f} className="flex items-start gap-2 text-xs" style={{ color: 'var(--brand-muted)' }}>
              <CheckCircle size={13} className="mt-0.5 flex-shrink-0" style={{ color: pkg.color }} />
              {f}
            </li>
          ))}
        </ul>
        <a href={`https://wa.me/919623740541?text=${encodeURIComponent(waText)}`}
          target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: pkg.color }}>
          <Phone size={13} /> Book via WhatsApp
        </a>
      </div>
    </div>
  )
}

export default function PackagesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
          style={{ backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
          <Sparkles size={12} /> Shrilekha Mehndi Art & Glowup Studio
        </div>
        <h1 className="section-title">Our Packages</h1>
        <p className="section-subtitle max-w-xl mx-auto">
          Complete mehndi and makeup packages for every occasion. All prices are starting rates — custom quotes available.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {[
            { icon: '🌿', text: '100% Natural Henna' },
            { icon: '✅', text: 'Certified Artist' },
            { icon: '🏠', text: 'Home Service Available' },
            { icon: '📸', text: 'Photo-Ready Results' },
          ].map(b => (
            <div key={b.text} className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--brand-muted)' }}>
              <span>{b.icon}</span> {b.text}
            </div>
          ))}
        </div>
      </div>

      {/* Mehndi packages */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-2xl">🌿</div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--brand-green)' }}>Mehndi Packages</h2>
            <p className="text-sm" style={{ color: 'var(--brand-muted)' }}>Pure natural henna art for all occasions</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MEHNDI_PACKAGES.map(pkg => <PackageCard key={pkg.name} pkg={pkg} />)}
        </div>
      </section>

      {/* Makeup packages */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-2xl">💄</div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--brand-brown)' }}>Makeup Packages</h2>
            <p className="text-sm" style={{ color: 'var(--brand-muted)' }}>Professional bridal & party makeup by Shrilekha Glowup</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MAKEUP_PACKAGES.map(pkg => <PackageCard key={pkg.name} pkg={pkg} />)}
        </div>
      </section>

      {/* Combo packages */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-2xl">✨</div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#7c3aed' }}>Combo Packages</h2>
            <p className="text-sm" style={{ color: 'var(--brand-muted)' }}>Best value — mehndi + makeup together</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMBO_PACKAGES.map(pkg => <PackageCard key={pkg.name} pkg={pkg} />)}
        </div>
      </section>

      {/* Note & CTA */}
      <div className="rounded-2xl p-6 md:p-8 text-center" style={{ background: 'linear-gradient(135deg, #1a3320, #3a5a40)' }}>
        <h3 className="text-xl font-bold text-white mb-2">Need a Custom Package?</h3>
        <p className="text-white/70 text-sm mb-6 max-w-lg mx-auto">
          All packages are customizable. Contact us on WhatsApp for personalized quotes for destination weddings, group bookings or special requirements.
        </p>
        <a href="https://wa.me/919623740541?text=Hi! I need a custom package quote"
          target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#25D366' }}>
          <Phone size={16} /> Get Custom Quote on WhatsApp
        </a>
      </div>
    </div>
  )
}