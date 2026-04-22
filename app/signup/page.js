'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  Mail, Lock, Eye, EyeOff, User, Phone,
  ArrowRight, Sparkles, CheckCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

const BENEFITS = [
  'Save your delivery addresses',
  'View full order history',
  'Faster checkout every time',
  'Exclusive member offers',
]

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) return toast.error('Please fill all required fields')
    if (password.length < 6) return toast.error('Password must be at least 6 characters')
    if (password !== confirm) return toast.error('Passwords do not match')

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, phone: phone || '' } },
    })
    if (error) toast.error(error.message)
    else {
      toast.success('Account created! Check your email to verify.')
      router.push('/login')
    }
    setLoading(false)
  }

  const inputStyle = {
    backgroundColor: 'white',
    border: '1.5px solid rgba(15,26,14,0.08)',
    color: '#0f1a0e',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  }

  const handleFocus = e => e.target.style.borderColor = '#c9a84c'
  const handleBlur = e => e.target.style.borderColor = 'rgba(15,26,14,0.08)'

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0a1209' }}>

      {/* ===== LEFT PANEL ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12"
        style={{ background: 'linear-gradient(145deg, #0f1a0e 0%, #1a3020 50%, #0f1a0e 100%)' }}>

        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #c9a84c 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, #588157 0%, transparent 50%)`,
          }} />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {[240, 320, 400, 480].map((size, i) => (
            <div key={i} className="absolute rounded-full border"
              style={{
                width: size, height: size,
                top: -size / 2, left: -size / 2,
                borderColor: `rgba(201, 168, 76, ${0.06 - i * 0.01})`,
              }} />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <Image src="/art2.png" alt="Shrilekha" width={48} height={48} className="object-contain brightness-110" />
            </div>
          </div>

          <div className="mb-3 flex items-center gap-3">
            <div className="h-px w-6" style={{ backgroundColor: 'rgba(201,168,76,0.3)' }} />
            <span className="text-xs font-bold uppercase tracking-[0.4em]" style={{ color: '#c9a84c' }}>Join the Studio</span>
            <div className="h-px w-6" style={{ backgroundColor: 'rgba(201,168,76,0.3)' }} />
          </div>

          <h2 className="text-3xl font-black uppercase tracking-widest text-white mb-6">
            Create Account
          </h2>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            {BENEFITS.map(b => (
              <div key={b} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(201,168,76,0.15)' }}>
                  <CheckCircle size={11} style={{ color: '#c9a84c' }} />
                </div>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{b}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-2xl w-full max-w-xs"
            style={{ backgroundColor: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.1)' }}>
            <p className="text-xs leading-relaxed text-center"
              style={{ color: 'rgba(255,255,255,0.35)' }}>
              Join 500+ customers who shop premium natural henna products from Shrilekha Mehndi Art, Pune.
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em]"
            style={{ color: 'rgba(201,168,76,0.3)' }}>
            ✦ Where Every Design Tells A Story ✦
          </p>
        </div>
      </div>

      {/* ===== RIGHT PANEL — form ===== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12"
        style={{ backgroundColor: '#fcfaf6' }}>
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <Image src="/art2.png" alt="Shrilekha" width={32} height={32} className="object-contain" />
            </div>
            <h1 className="font-black text-lg uppercase tracking-widest" style={{ color: '#0f1a0e' }}>Shrilekha</h1>
            <p className="text-xs font-bold uppercase tracking-[0.3em] mt-0.5" style={{ color: '#c9a84c' }}>Mehndi Art & Glowup</p>
          </div>

          {/* Form header */}
          <div className="mb-6">
            <h2 className="text-2xl font-black uppercase tracking-tight" style={{ color: '#0f1a0e' }}>
              Join the Studio
            </h2>
            <p className="text-xs font-medium mt-1.5" style={{ color: 'rgba(15,26,14,0.4)' }}>
              Create your free account — takes less than a minute
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="flex flex-col gap-4">

            {/* Name */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2"
                style={{ color: 'rgba(15,26,14,0.5)' }}>Full Name *</label>
              <div className="relative">
                <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: '#c9a84c' }} />
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Priya Sharma"
                  className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl outline-none transition-all"
                  style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2"
                style={{ color: 'rgba(15,26,14,0.5)' }}>Email Address *</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: '#c9a84c' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl outline-none transition-all"
                  style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2"
                style={{ color: 'rgba(15,26,14,0.5)' }}>
                Phone <span style={{ color: 'rgba(15,26,14,0.3)' }}>(optional — for order tracking)</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                  <Phone size={13} style={{ color: '#c9a84c' }} />
                  <span className="text-xs font-bold" style={{ color: 'rgba(15,26,14,0.3)' }}>+91</span>
                </div>
                <input type="tel" value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210" maxLength={10}
                  className="w-full pr-4 py-3 text-sm rounded-2xl outline-none transition-all"
                  style={{ ...inputStyle, paddingLeft: '4rem' }}
                  onFocus={handleFocus} onBlur={handleBlur} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2"
                style={{ color: 'rgba(15,26,14,0.5)' }}>Password *</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: '#c9a84c' }} />
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters"
                  className="w-full pl-11 pr-12 py-3 text-sm rounded-2xl outline-none transition-all"
                  style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'rgba(15,26,14,0.3)' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2"
                style={{ color: 'rgba(15,26,14,0.5)' }}>Confirm Password *</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: password && confirm && password === confirm ? '#15803d' : '#c9a84c' }} />
                <input type={showConfirm ? 'text' : 'password'} value={confirm}
                  onChange={e => setConfirm(e.target.value)} placeholder="Re-enter password"
                  className="w-full pl-11 pr-12 py-3 text-sm rounded-2xl outline-none transition-all"
                  style={{
                    ...inputStyle,
                    borderColor: confirm && password !== confirm ? '#fca5a5' : 'rgba(15,26,14,0.08)',
                  }}
                  onFocus={handleFocus} onBlur={handleBlur} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'rgba(15,26,14,0.3)' }}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirm && password !== confirm && (
                <p className="text-xs mt-1 font-medium" style={{ color: '#dc2626' }}>
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="group w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] mt-1"
              style={{
                backgroundColor: loading ? 'rgba(15,26,14,0.5)' : '#0f1a0e',
                color: 'white',
                boxShadow: '0 8px 24px rgba(15,26,14,0.2)',
              }}>
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* Divider + login link */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(15,26,14,0.08)' }} />
            <Sparkles size={12} style={{ color: '#c9a84c', opacity: 0.6 }} />
            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(15,26,14,0.08)' }} />
          </div>

          <p className="text-center text-xs font-medium" style={{ color: 'rgba(15,26,14,0.4)' }}>
            Already have an account?{' '}
            <Link href="/login"
              className="font-black uppercase tracking-wide border-b pb-0.5"
              style={{ color: '#0f1a0e', borderColor: '#c9a84c' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}