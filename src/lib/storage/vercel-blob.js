import { randomUUID } from 'crypto'

export async function uploadFile({ buffer, filename, mimeType, folder = 'custom-orders' }) {
  const token = process.env.BLOB_READ_WRITE_TOKEN

  if (!token) {
    throw new Error('Vercel Blob is not configured.')
  }

  const pathname = `${folder}/${randomUUID()}-${filename || 'upload'}`

  const response = await fetch(`https://blob.vercel-storage.com/${pathname}`, {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': mimeType,
      'x-add-random-suffix': '1',
    },
    body: buffer,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error?.message || 'Vercel Blob upload failed.')
  }

  return {
    url: data.url,
    provider: 'vercel-blob',
  }
}
