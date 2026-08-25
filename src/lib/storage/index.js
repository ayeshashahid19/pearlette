import { uploadFile as uploadLocal } from './local.js'
import { uploadFile as uploadCloudinary } from './cloudinary.js'
import { uploadFile as uploadVercelBlob } from './vercel-blob.js'

const providers = {
  local: uploadLocal,
  cloudinary: uploadCloudinary,
  'vercel-blob': uploadVercelBlob,
}

export function getStorageProviderName() {
  if (process.env.STORAGE_PROVIDER) return process.env.STORAGE_PROVIDER.toLowerCase()
  if (process.env.BLOB_READ_WRITE_TOKEN) return 'vercel-blob'
  return 'local'
}

export async function uploadImage(file, { folder = 'custom-orders' } = {}) {
  const providerName = getStorageProviderName()
  const upload = providers[providerName]

  if (!upload) {
    throw new Error(`Unsupported storage provider: ${providerName}`)
  }

  try {
    return await upload({
      buffer: file.buffer,
      filename: file.filename,
      mimeType: file.mimeType,
      folder,
    })
  } catch (error) {
    if (providerName !== 'local') {
      console.warn(`Storage provider "${providerName}" failed, falling back to local:`, error.message)
      return uploadLocal({
        buffer: file.buffer,
        filename: file.filename,
        mimeType: file.mimeType,
        folder,
      })
    }

    throw error
  }
}
