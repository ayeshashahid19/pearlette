import { prisma } from './prisma.js'

export function serializeProduct(product) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    category: product.category,
    img: product.img,
    description: product.description,
    material: product.material,
    handcrafted: product.handcrafted,
    featured: product.featured,
    isActive: product.isActive,
    stock: product.stock,
    createdAt: product.createdAt?.toISOString?.() ?? product.createdAt,
    updatedAt: product.updatedAt?.toISOString?.() ?? product.updatedAt,
  }
}

function activeWhere(includeInactive = false) {
  return includeInactive ? {} : { isActive: true }
}

export async function getProducts({ category, featured, includeInactive = false } = {}) {
  const products = await prisma.product.findMany({
    where: {
      ...activeWhere(includeInactive),
      ...(category ? { category } : {}),
      ...(featured !== undefined ? { featured } : {}),
    },
    orderBy: [{ featured: 'desc' }, { createdAt: 'asc' }],
  })

  return products.map(serializeProduct)
}

export async function getFeaturedProducts(limit = 6) {
  const products = await prisma.product.findMany({
    where: { isActive: true, featured: true },
    orderBy: { createdAt: 'asc' },
    take: limit,
  })

  return products.map(serializeProduct)
}

export async function getProductsByCategory(category) {
  return getProducts({ category })
}

export async function getProductBySlug(slug) {
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
  })

  return product ? serializeProduct(product) : null
}

export async function getProductById(id, { includeInactive = false } = {}) {
  const product = await prisma.product.findFirst({
    where: {
      id,
      ...(includeInactive ? {} : { isActive: true }),
    },
  })

  return product ? serializeProduct(product) : null
}

export async function getRelatedProducts(category, excludeSlug, limit = 4) {
  const products = await prisma.product.findMany({
    where: {
      category,
      isActive: true,
      slug: { not: excludeSlug },
    },
    orderBy: { createdAt: 'asc' },
    take: limit,
  })

  return products.map(serializeProduct)
}

export async function getAllProductSlugs() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  })

  return products.map((p) => p.slug)
}
