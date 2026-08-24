import fs from 'node:fs'
import path from 'node:path'
import { getFeaturedProducts } from '../lib/products.js'
import HomePage from './components/HomePage'

export const revalidate = 60

export default async function Home() {
  const featuredProducts = await getFeaturedProducts(6)

  const videosDir = path.join(process.cwd(), 'public', 'videos')
  const hasBrandVideo = fs.existsSync(path.join(videosDir, 'brand-story.mp4'))
  const brandVideoPoster = fs.existsSync(path.join(videosDir, 'brand-story-poster.jpg'))
    ? '/videos/brand-story-poster.jpg'
    : null

  return (
    <HomePage
      featuredProducts={featuredProducts}
      brandVideoUrl={hasBrandVideo ? '/videos/brand-story.mp4' : null}
      brandVideoPoster={brandVideoPoster}
    />
  )
}
