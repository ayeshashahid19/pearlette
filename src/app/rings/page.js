import { getProductsByCategory } from '../../lib/products.js'
import { getCategoryMeta } from '../../lib/categories.js'
import CategoryPage from '../components/CategoryPage'

export async function generateMetadata() {
  const { label, subtitle } = getCategoryMeta('ring')
  return {
    title: `${label} | Pearlette.pk`,
    description: subtitle,
  }
}

export default async function RingsPage() {
  const { label, subtitle } = getCategoryMeta('ring')
  const products = await getProductsByCategory('ring')

  return <CategoryPage title={label} subtitle={subtitle} products={products} />
}
