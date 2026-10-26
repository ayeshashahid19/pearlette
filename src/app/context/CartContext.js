'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { MAX_ITEM_QUANTITY } from '../../lib/validation.js'

const STORAGE_KEY = 'pearlette-cart'

const CartContext = createContext(null)

function clampQuantity(value) {
  const quantity = Number(value)
  if (!Number.isFinite(quantity)) return 1
  return Math.min(MAX_ITEM_QUANTITY, Math.max(1, Math.floor(quantity)))
}

function loadStoredCart() {
  if (typeof window === 'undefined') return { items: [], issues: [] }

  let raw
  try {
    raw = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return { items: [], issues: [{ type: 'unreadable' }] }
  }

  if (!raw) return { items: [], issues: [] }

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { items: [], issues: [{ type: 'unreadable' }] }
  }

  if (!Array.isArray(parsed)) {
    return { items: [], issues: [{ type: 'unreadable' }] }
  }

  const merged = new Map()
  const issues = []

  for (const entry of parsed) {
    if (
      !entry ||
      typeof entry !== 'object' ||
      typeof entry.productId !== 'string' ||
      !entry.productId.trim()
    ) {
      issues.push({
        type: 'removed',
        name: typeof entry?.name === 'string' ? entry.name : '',
      })
      continue
    }

    const productId = entry.productId.trim()
    const rawQuantity = Number(entry.quantity)
    const quantity = clampQuantity(rawQuantity)

    if (merged.has(productId)) {
      const existing = merged.get(productId)

      if (Number.isFinite(rawQuantity)) {
        const combined = existing.quantity + rawQuantity
        existing.quantity = clampQuantity(combined)

        if (combined > MAX_ITEM_QUANTITY || combined < 1) {
          issues.push({
            type: 'quantity',
            productId,
            name: existing.name,
            quantity: existing.quantity,
          })
        }
      } else {
        issues.push({
          type: 'quantity',
          productId,
          name: existing.name,
          quantity: existing.quantity,
        })
      }

      continue
    }

    const rawPrice = entry.price
    const parsedPrice = Number(rawPrice)
    const price =
      rawPrice !== null &&
      rawPrice !== '' &&
      Number.isFinite(parsedPrice) &&
      parsedPrice >= 0
        ? parsedPrice
        : null

    const name =
      typeof entry.name === 'string' && entry.name.trim() ? entry.name : 'Item'

    if (price === null) {
      issues.push({ type: 'price', productId, name })
    }

    if (!Number.isFinite(rawQuantity) || quantity !== rawQuantity) {
      issues.push({ type: 'quantity', productId, name, quantity })
    }

    merged.set(productId, {
      productId,
      name,
      price,
      image: typeof entry.image === 'string' ? entry.image : '',
      slug: typeof entry.slug === 'string' ? entry.slug : '',
      quantity,
    })
  }

  return { items: Array.from(merged.values()), issues }
}

function persistCart(items) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const itemsRef = useRef([])
  const [isHydrated, setIsHydrated] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [storageIssues, setStorageIssues] = useState([])
  const didHydrateRef = useRef(false)
  const refreshPromiseRef = useRef(null)
  const cartVersionRef = useRef(0)

  const commitItems = useCallback((nextOrUpdater) => {
    const next =
      typeof nextOrUpdater === 'function'
        ? nextOrUpdater(itemsRef.current)
        : nextOrUpdater

    itemsRef.current = next
    cartVersionRef.current += 1
    setItems(next)
  }, [])

  // Monotonic version used by checkout to detect cart edits made while a
  // price-validation request is in flight.
  const getCartVersion = useCallback(() => cartVersionRef.current, [])

  useEffect(() => {
    if (didHydrateRef.current) return
    didHydrateRef.current = true

    const { items: storedItems, issues } = loadStoredCart()

    setItems(storedItems)
    itemsRef.current = storedItems
    setStorageIssues(issues)
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
    const requested = Number(quantity)
    const qty = Number.isFinite(requested)
      ? Math.max(1, Math.floor(requested))
      : 1

    commitItems((current) => {
      const existing = current.find((item) => item.productId === product.id)

      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: Math.min(MAX_ITEM_QUANTITY, item.quantity + qty),
              }
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
          quantity: Math.min(MAX_ITEM_QUANTITY, qty),
        },
      ]
    })

    showFeedback(`Added ${product.name} to cart`)
  }, [commitItems, showFeedback])

  const incrementItem = useCallback((productId) => {
    commitItems((current) =>
      current.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.min(MAX_ITEM_QUANTITY, item.quantity + 1),
            }
          : item
      )
    )
  }, [commitItems])

  const decrementItem = useCallback((productId) => {
    commitItems((current) =>
      current
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }, [commitItems])

  const removeItem = useCallback((productId) => {
    commitItems((current) =>
      current.filter((item) => item.productId !== productId)
    )
  }, [commitItems])

  const clearCart = useCallback(() => {
    commitItems([])
  }, [commitItems])

  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }, [items])

  const getSubtotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [items])

  const refreshItems = useCallback(({ force = false } = {}) => {
    const startRefresh = () => {
      const promise = (async () => {
        const requestedItems = itemsRef.current

        if (requestedItems.length === 0) {
          return { changed: false, priceChanges: [], removed: [] }
        }

        const requestedIds = [
          ...new Set(requestedItems.map((item) => item.productId)),
        ]

        const response = await fetch('/api/cart/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productIds: requestedIds }),
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data.error || 'Could not confirm current prices.')
        }

        const products = Array.isArray(data.products) ? data.products : []
        const requestedIdSet = new Set(requestedIds)
        const productMap = new Map(
          products.map((product) => [product.id, product])
        )

        const priceChanges = []
        const removed = []
        let changed = false

        // Reconcile against itemsRef.current, not the snapshot used for the
        // request: the cart may have changed while the request was in flight.
        // Items added after the request started are not in requestedIdSet and
        // are deliberately left untouched.
        const nextItems = itemsRef.current.flatMap((item) => {
          if (!requestedIdSet.has(item.productId)) return [item]

          const product = productMap.get(item.productId)

          if (!product) {
            removed.push(item.name || 'Item')
            changed = true
            return []
          }

          const price = Number(product.price)
          const quantity = clampQuantity(item.quantity)
          const updated = {
            ...item,
            name: product.name || item.name,
            price,
            image: product.img || item.image,
            slug: product.slug || item.slug,
            quantity,
          }

          if (item.price !== price) {
            priceChanges.push({
              name: updated.name,
              from: item.price,
              to: price,
            })
          }

          if (
            item.name !== updated.name ||
            item.price !== updated.price ||
            item.image !== updated.image ||
            item.slug !== updated.slug ||
            item.quantity !== updated.quantity
          ) {
            changed = true
          }

          return [updated]
        })

        if (changed) {
          commitItems(nextItems)
        }

        // Missing prices from malformed storage are resolved by a successful
        // refresh, so drop those issues once the server has answered.
        setStorageIssues((current) => {
          const next = current.filter((issue) => issue.type !== 'price')
          return next.length === current.length ? current : next
        })

        return { changed, priceChanges, removed }
      })()

      const tracked = promise.finally(() => {
        refreshPromiseRef.current = null
      })

      refreshPromiseRef.current = tracked
      return tracked
    }

    if (!refreshPromiseRef.current) return startRefresh()
    if (!force) return refreshPromiseRef.current

    // A forced refresh must not reuse an older in-flight response (for
    // example the mount-time check). Wait for it to settle, then re-check.
    return refreshPromiseRef.current.catch(() => {}).then(startRefresh)
  }, [commitItems])

  const value = useMemo(
    () => ({
      items,
      isHydrated,
      feedback,
      storageIssues,
      addItem,
      incrementItem,
      decrementItem,
      removeItem,
      clearCart,
      getItemCount,
      getSubtotal,
      refreshItems,
      getCartVersion,
    }),
    [
      items,
      isHydrated,
      feedback,
      storageIssues,
      addItem,
      incrementItem,
      decrementItem,
      removeItem,
      clearCart,
      getItemCount,
      getSubtotal,
      refreshItems,
      getCartVersion,
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
