import { getProductsByCategory } from '../../lib/products.js'
import { getCategoryMeta } from '../../lib/categories.js'
import CategoryPage from '../components/CategoryPage'

export async function generateMetadata() {
  const { label, subtitle } = getCategoryMeta('bracelet')
  return {
    title: `${label} | Pearlette.pk`,
    description: subtitle,
  }
}

export default async function BraceletsPage() {
  const { label, subtitle } = getCategoryMeta('bracelet')
  const products = await getProductsByCategory('bracelet')

  return <CategoryPage title={label} subtitle={subtitle} products={products} />
}
