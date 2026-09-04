import { prisma } from '../src/lib/prisma.js'

const updates = [
  { slug: 'necklace', imgUrl: '/images/categories/necklace.png' },
  { slug: 'bracelets', imgUrl: '/images/categories/bracelets.jpg' },
  { slug: 'earrings', imgUrl: '/images/categories/earrings.jpg' },
  { slug: 'rings', imgUrl: '/images/categories/rings.jpg' },
  { slug: 'armcuffs', imgUrl: '/images/categories/armcuffs.png' },
  { slug: 'charms', imgUrl: '/images/categories/charms.jpg' },
]

async function main() {
  for (const { slug, imgUrl } of updates) {
    await prisma.category.update({ where: { slug }, data: { imgUrl } })
    console.log(`Updated ${slug}`)
  }
  console.log('Done')
}

main().finally(() => prisma.$disconnect())
