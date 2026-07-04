import { supabase } from '@/lib/supabase'
import ProductsClient from '@/components/ProductsClient'

async function getProducts() {
  const { data } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  return data || []
}

async function getCategories() {
  const { data } = await supabase.from('categories').select('*')
  return data || []
}

export const metadata = {
  title: 'Shop CrabVeda — Ayurvedic Joint & Muscle Care Oil',
  description: 'Experience natural relief with CrabVeda Ayurvedic Crab Oil. Formulated with authentic herbs to reduce inflammation, relieve stiffness, and improve joint mobility.',
}

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams
  const category = params?.category || ''
  const [products, categories] = await Promise.all([getProducts(), getCategories()])
  return <ProductsClient products={products} categories={categories} initialCategory={category} />
}