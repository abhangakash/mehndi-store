'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Leaf, Mail, Phone, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()
  const [tab, setTab] = useState('email')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')

  const handleEmailSignup = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) return toast.error('Please fill all fields')
    if (password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
    if (error) toast.error(error.message)
    else { toast.success('Account created! Check your email to verify.'); router.push('/') }
    setLoading(false)
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!name || !phone) return toast.error('Please fill all fields')
    const formatted = phone.startsWith('+') ? phone : `+91${phone}`
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ phone: formatted, options: { data: { full_name: name } } })
    if (error) toast.error(error.message)
    else { setOtpSent(true); toast.success('OTP sent!') }
    setLoading(false)
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!otp) return toast.error('Enter the OTP')
    const formatted = phone.startsWith('+') ? phone : `+91${phone}`
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({ phone: formatted, token: otp, type: 'sms' })
    if (error) toast.error(error.message)
    else { toast.success('Welcome to Shrilekha!'); router.push('/') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: 'var(--brand-surface)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--brand-green)' }}>
            <Leaf size={24} color="white" />
          </div>
          <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--brand-green)' }}>Create account</h1>
          <p className="text-sm" style={{ color: 'var(--brand-muted)' }}>Join Shrilekha Mehndi Art</p>
        </div>
        <div className="card p-6">
          <div className="flex rounded-lg p-1 mb-5" style={{ backgroundColor: 'var(--brand-surface)' }}>
            {[{ key: 'email', label: 'Email', icon: <Mail size={14} /> }, { key: 'phone', label: 'Phone OTP', icon: <Phone size={14} /> }].map(t => (
              <button key={t.key} onClick={() => { setTab(t.key); setOtpSent(false) }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-all"
                style={{ backgroundColor: tab === t.key ? 'white' : 'transparent', color: tab === t.key ? 'var(--brand-green)' : 'var(--brand-muted)', boxShadow: tab === t.key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {!otpSent && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--brand-muted)' }} />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Priya Sharma" style={{ paddingLeft: '2.5rem' }} />
              </div>
            </div>
          )}

          {tab === 'email' && (
            <form onSubmit={handleEmailSignup} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--brand-muted)' }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={{ paddingLeft: '2.5rem' }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--brand-muted)' }} />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--brand-muted)' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-1">
                {loading ? 'Creating account...' : <> Create Account <ArrowRight size={16} /> </>}
              </button>
            </form>
          )}

          {tab === 'phone' && (
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="flex flex-col gap-4">
              {!otpSent && (
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>Mobile Number</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <Phone size={16} style={{ color: 'var(--brand-muted)' }} />
                      <span className="text-sm" style={{ color: 'var(--brand-muted)' }}>+91</span>
                    </div>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210" maxLength={10} style={{ paddingLeft: '4rem' }} />
                  </div>
                </div>
              )}
              {otpSent && (
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>Enter OTP</label>
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="6-digit OTP" maxLength={6} className="text-center text-xl tracking-widest font-semibold" />
                  <p className="text-xs mt-1.5" style={{ color: 'var(--brand-muted)' }}>
                    Sent to +91 {phone}.{' '}
                    <button type="button" onClick={() => setOtpSent(false)} className="underline" style={{ color: 'var(--brand-green)' }}>Change</button>
                  </p>
                </div>
              )}
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-1">
                {loading ? 'Please wait...' : otpSent ? <> Verify OTP <ArrowRight size={16} /> </> : <> Send OTP <ArrowRight size={16} /> </>}
              </button>
            </form>
          )}

          <p className="text-center text-sm mt-5" style={{ color: 'var(--brand-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium" style={{ color: 'var(--brand-green)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}