import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, ArrowLeft, Tag } from 'lucide-react'

async function getPost(slug) {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return data
}

async function getRelatedPosts(currentSlug) {
  const { data } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, published_at')
    .eq('is_published', true)
    .neq('slug', currentSlug)
    .limit(3)
  return data || []
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: `${post.title} — Shrilekha Mehndi Art`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const [post, related] = await Promise.all([getPost(slug), getRelatedPosts(slug)])
  if (!post) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm mb-6 hover:underline"
        style={{ color: 'var(--brand-muted)' }}>
        <ArrowLeft size={15} /> Back to Blog
      </Link>

      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 badge badge-green text-xs">
              <Tag size={10} /> {tag}
            </span>
          ))}
        </div>
      )}

      <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-tight" style={{ color: 'var(--brand-text)' }}>
        {post.title}
      </h1>

      <div className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--brand-muted)' }}>
        <Calendar size={14} />
        {new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
      </div>

      {post.image_url && (
        <div className="rounded-xl overflow-hidden mb-6 aspect-video">
          <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {post.excerpt && (
        <p className="text-base leading-relaxed mb-6 font-medium border-l-4 pl-4"
          style={{ color: 'var(--brand-text)', borderColor: 'var(--brand-green)' }}>
          {post.excerpt}
        </p>
      )}

      <div>
        {post.content
          ? post.content.split('\n').map((para, i) =>
              para.trim()
                ? <p key={i} className="text-base leading-relaxed mb-4" style={{ color: 'var(--brand-muted)' }}>{para}</p>
                : <br key={i} />
            )
          : <p className="text-base leading-relaxed" style={{ color: 'var(--brand-muted)' }}>Full article coming soon!</p>
        }
      </div>

      {/* CTA */}
      <div className="mt-10 p-6 rounded-xl text-center" style={{ backgroundColor: 'var(--brand-surface)' }}>
        <p className="font-semibold mb-2" style={{ color: 'var(--brand-green)' }}>
          Ready to try premium mehndi products?
        </p>
        <p className="text-sm mb-4" style={{ color: 'var(--brand-muted)' }}>
          100% natural henna — free shipping above ₹499
        </p>
        <Link href="/products" className="btn-primary text-sm">Shop Now</Link>
      </div>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-5" style={{ color: 'var(--brand-text)' }}>More from the Blog</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map(p => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="card p-4 hover:shadow-md transition-all">
                <div className="text-2xl mb-2">🌿</div>
                <h3 className="font-medium text-sm mb-1 line-clamp-2" style={{ color: 'var(--brand-text)' }}>{p.title}</h3>
                <span className="text-xs font-medium" style={{ color: 'var(--brand-green)' }}>Read more →</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}