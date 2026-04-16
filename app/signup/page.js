'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Leaf, Mail, Lock, Eye, EyeOff, User, ArrowRight, Phone } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
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
      options: {
        data: { full_name: name, phone: phone || '' },
      },
    })
    if (error) toast.error(error.message)
    else {
      toast.success('Account created! Please check your email to verify.')
      router.push('/login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: 'var(--brand-surface)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'var(--brand-green)' }}>
            <Leaf size={24} color="white" />
          </div>
          <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--brand-green)' }}>Create account</h1>
          <p className="text-sm" style={{ color: 'var(--brand-muted)' }}>Join Shrilekha Mehndi Art</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>
                Full Name *
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--brand-muted)' }} />
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Priya Sharma" style={{ paddingLeft: '2.5rem' }} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>
                Email Address *
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--brand-muted)' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" style={{ paddingLeft: '2.5rem' }} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>
                Phone Number (optional)
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Phone size={14} style={{ color: 'var(--brand-muted)' }} />
                  <span className="text-xs" style={{ color: 'var(--brand-muted)' }}>+91</span>
                </div>
                <input type="tel" value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210" maxLength={10} style={{ paddingLeft: '3.5rem' }} />
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--brand-muted)' }}>
                Used for order tracking — no OTP charges
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>
                Password *
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--brand-muted)' }} />
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 6 characters" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--brand-muted)' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>
                Confirm Password *
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--brand-muted)' }} />
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="Re-enter password" style={{ paddingLeft: '2.5rem' }} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-1">
              {loading ? 'Creating account...' : <> Create Account <ArrowRight size={16} /> </>}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: 'var(--brand-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium" style={{ color: 'var(--brand-green)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}