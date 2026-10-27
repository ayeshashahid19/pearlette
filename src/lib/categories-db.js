import { prisma } from './prisma.js'

export const FALLBACK_CATEGORIES = [
  { id: 'necklace', slug: 'necklace', name: 'Necklaces', imgUrl: '/images/categories/necklace.webp', sortOrder: 1 },
  { id: 'bracelets', slug: 'bracelets', name: 'Bracelets', imgUrl: '/images/categories/bracelets.jpg', sortOrder: 2 },
  { id: 'earrings', slug: 'earrings', name: 'Earrings', imgUrl: '/images/categories/earrings.jpg', sortOrder: 3 },
  { id: 'rings', slug: 'rings', name: 'Rings', imgUrl: '/images/categories/rings.jpg', sortOrder: 4 },
  { id: 'armcuffs', slug: 'armcuffs', name: 'Arm Cuffs', imgUrl: '/images/categories/armcuffs.webp', sortOrder: 5 },
  { id: 'charms', slug: 'charms', name: 'Charms', imgUrl: '/images/categories/charms.jpg', sortOrder: 6 },
]

const CATEGORY_IMAGE_MAP = {
  necklace: '/images/categories/necklace.webp',
  bracelets: '/images/categories/bracelets.jpg',
  earrings: '/images/categories/earrings.jpg',
  rings: '/images/categories/rings.jpg',
  armcuffs: '/images/categories/armcuffs.webp',
  charms: '/images/categories/charms.jpg',
}

// Older rows may still reference images that were replaced by the canonical
// files in CATEGORY_IMAGE_MAP. Resolve those known-stale URLs in code so the
// collections page never renders a missing local asset.
const CATEGORY_IMAGE_ALIASES = {
  '/images/categories/necklace.jpg': '/images/categories/necklace.webp',
  '/images/categories/necklace.png': '/images/categories/necklace.webp',
  '/images/categories/armcuffs.jpg': '/images/categories/armcuffs.webp',
  '/images/categories/armcuffs.png': '/images/categories/armcuffs.webp',
}

function resolveCategoryImgUrl(category) {
  const dbUrl = category.imgUrl?.trim()
  const imgUrl = CATEGORY_IMAGE_ALIASES[dbUrl] || dbUrl
  const isValidDbUrl =
    imgUrl &&
    imgUrl !== '/images/placeholder.jpg' &&
    (imgUrl.startsWith('/') || imgUrl.startsWith('https://'))

  if (isValidDbUrl) return imgUrl
  return CATEGORY_IMAGE_MAP[category.slug] || '/images/categories/necklace.webp'
}

export function serializeCategory(category) {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    imgUrl: resolveCategoryImgUrl(category),
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
