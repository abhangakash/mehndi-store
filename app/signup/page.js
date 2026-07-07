'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * Fonts: pair a characterful serif for the display headline with a clean
 * grotesk for body/UI. Add this to your root layout (or _document) once:
 *
 * <link rel="preconnect" href="https://fonts.googleapis.com" />
 * <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
 */

const FIELD_COUNT = 4

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState({})

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  // ---- validation (computed, not toast-only) ----
  const errors = useMemo(() => {
    const e = {}
    if (touched.name && name.trim().length < 2) e.name = 'Enter your full name'
    if (touched.email && email && !/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email'
    if (touched.phone && phone && phone.length !== 10) e.phone = '10 digits required'
    if (touched.password && password && password.length < 6) e.password = 'At least 6 characters'
    return e
  }, [touched, name, email, phone, password])

  const filledCount = [name.trim().length > 1, /^\S+@\S+\.\S+$/.test(email), phone.length === 10, password.length >= 6].filter(Boolean).length

  const passwordStrength = useMemo(() => {
    if (!password) return 0
    let score = 0
    if (password.length >= 6) score++
    if (password.length >= 10) score++
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return Math.min(score, 3)
  }, [password])

  const markTouched = (field) => setTouched((t) => ({ ...t, [field]: true }))

  const handleSignup = async (e) => {
    e.preventDefault()
    setTouched({ name: true, email: true, phone: true, password: true })

    if (!name.trim() || !email || !phone || !password) {
      return toast.error('Please fill in all fields.')
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return toast.error('Please enter a valid email address.')
    }
    if (phone.length !== 10) {
      return toast.error('Please enter a valid 10-digit mobile number.')
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters.')
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name.trim(), phone } },
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Account created! Please check your email.')
      router.push('/login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#FAF8F5] text-[#0f1a14] font-sans antialiased flex flex-col justify-between pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <style>{`
        .font-display { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; }

        /* Icon + input as flex siblings */
        .field-group {
          display: flex;
          align-items: stretch;
          background: #fff;
          border: 1.5px solid #e7e2d6;
          border-radius: 0.75rem;
          overflow: hidden;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .field-group:focus-within {
          border-color: #c9a84c;
          box-shadow: 0 0 0 3px rgba(201,168,76,0.14);
        }
        .field-group[data-invalid="true"] { border-color: #f87171; }
        .field-icon {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 3rem;
          color: #a8a29e;
        }
        .field-icon.field-icon--prefix {
          width: auto;
          padding: 0 0.6rem 0 1rem;
          gap: 0.5rem;
          font-weight: 700;
          font-size: 16px;
          color: #57534e;
          border-right: 1px solid #e7e2d6;
        }
        .field-input {
          flex: 1 1 auto;
          min-width: 0;
          border: none;
          outline: none;
          background: transparent;
          padding: 0.9rem 1rem 0.9rem 0;
          font-size: 16px;
          color: #0f1a14;
        }
        .field-input--tight { padding-left: 0.75rem; font-weight: 600; letter-spacing: 0.02em; }
        .field-toggle {
          flex: 0 0 auto;
          width: 2.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a8a29e;
          background: transparent;
          border: none;
        }
      `}</style>

      {/* Segmented progress */}
      <div className="w-full px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <div className="max-w-sm mx-auto flex gap-1.5">
          {Array.from({ length: FIELD_COUNT }).map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full bg-[#e7e1d4] overflow-hidden">
              <div
                className="h-full bg-[#c9a84c] transition-all duration-500 ease-out rounded-full"
                style={{ width: i < filledCount ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-5 py-6">
        <div className="w-full max-w-sm mx-auto">

          {/* Header */}
          <div className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c9a84c] mb-1">
              Get started
            </p>
            <h1 className="font-display text-[2rem] leading-[1.1] font-medium tracking-tight text-[#0f1a14]">
              Create your account
            </h1>
            <p className="text-[14px] text-stone-500 mt-1.5 leading-relaxed">
              Save your address, track orders, and check out faster next time.
            </p>
          </div>

          <form id="signup-form" onSubmit={handleSignup} noValidate className="space-y-3.5">

            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1 pl-0.5">
                Full Name
              </label>
              <div className="field-group" data-invalid={!!errors.name}>
                <span className="field-icon"><User size={18} /></span>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => markTouched('name')}
                  placeholder="Priya Sharma"
                  aria-invalid={!!errors.name}
                  className="field-input"
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1 pl-0.5">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1 pl-0.5">
                Email Address
              </label>
              <div className="field-group" data-invalid={!!errors.email}>
                <span className="field-icon"><Mail size={18} /></span>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => markTouched('email')}
                  placeholder="name@example.com"
                  aria-invalid={!!errors.email}
                  className="field-input"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1 pl-0.5">{errors.email}</p>}
            </div>

            {/* Mobile Number */}
            <div>
              <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1 pl-0.5">
                Mobile Number
              </label>
              <div className="field-group" data-invalid={!!errors.phone}>
                <span className="field-icon field-icon--prefix">
                  <Phone size={16} />
                  +91
                </span>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={phone}
                  maxLength={10}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  onBlur={() => markTouched('phone')}
                  placeholder="98765 43210"
                  aria-invalid={!!errors.phone}
                  className="field-input field-input--tight"
                />
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-1 pl-0.5">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1 pl-0.5">
                Password
              </label>
              <div className="field-group" data-invalid={!!errors.password}>
                <span className="field-icon"><Lock size={18} /></span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => markTouched('password')}
                  placeholder="Minimum 6 characters"
                  aria-invalid={!!errors.password}
                  className="field-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="field-toggle"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Strength meter */}
              {password.length > 0 && (
                <div className="flex items-center gap-2 mt-2 pl-0.5">
                  <div className="flex gap-1 flex-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="h-1 flex-1 rounded-full bg-stone-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            passwordStrength > i
                              ? passwordStrength === 1 ? 'bg-red-400 w-full'
                              : passwordStrength === 2 ? 'bg-amber-400 w-full'
                              : 'bg-emerald-500 w-full'
                              : 'w-0'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-[11px] font-medium text-stone-400 w-12 text-right">
                    {passwordStrength <= 1 ? 'Weak' : passwordStrength === 2 ? 'Good' : 'Strong'}
                  </span>
                </div>
              )}
              {errors.password && <p className="text-xs text-red-500 mt-1 pl-0.5">{errors.password}</p>}
            </div>

            {/* Unified Submit Button (Below Form Fields / Above Log In Link) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0f1a14] hover:bg-[#1a2d23] active:bg-[#1a2d23] text-white py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
              >
                {loading ? 'Creating account…' : 'Create account'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </div>
          </form>

          {/* Login Link Alignment */}
          <div className="mt-5 text-center">
            <p className="text-sm text-stone-500">
              Already have an account?{' '}
              <Link href="/login" className="text-[#0f1a14] font-bold underline underline-offset-4 ml-1">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Branding View */}
      <div className="w-full flex items-center justify-center gap-1.5 text-stone-400 text-[10px] font-bold uppercase tracking-widest pt-4">
        <ShieldCheck size={14} className="text-[#c9a84c]" />
        <span>Secure Sign Up</span>
      </div>
    </div>
  )
}