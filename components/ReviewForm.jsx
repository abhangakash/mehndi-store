'use client'
import { useState } from 'react'
import { Star, Send, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ReviewForm({ productId }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) { toast.error('Please select a star rating'); return }
    if (!name.trim()) { toast.error('Please enter your name'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, reviewer_name: name, rating, comment }),
      })
      const { success, error } = await res.json()
      if (error) throw new Error(error)
      setSubmitted(true)
      toast.success('Review submitted! It will appear after approval.')
    } catch (err) {
      toast.error(err.message || 'Failed to submit review')
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: '#f0fdf4', border: '1.5px solid rgba(21,128,61,0.2)' }}>
        <CheckCircle size={28} className="mx-auto mb-2" style={{ color: '#15803d' }} />
        <p className="font-black text-sm" style={{ color: '#15803d' }}>Thank you for your review!</p>
        <p className="text-xs mt-1" style={{ color: 'rgba(15,26,14,0.5)' }}>
          Your review will appear once approved. We usually approve within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#fcfaf6', border: '1.5px solid rgba(15,26,14,0.08)' }}>
      <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(15,26,14,0.06)', backgroundColor: '#fef9ee' }}>
        <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(15,26,14,0.5)' }}>
          Write a Review
        </p>
      </div>
      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
        {/* Star rating */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'rgba(15,26,14,0.5)' }}>
            Your Rating *
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} type="button"
                onClick={() => setRating(s)}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform hover:scale-110">
                <Star
                  size={28}
                  fill={s <= (hover || rating) ? '#8B6B12' : 'none'}
                  color={s <= (hover || rating) ? '#8B6B12' : '#d1d5db'}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-xs font-black uppercase tracking-wide"
                style={{ color: '#8B6B12' }}>
                {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][rating]}
              </span>
            )}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(15,26,14,0.5)' }}>
            Your Name *
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Priya Sharma"
            className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all"
            style={{ backgroundColor: 'white', border: '1.5px solid rgba(15,26,14,0.08)', color: '#0f1a0e' }}
            onFocus={e => e.target.style.borderColor = '#8B6B12'}
            onBlur={e => e.target.style.borderColor = 'rgba(15,26,14,0.08)'}
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(15,26,14,0.5)' }}>
            Review <span style={{ fontWeight: 400, textTransform: 'none', color: 'rgba(15,26,14,0.3)' }}>(optional)</span>
          </label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Tell others about your experience with this product..."
            rows={3}
            className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all resize-none"
            style={{ backgroundColor: 'white', border: '1.5px solid rgba(15,26,14,0.08)', color: '#0f1a0e' }}
            onFocus={e => e.target.style.borderColor = '#8B6B12'}
            onBlur={e => e.target.style.borderColor = 'rgba(15,26,14,0.08)'}
          />
        </div>

        <button type="submit" disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all"
          style={{ backgroundColor: loading ? 'rgba(15,26,14,0.4)' : '#0f1a0e' }}>
          <Send size={13} /> {loading ? 'Submitting...' : 'Submit Review'}
        </button>

        <p className="text-center text-xs" style={{ color: 'rgba(15,26,14,0.3)' }}>
          Reviews are approved within 24 hours
        </p>
      </form>
    </div>
  )
}