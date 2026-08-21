import { getProductsByCategory } from '../../lib/products.js'
import { getCategoryMeta } from '../../lib/categories.js'
import CategoryPage from '../components/CategoryPage'

export async function generateMetadata() {
  const { label, subtitle } = getCategoryMeta('charm')
  return {
    title: `${label} | Pearlette.pk`,
    description: subtitle,
  }
}

export default async function CharmsPage() {
  const { label, subtitle } = getCategoryMeta('charm')
  const products = await getProductsByCategory('charm')

  return <CategoryPage title={label} subtitle={subtitle} products={products} />
}
