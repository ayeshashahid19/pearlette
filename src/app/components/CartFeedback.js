'use client'

import { Heart } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function CartFeedback() {
  const { feedback } = useCart()

  if (!feedback) return null

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#3d2c2a',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '999px',
        fontSize: '0.9rem',
        fontWeight: '500',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        zIndex: 1000,
        maxWidth: '90vw',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <Heart size={16} fill="#d49b9f" stroke="#d49b9f" aria-hidden="true" />
      {feedback}
    </div>
  )
}
