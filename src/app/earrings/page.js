import { getProductsByCategory } from '../../lib/products.js'
import { getCategoryMeta } from '../../lib/categories.js'
import CategoryPage from '../components/CategoryPage'

export async function generateMetadata() {
  const { label, subtitle } = getCategoryMeta('earrings')
  return {
    title: `${label} | Pearlette.pk`,
    description: subtitle,
  }
}

export default async function EarringsPage() {
  const { label, subtitle } = getCategoryMeta('earrings')
  const products = await getProductsByCategory('earrings')

  return <CategoryPage title={label} subtitle={subtitle} products={products} />
}
