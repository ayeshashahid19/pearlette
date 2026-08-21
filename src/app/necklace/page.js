import { getProductsByCategory } from '../../lib/products.js'
import { getCategoryMeta } from '../../lib/categories.js'
import CategoryPage from '../components/CategoryPage'

export async function generateMetadata() {
  const { label, subtitle } = getCategoryMeta('necklace')
  return {
    title: `${label} | Pearlette.pk`,
    description: subtitle,
  }
}

export default async function NecklacePage() {
  const { label, subtitle } = getCategoryMeta('necklace')
  const products = await getProductsByCategory('necklace')

  return <CategoryPage title={label} subtitle={subtitle} products={products} />
}
