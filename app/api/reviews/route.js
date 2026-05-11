import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { product_id, reviewer_name, rating, comment } = await req.json()

    if (!product_id) return NextResponse.json({ error: 'Missing product' }, { status: 400 })
    if (!reviewer_name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    if (!rating || rating < 1 || rating > 5) return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 })

    const { error } = await supabaseAdmin.from('reviews').insert({
      product_id,
      reviewer_name: reviewer_name.trim(),
      rating: Number(rating),
      comment: comment?.trim() || null,
      is_approved: false, // Admin must approve in Supabase before it shows
    })

    if (error) throw new Error(error.message)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}