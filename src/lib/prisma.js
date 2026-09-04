import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis

function createPrismaClient() {
const connectionString = process.env.DATABASE_URL
  const isLocalHost = /localhost|127\.0\.0\.1|::1/.test(new URL(connectionString).hostname)
  const adapter = new PrismaPg({
    connectionString,
    ssl: isLocalHost ? false : { rejectUnauthorized: false },
  })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
