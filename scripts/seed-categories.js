import 'dotenv/config'
import { prisma } from '../src/lib/prisma.js'

const CATEGORIES = [
  { slug: 'necklace', name: 'Necklaces', sortOrder: 1 },
  { slug: 'bracelets', name: 'Bracelets', sortOrder: 2 },
  { slug: 'earrings', name: 'Earrings', sortOrder: 3 },
  { slug: 'rings', name: 'Rings', sortOrder: 4 },
  { slug: 'armcuffs', name: 'Arm Cuffs', sortOrder: 5 },
  { slug: 'charms', name: 'Charms', sortOrder: 6 },
]

async function main() {
  console.log('🌱 Seeding categories only...')
  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, sortOrder: category.sortOrder },
      create: { ...category, imgUrl: '/images/placeholder.jpg' },
    })
  }
  const count = await prisma.category.count()
  console.log(`✅ Done — ${count} categories in database`)
}

main()
  .catch((error) => {
    console.error('❌ Failed:', error.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
