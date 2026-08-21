import { getProductsByCategory } from '../../lib/products.js'
import { getCategoryMeta } from '../../lib/categories.js'
import CategoryPage from '../components/CategoryPage'

export async function generateMetadata() {
  const { label, subtitle } = getCategoryMeta('armcuff')
  return {
    title: `${label} | Pearlette.pk`,
    description: subtitle,
  }
}

export default async function ArmCuffsPage() {
  const { label, subtitle } = getCategoryMeta('armcuff')
  const products = await getProductsByCategory('armcuff')

  return <CategoryPage title={label} subtitle={subtitle} products={products} />
}
