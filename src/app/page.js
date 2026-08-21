import { getFeaturedProducts } from '../lib/products.js'
import HomePage from './components/HomePage'

export default async function Home() {
  const featuredProducts = await getFeaturedProducts(6)
  return <HomePage featuredProducts={featuredProducts} />
}
