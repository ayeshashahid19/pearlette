import fs from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

function extensionForMime(mimeType) {
  const map = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
  }
  return map[mimeType] || '.bin'
}

export async function uploadFile({ buffer, filename, mimeType, folder = 'uploads' }) {
  const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, '')
  const ext = path.extname(filename || '') || extensionForMime(mimeType)
  const uniqueName = `${randomUUID()}${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', safeFolder)

  await fs.mkdir(uploadDir, { recursive: true })
  await fs.writeFile(path.join(uploadDir, uniqueName), buffer)

  return {
    url: `/uploads/${safeFolder}/${uniqueName}`,
    provider: 'local',
  }
}
