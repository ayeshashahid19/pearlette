'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'pearlette-cart'

const CartContext = createContext(null)

function loadStoredCart() {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
      .filter(
        (item) =>
          item &&
          typeof item.productId === 'string' &&
          typeof item.name === 'string' &&
          typeof item.price === 'number' &&
          typeof item.quantity === 'number' &&
          item.quantity > 0
      )
      .map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image || '',
        slug: item.slug || '',
        quantity: item.quantity,
      }))
  } catch {
    return []
  }
}

function persistCart(items) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isHydrated, setIsHydrated] = useState(false)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(loadStoredCart())
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    persistCart(items)
  }, [items, isHydrated])

  useEffect(() => {
    if (!feedback) return

    const timer = window.setTimeout(() => setFeedback(''), 2500)
    return () => window.clearTimeout(timer)
  }, [feedback])

  const showFeedback = useCallback((message) => {
    setFeedback(message)
  }, [])

  const addItem = useCallback((product, quantity = 1) => {
    const qty = Math.max(1, Number(quantity) || 1)

    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id)

      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        )
      }

      return [
        ...current,
        {
          productId: product.id,
          name: product.name,
          price: Number(product.price),
          image: product.img || '',
          slug: product.slug || '',
          quantity: qty,
        },
      ]
    })

    showFeedback(`Added ${product.name} to cart`)
  }, [showFeedback])

  const incrementItem = useCallback((productId) => {
    setItems((current) =>
      current.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }, [])

  const decrementItem = useCallback((productId) => {
    setItems((current) =>
      current
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }, [])

  const removeItem = useCallback((productId) => {
    setItems((current) => current.filter((item) => item.productId !== productId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }, [items])

  const getSubtotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [items])

  const value = useMemo(
    () => ({
      items,
      isHydrated,
      feedback,
      addItem,
      incrementItem,
      decrementItem,
      removeItem,
      clearCart,
      getItemCount,
      getSubtotal,
    }),
    [
      items,
      isHydrated,
      feedback,
      addItem,
      incrementItem,
      decrementItem,
      removeItem,
      clearCart,
      getItemCount,
      getSubtotal,
    ]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}
