import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { prisma } from '../src/lib/prisma.js'

const PRODUCTS = [
  {
    name: 'Pearl Drop Necklace',
    slug: 'pearl-drop-necklace',
    price: 4500,
    category: 'necklace',
    description:
      'Elegant freshwater pearl drop necklace on a delicate gold-tone chain. Handcrafted for everyday elegance or special occasions.',
    material: 'Freshwater pearls, gold-tone chain',
    featured: true,
  },
  {
    name: 'Gold Chain Necklace',
    slug: 'gold-chain-necklace',
    price: 3800,
    category: 'necklace',
    description:
      'Classic gold-tone chain necklace with a secure clasp. A timeless piece that layers beautifully or wears alone.',
    material: 'Gold-tone metal',
    featured: true,
  },
  {
    name: 'Gold Chain Bracelet',
    slug: 'gold-chain-bracelet',
    price: 3200,
    category: 'bracelet',
    description:
      'Classic gold-tone chain bracelet with a secure lobster clasp. Lightweight and comfortable for daily wear.',
    material: 'Gold-tone metal',
    featured: true,
  },
  {
    name: 'Beaded Stretch Bracelet',
    slug: 'beaded-stretch-bracelet',
    price: 2100,
    category: 'bracelet',
    description:
      'Colorful handcrafted beaded bracelet with a comfortable stretch fit. Each bead is carefully strung by hand.',
    material: 'Glass beads, elastic cord',
    featured: true,
  },
  {
    name: 'Pearl Drop Earrings',
    slug: 'pearl-drop-earrings',
    price: 2800,
    category: 'earrings',
    description:
      'Elegant pearl drop earrings with gold-tone hooks. A graceful swing and soft luster for day or evening wear.',
    material: 'Freshwater pearls, gold-tone hooks',
    featured: true,
  },
  {
    name: 'Gold Hoop Earrings',
    slug: 'gold-hoop-earrings',
    price: 2200,
    category: 'earrings',
    description:
      'Classic gold-tone hoop earrings with a secure clasp. Lightweight hoops that complement any outfit.',
    material: 'Gold-tone metal',
    featured: true,
  },
  {
    name: 'Crystal Stud Earrings',
    slug: 'crystal-stud-earrings',
    price: 1800,
    category: 'earrings',
    description:
      'Sparkling crystal stud earrings that catch the light beautifully. Perfect for adding a subtle touch of shine.',
    material: 'Crystal stones, gold-tone setting',
    featured: false,
  },
  {
    name: 'Rose Gold Ring',
    slug: 'rose-gold-ring',
    price: 2800,
    category: 'ring',
    description:
      'Delicate rose gold-tone ring with an elegant minimalist design. Hand-finished for a smooth, comfortable fit.',
    material: 'Rose gold-tone metal',
    featured: false,
  },
  {
    name: 'Diamond Halo Ring',
    slug: 'diamond-halo-ring',
    price: 7500,
    category: 'ring',
    description:
      'Stunning halo-style ring featuring simulated diamonds arranged around a central stone. A statement piece for special moments.',
    material: 'Simulated diamonds, gold-tone band',
    featured: false,
  },
  {
    name: 'Gold Arm Cuff',
    slug: 'gold-arm-cuff',
    price: 4200,
    category: 'armcuff',
    description:
      'Stylish gold-tone arm cuff with an open design. Adjustable fit handcrafted for a bold, modern look.',
    material: 'Gold-tone metal',
    featured: false,
  },
  {
    name: 'Beaded Arm Cuff',
    slug: 'beaded-arm-cuff',
    price: 3500,
    category: 'armcuff',
    description:
      'Beautiful beaded arm cuff with intricate handwoven patterns. A unique artisan piece that stands out.',
    material: 'Glass beads, wire frame',
    featured: false,
  },
  {
    name: 'Heart Charm',
    slug: 'heart-charm',
    price: 950,
    category: 'charm',
    description:
      'Romantic heart charm with sparkling crystal accents. Perfect for bracelets, necklaces, or gifting.',
    material: 'Crystal accents, gold-tone base',
    featured: false,
  },
  {
    name: 'Butterfly Charm',
    slug: 'butterfly-charm',
    price: 850,
    category: 'charm',
    description:
      'Delicate butterfly charm with a soft enamel finish. A whimsical handmade accent for any jewelry collection.',
    material: 'Enamel, gold-tone base',
    featured: false,
  },
]

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@pearlette.pk'
  const plainPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const password = await bcrypt.hash(plainPassword, 10)

  await prisma.admin.upsert({
    where: { email },
    update: { password },
    create: { email, password },
  })

  console.log(`✅ Admin seeded: ${email}`)
  if (!process.env.ADMIN_PASSWORD) {
    console.log('   ⚠️  Development password: admin123 — change before production')
  }
}

async function seedProducts() {
  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        material: product.material,
        featured: product.featured,
        isActive: true,
        handcrafted: true,
        img: '/images/placeholder.jpg',
      },
      create: {
        ...product,
        handcrafted: true,
        isActive: true,
        img: '/images/placeholder.jpg',
      },
    })
  }

  console.log(`✅ ${PRODUCTS.length} products seeded`)
  console.log(`   Featured: ${PRODUCTS.filter((p) => p.featured).length}`)
}

const CATEGORIES = [
  { slug: 'necklace', name: 'Necklaces', sortOrder: 1 },
  { slug: 'bracelets', name: 'Bracelets', sortOrder: 2 },
  { slug: 'earrings', name: 'Earrings', sortOrder: 3 },
  { slug: 'rings', name: 'Rings', sortOrder: 4 },
  { slug: 'armcuffs', name: 'Arm Cuffs', sortOrder: 5 },
  { slug: 'charms', name: 'Charms', sortOrder: 6 },
]

async function seedCategories() {
  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, sortOrder: category.sortOrder },
      create: { ...category, imgUrl: '/images/placeholder.jpg' },
    })
  }
  console.log(`✅ ${CATEGORIES.length} categories seeded`)
}

async function main() {
  console.log('🌱 Seeding Pearlette.pk database...')
  await seedAdmin()
  await seedProducts()
  await seedCategories()
  console.log('🎉 Seed complete')
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
