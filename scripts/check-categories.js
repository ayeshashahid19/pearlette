import { prisma } from '../src/lib/prisma.js'

async function main() {
  const cats = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } })
  cats.forEach(c => console.log(`${c.slug}: ${c.imgUrl}`))
  await prisma.$disconnect()
}
main()
