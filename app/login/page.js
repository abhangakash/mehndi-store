'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  Mail, Lock, Eye, EyeOff, ArrowRight,
  Package, Sparkles, ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [forgotMode, setForgotMode] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) return toast.error('Please fill all fields')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) toast.error(error.message)
    else { toast.success('Welcome back!'); router.push('/') }
    setLoading(false)
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!email) return toast.error('Enter your email address')
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) toast.error(error.message)
    else toast.success('Reset link sent! Check your email.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0a1209' }}>

      {/* ===== LEFT PANEL — decorative, hidden on mobile ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12"
        style={{ background: 'linear-gradient(145deg, #0f1a0e 0%, #1a3020 50%, #0f1a0e 100%)' }}>

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #c9a84c 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, #588157 0%, transparent 50%)`,
          }} />

        {/* Decorative rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {[240, 320, 400, 480].map((size, i) => (
            <div key={i}
              className="absolute rounded-full border"
              style={{
                width: size,
                height: size,
                top: -size / 2,
                left: -size / 2,
                borderColor: `rgba(201, 168, 76, ${0.06 - i * 0.01})`,
              }} />
          ))}
        </div>

        {/* Center logo */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <Image src="/art2.png" alt="Shrilekha" width={56} height={56}
                className="object-contain brightness-110" />
            </div>
            <div className="absolute -inset-3 rounded-full"
              style={{ border: '1px solid rgba(201,168,76,0.1)' }} />
          </div>

          <div className="mb-3 flex items-center gap-3">
            <div className="h-px w-8" style={{ backgroundColor: 'rgba(201,168,76,0.3)' }} />
            <span className="text-xs font-bold uppercase tracking-[0.4em]"
              style={{ color: '#c9a84c' }}>
              Est. Pune, India
            </span>
            <div className="h-px w-8" style={{ backgroundColor: 'rgba(201,168,76,0.3)' }} />
          </div>

          <h2 className="text-4xl font-black uppercase tracking-widest text-white mb-2">
            Shrilekha
          </h2>
          <p className="text-sm font-light tracking-[0.3em] uppercase mb-8"
            style={{ color: 'rgba(201,168,76,0.7)' }}>
            Mehndi Art & Glowup Studio
          </p>

          <p className="text-sm leading-relaxed text-center max-w-xs"
            style={{ color: 'rgba(255,255,255,0.4)' }}>
            Where every design tells a story. Premium henna products & professional bridal beauty services.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-6 mt-10 w-full max-w-xs">
            {[
              { num: '500+', label: 'Clients' },
              { num: '5★', label: 'Rated' },
              { num: '5+', label: 'Years' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-black" style={{ color: '#c9a84c' }}>{s.num}</div>
                <div className="text-xs font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em]"
            style={{ color: 'rgba(201,168,76,0.3)' }}>
            ✦ Where Every Design Tells A Story ✦
          </p>
        </div>
      </div>

      {/* ===== RIGHT PANEL — form ===== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:py-0"
        style={{ backgroundColor: '#fcfaf6' }}>
        <div className="w-full max-w-sm">

          {/* Mobile logo — only shows on mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <Image src="/art2.png" alt="Shrilekha" width={32} height={32} className="object-contain" />
            </div>
            <h1 className="font-black text-lg uppercase tracking-widest" style={{ color: '#0f1a0e' }}>
              Shrilekha
            </h1>
            <p className="text-xs font-bold uppercase tracking-[0.3em] mt-0.5" style={{ color: '#c9a84c' }}>
              Mehndi Art & Glowup
            </p>
          </div>

          {/* Form header */}
          <div className="mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tight" style={{ color: '#0f1a0e' }}>
              {forgotMode ? 'Recover Access' : 'Welcome Back'}
            </h2>
            <p className="text-xs font-medium mt-1.5" style={{ color: 'rgba(15,26,14,0.4)' }}>
              {forgotMode
                ? 'Enter your email to receive a password reset link'
                : 'Sign in to your Shrilekha account'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={forgotMode ? handleForgotPassword : handleLogin}
            className="flex flex-col gap-5">

            {/* Email */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2"
                style={{ color: 'rgba(15,26,14,0.5)' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: '#c9a84c' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3.5 text-sm rounded-2xl outline-none transition-all"
                  style={{
                    backgroundColor: 'white',
                    border: '1.5px solid rgba(15,26,14,0.08)',
                    color: '#0f1a0e',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                  onFocus={e => e.target.style.borderColor = '#c9a84c'}
                  onBlur={e => e.target.style.borderColor = 'rgba(15,26,14,0.08)'}
                />
              </div>
            </div>

            {/* Password */}
            {!forgotMode && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black uppercase tracking-widest"
                    style={{ color: 'rgba(15,26,14,0.5)' }}>
                    Password
                  </label>
                  <button type="button" onClick={() => setForgotMode(true)}
                    className="text-xs font-bold uppercase tracking-wider transition-colors"
                    style={{ color: '#c9a84c' }}>
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: '#c9a84c' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 text-sm rounded-2xl outline-none transition-all"
                    style={{
                      backgroundColor: 'white',
                      border: '1.5px solid rgba(15,26,14,0.08)',
                      color: '#0f1a0e',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                    onFocus={e => e.target.style.borderColor = '#c9a84c'}
                    onBlur={e => e.target.style.borderColor = 'rgba(15,26,14,0.08)'}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'rgba(15,26,14,0.3)' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
              style={{
                backgroundColor: loading ? 'rgba(15,26,14,0.5)' : '#0f1a0e',
                color: 'white',
                boxShadow: '0 8px 24px rgba(15,26,14,0.2)',
              }}>
              {loading
                ? 'Verifying...'
                : forgotMode
                  ? 'Send Reset Link'
                  : 'Sign In'
              }
              {!loading && (
                <ArrowRight size={15}
                  className="group-hover:translate-x-1 transition-transform" />
              )}
            </button>

            {forgotMode && (
              <button type="button" onClick={() => setForgotMode(false)}
                className="text-xs font-bold uppercase tracking-widest text-center transition-colors"
                style={{ color: 'rgba(15,26,14,0.4)' }}>
                ← Back to login
              </button>
            )}
          </form>

          {/* Divider */}
          {!forgotMode && (
            <>
              <div className="flex items-center gap-4 my-7">
                <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(15,26,14,0.08)' }} />
                <Sparkles size={12} style={{ color: '#c9a84c', opacity: 0.6 }} />
                <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(15,26,14,0.08)' }} />
              </div>

              {/* Track order button */}
              <Link href="/track-order"
                className="flex items-center justify-between w-full px-5 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all group"
                style={{
                  border: '1.5px solid rgba(15,26,14,0.08)',
                  color: 'rgba(15,26,14,0.5)',
                  backgroundColor: 'white',
                }}>
                <div className="flex items-center gap-2">
                  <Package size={14} style={{ color: '#c9a84c' }} />
                  Track Order Without Login
                </div>
                <ChevronRight size={14}
                  className="group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {/* Sign up link */}
              <p className="text-center text-xs font-medium mt-6"
                style={{ color: 'rgba(15,26,14,0.4)' }}>
                New to Shrilekha?{' '}
                <Link href="/signup"
                  className="font-black uppercase tracking-wide border-b pb-0.5 transition-colors"
                  style={{ color: '#0f1a0e', borderColor: '#c9a84c' }}>
                  Create Account
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}