import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { BookOpen, Calendar, ArrowRight } from 'lucide-react'

async function getPosts() {
  const { data } = await supabase.from('blog_posts').select('*').eq('is_published', true).order('published_at', { ascending: false })
  return data || []
}

export const metadata = { title: 'Mehndi Tips & Blog — Shrilekha Mehndi Art' }

export default async function BlogPage() {
  const posts = await getPosts()
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="section-title">Mehndi Tips & Blog</h1>
      <p className="section-subtitle">Design inspiration, DIY guides and henna care tips</p>
      {posts.length === 0 ? (
        <div className="card p-12 text-center">
          <BookOpen size={40} className="mx-auto mb-3" style={{ color: 'var(--brand-muted)' }} />
          <p className="text-sm" style={{ color: 'var(--brand-muted)' }}>Blog posts coming soon!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map(post => (
            <div key={post.id} className="card overflow-hidden hover:shadow-md transition-all group">
              <div className="h-32 flex items-center justify-center text-5xl" style={{ backgroundColor: 'var(--brand-surface)' }}>🌿</div>
              <div className="p-5">
                <div className="flex items-center gap-1.5 text-xs mb-3" style={{ color: 'var(--brand-muted)' }}>
                  <Calendar size={12} />
                  {new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <h2 className="font-semibold mb-2 leading-snug" style={{ color: 'var(--brand-text)' }}>{post.title}</h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--brand-muted)' }}>{post.excerpt}</p>
                <div className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--brand-green)' }}>
                  Read more <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}