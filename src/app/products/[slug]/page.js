import { notFound } from 'next/navigation'
import { getProductBySlug, getRelatedProducts } from '../../../lib/products.js'
import { getCategoryMeta } from '../../../lib/categories.js'
import ProductDetailClient from './ProductDetailClient'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return { title: 'Product Not Found | Pearlette.pk' }
  }

  const categoryMeta = getCategoryMeta(product.category)

  return {
    title: `${product.name} | Pearlette.pk`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Pearlette.pk`,
      description: product.description,
      type: 'website',
      url: `https://pearlette.pk/products/${product.slug}`,
      images: product.img ? [{ url: product.img, alt: product.name }] : [],
    },
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category, product.slug)

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />
}
