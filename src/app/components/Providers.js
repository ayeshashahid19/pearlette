'use client'

import { CartProvider } from '../context/CartContext'
import CartFeedback from './CartFeedback'

export default function Providers({ children }) {
  return (
    <CartProvider>
      {children}
      <CartFeedback />
    </CartProvider>
  )
}
