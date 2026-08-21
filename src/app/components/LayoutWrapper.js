'use client'
import { useState, useEffect } from 'react'
import AnimatedBackground from './AnimatedBackground'

export default function LayoutWrapper({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {mounted && <AnimatedBackground />}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}