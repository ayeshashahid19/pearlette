import { prisma } from '../lib/prisma.js'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pearlette.pk'

export default async function sitemap() {
  const staticRoutes = [
    '',
    '/collections',
    '/necklace',
    '/bracelets',
    '/earrings',
    '/rings',
    '/armcuffs',
    '/charms',
    '/custom',
    '/privacy',
    '/terms',
    '/shipping-policy',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }))

  let productRoutes = []

  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    })

    productRoutes = products.map((product) => ({
      url: `${SITE_URL}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  } catch {
    // Database unavailable — still emit the static routes.
  }

  return [...staticRoutes, ...productRoutes]
}
