import { prisma } from './prisma.js'

export const FALLBACK_CATEGORIES = [
  { id: 'necklace', slug: 'necklace', name: 'Necklaces', imgUrl: '/images/categories/necklace.jpg', sortOrder: 1 },
  { id: 'bracelets', slug: 'bracelets', name: 'Bracelets', imgUrl: '/images/categories/bracelets.jpg', sortOrder: 2 },
  { id: 'earrings', slug: 'earrings', name: 'Earrings', imgUrl: '/images/categories/earrings.jpg', sortOrder: 3 },
  { id: 'rings', slug: 'rings', name: 'Rings', imgUrl: '/images/categories/rings.jpg', sortOrder: 4 },
  { id: 'armcuffs', slug: 'armcuffs', name: 'Arm Cuffs', imgUrl: '/images/categories/armcuffs.jpg', sortOrder: 5 },
  { id: 'charms', slug: 'charms', name: 'Charms', imgUrl: '/images/categories/charms.jpg', sortOrder: 6 },
]

export function serializeCategory(category) {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    imgUrl: category.imgUrl,
    sortOrder: category.sortOrder,
    updatedAt: category.updatedAt,
  }
}

export async function getCategories() {
  try {
    const rows = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } })
    if (rows.length > 0) return rows.map(serializeCategory)
    console.warn('getCategories: DB returned 0 rows, using fallback')
  } catch (error) {
    console.error('getCategories failed, using fallback:', error.message)
  }
  return FALLBACK_CATEGORIES
}
