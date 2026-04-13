'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Leaf } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const { ok } = await res.json()
    if (ok) {
      toast.success('Welcome, Admin!')
      router.push('/admin')
    } else {
      toast.error('Wrong password')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--brand-surface)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--brand-brown)' }}>
            <Lock size={24} color="white" />
          </div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--brand-text)' }}>Admin Access</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--brand-muted)' }}>Shrilekha Mehndi Art — Store Admin</p>
        </div>
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>Admin Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password" autoComplete="current-password" />
            </div>
            <button type="submit" disabled={loading} className="btn-brown w-full justify-center">
              {loading ? 'Checking...' : 'Access Admin Panel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}