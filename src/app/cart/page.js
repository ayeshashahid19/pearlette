'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { isValidPakistaniPhone } from '../../lib/validation.js'
import { calculateTotals } from '../../lib/pricing.js'

const FIELD_ORDER = ['name', 'email', 'address', 'city', 'phone']

function formatPrice(value) {
  return Number.isFinite(value) ? `Rs. ${value.toLocaleString()}` : null
}

function describeItems(names, limit = 3) {
  const unique = [...new Set(names.filter(Boolean))]
  if (unique.length === 0) return 'An item'
  if (unique.length === 1) return unique[0]

  const shown = unique.slice(0, limit)
  const remaining = unique.length - shown.length

  return remaining > 0
    ? `${shown.join(', ')} and ${remaining} more`
    : shown.join(', ')
}

function buildNotice({ priceChanges = [], removed = [], issues = [] }) {
  const parts = []

  if (issues.some((issue) => issue.type === 'unreadable')) {
    parts.push('Your saved cart could not be read, so it may be incomplete.')
  }

  const unrestorable = issues.filter((issue) => issue.type === 'removed')
  if (unrestorable.length > 0) {
    parts.push(
      `${describeItems(unrestorable.map((issue) => issue.name))} could not be restored and ${
        unrestorable.length > 1 ? 'were' : 'was'
      } removed from your cart.`
    )
  }

  const adjusted = issues.filter((issue) => issue.type === 'quantity')
  if (adjusted.length > 0) {
    parts.push(
      `Cart quantity was adjusted for ${describeItems(
        adjusted.map((issue) => issue.name)
      )}.`
    )
  }

  if (removed.length > 0) {
    const uniqueRemoved = [...new Set(removed)]
    parts.push(
      `${describeItems(uniqueRemoved)} ${
        uniqueRemoved.length > 1 ? 'are' : 'is'
      } no longer available and ${
        uniqueRemoved.length > 1 ? 'were' : 'was'
      } removed from your cart.`
    )
  }

  if (priceChanges.length > 0) {
    const changes = priceChanges.slice(0, 3).map((change) => {
      const from = formatPrice(change.from)
      return `${change.name} (${from ? `${from} → ` : ''}${formatPrice(change.to)})`
    })
    const remaining = priceChanges.length - changes.length

    parts.push(
      `Prices updated: ${changes.join(', ')}${
        remaining > 0 ? ` and ${remaining} more` : ''
      }.`
    )
  }

  return parts.join(' ')
}

export default function CartPage() {
  const router = useRouter()
  const {
    items,
    isHydrated,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
    refreshItems,
    storageIssues,
    getCartVersion,
  } = useCart()

  const [deliveryDetails, setDeliveryDetails] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    phone: '',
    instructions: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const fieldRefs = useRef({})
  const formRef = useRef(null)
  const [notice, setNotice] = useState('')
  const [noticeIsAlert, setNoticeIsAlert] = useState(false)
  const didInitialRefresh = useRef(false)
  const submitLockRef = useRef(false)
  const itemsRef = useRef(items)
  const storageIssuesRef = useRef(storageIssues)

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  useEffect(() => {
    storageIssuesRef.current = storageIssues
  }, [storageIssues])

  useEffect(() => {
    if (!isHydrated || didInitialRefresh.current) return
    didInitialRefresh.current = true

    refreshItems()
      .then((result) => {
        setNotice(buildNotice({ ...result, issues: storageIssuesRef.current }))
        setNoticeIsAlert(false)
      })
      .catch(() => {
        setNotice(
          itemsRef.current.length > 0
            ? "We couldn't confirm current prices. They will be checked again when you place your order."
            : ''
        )
        setNoticeIsAlert(false)
      })
    // storageIssues is read through a ref so this only runs once per mount.
  }, [isHydrated, refreshItems])

  const { subtotal, shipping, total } = calculateTotals(items)
  const hasKnownPrices = items.every((item) => Number.isFinite(item.price))

  const handleInputChange = (e) => {
    setDeliveryDetails({
      ...deliveryDetails,
      [e.target.name]: e.target.value,
    })
    if (formError) setFormError('')
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }))
    }
  }

  const validateFields = () => {
    const errors = {}

    if (!deliveryDetails.name.trim()) {
      errors.name = 'Full name is required.'
    }

    if (!isValidPakistaniPhone(deliveryDetails.phone)) {
      errors.phone = 'Enter a valid Pakistani phone number (e.g., 03001234567).'
    }

    if (!deliveryDetails.address.trim()) {
      errors.address = 'Delivery address is required.'
    }

    if (!deliveryDetails.city.trim()) {
      errors.city = 'City is required.'
    }

    const email = deliveryDetails.email.trim()
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Email address is invalid.'
    }

    return errors
  }

  const scrollToFirstError = (errors) => {
    const firstKey = FIELD_ORDER.find((key) => errors[key])
    if (firstKey) {
      fieldRefs.current[firstKey]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      fieldRefs.current[firstKey]?.focus?.()
    }
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()

    // State updates are not a synchronous re-entry guard, so claim the lock
    // before the first await. Overlapping calls return here immediately.
    if (submitLockRef.current) return
    submitLockRef.current = true

    try {
      if (items.length === 0) {
        setFormError('Your cart is empty.')
        return
      }

      const errors = validateFields()
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors)
        setFormError('Please fix the highlighted fields below.')
        scrollToFirstError(errors)
        return
      }

      setSubmitting(true)
      setFormError('')
      setFieldErrors({})
      setNotice('')
      setNoticeIsAlert(false)

      const startVersion = getCartVersion()

      try {
        let refresh

        try {
          refresh = await refreshItems({ force: true })
        } catch {
          setFormError("We couldn't confirm current prices. Please try again.")
          return
        }

        // This narrows the window, but it cannot guarantee the price stays the
        // same between this check and the order API's database read. The order
        // API remains the authority for the final stored total.
        if (refresh.changed) {
          setNotice(
            buildNotice(refresh) ||
              'Your cart was updated. Please review the total and place the order again.'
          )
          setNoticeIsAlert(true)
          return
        }

        // Cart controls are disabled while submitting, but guard against edits
        // from any other code path: never submit a snapshot that no longer
        // matches the current cart.
        if (getCartVersion() !== startVersion) {
          setNotice(
            'Your cart changed while we were checking prices. Please review your cart and place the order again.'
          )
          setNoticeIsAlert(true)
          return
        }

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: deliveryDetails.name,
            customerEmail: deliveryDetails.email || null,
            customerPhone: deliveryDetails.phone,
            customerAddress: deliveryDetails.address,
            customerCity: deliveryDetails.city,
            customerInstructions: deliveryDetails.instructions || null,
            items: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to place order.')
        }

        clearCart()
        router.push(`/cart/success?orderId=${data.order.id}`)
      } catch (error) {
        setFormError(error.message)
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } finally {
      setSubmitting(false)
      submitLockRef.current = false
    }
  }

  if (!isHydrated) {
    return (
      <div>
        <Navbar />
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '40px 24px', color: '#5f4a47' }}>
          Loading cart...
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '40px 24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px',
            flexWrap: 'wrap',
          }}
        >
          <h1 style={{ fontSize: '2.5rem', color: '#3d2c2a', fontWeight: '600', margin: 0 }}>
            Your Cart
          </h1>
          {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                disabled={submitting}
                className="btn-ghost-pink"
                style={{
                  background: 'transparent',
                  border: '1px solid #f0dbd9',
                  color: '#5f4a47',
                  padding: '10px 18px',
                  borderRadius: '999px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  fontWeight: '500',
                  opacity: submitting ? 0.6 : 1,
                  transition: 'color 0.2s ease, border-color 0.2s ease',
                }}
              >
                Clear cart
              </button>
            )}
        </div>

        {notice && (
          <div
            role={noticeIsAlert ? 'alert' : 'status'}
            aria-live={noticeIsAlert ? 'assertive' : 'polite'}
            aria-atomic="true"
            style={{
              background: '#fce4e6',
              border: '1px solid #f0dbd9',
              color: '#3d2c2a',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '24px',
              fontSize: '0.9rem',
              lineHeight: '1.6',
            }}
          >
            {notice}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '50px',
          }}
          className="cart-layout"
        >
          <div>
            {items.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  background: 'white',
                  borderRadius: '24px',
                }}
              >
                <p style={{ fontSize: '1.2rem', color: '#5f4a47' }}>Your cart is empty</p>
                <Link
                  href="/"
                  className="btn-solid-pink"
                  style={{
                    display: 'inline-block',
                    marginTop: '20px',
                    background: '#d49b9f',
                    color: 'white',
                    padding: '12px 30px',
                    borderRadius: '40px',
                    textDecoration: 'none',
                    fontWeight: '600',
                  }}
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div>
                {items.map((item) => (
                  <div
                    key={item.productId}
                    style={{
                      background: 'white',
                      padding: '20px',
                      borderRadius: '16px',
                      marginBottom: '15px',
                      display: 'grid',
                      gridTemplateColumns: '72px 1fr auto',
                      gap: '16px',
                      alignItems: 'center',
                      border: '1px solid #fce4e6',
                    }}
                  >
                    <div
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: '#fce4e6',
                      }}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : null}
                    </div>

                    <div>
                      {item.slug ? (
                        <Link
                          href={`/products/${item.slug}`}
                          style={{
                            color: '#3d2c2a',
                            textDecoration: 'none',
                            fontWeight: '600',
                          }}
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <h3 style={{ color: '#3d2c2a', margin: 0 }}>{item.name}</h3>
                      )}
                      <p style={{ color: '#d49b9f', fontWeight: '600', margin: '6px 0 0' }}>
                        {Number.isFinite(item.price)
                          ? `Rs. ${item.price.toLocaleString()}`
                          : 'Confirming price…'}
                      </p>
                      <p style={{ color: '#5f4a47', fontSize: '0.85rem', margin: '4px 0 0' }}>
                        {Number.isFinite(item.price)
                          ? `Line total: Rs. ${(item.price * item.quantity).toLocaleString()}`
                          : 'Line total: confirming price…'}
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.name}`}
                          onClick={() => decrementItem(item.productId)}
                          disabled={submitting}
                          className="qty-btn"
                          style={{
                            ...qtyButtonStyle,
                            cursor: submitting ? 'not-allowed' : 'pointer',
                            opacity: submitting ? 0.5 : 1,
                          }}
                        >
                          −
                        </button>
                        <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: '600' }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.name}`}
                          onClick={() => incrementItem(item.productId)}
                          disabled={submitting}
                          className="qty-btn"
                          style={{
                            ...qtyButtonStyle,
                            cursor: submitting ? 'not-allowed' : 'pointer',
                            opacity: submitting ? 0.5 : 1,
                          }}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        disabled={submitting}
                        style={{
                          background: '#ff6b6b',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          cursor: submitting ? 'not-allowed' : 'pointer',
                          fontFamily: 'inherit',
                          fontSize: '0.85rem',
                          opacity: submitting ? 0.6 : 1,
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <div
                  style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '2px solid #d49b9f',
                    marginTop: '20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '1rem',
                      marginBottom: '8px',
                      color: '#5f4a47',
                    }}
                  >
                    <span>Subtotal</span>
                    <span>
                      {hasKnownPrices ? `Rs. ${subtotal.toLocaleString()}` : 'Confirming…'}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '1rem',
                      marginBottom: '8px',
                      color: '#5f4a47',
                    }}
                  >
                    <span>Shipping</span>
                    <span>Rs. {shipping.toLocaleString()}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      paddingTop: '8px',
                      borderTop: '1px solid #fce4e6',
                    }}
                  >
                    <span style={{ color: '#3d2c2a' }}>Total</span>
                    <span style={{ color: '#d49b9f' }}>
                      {hasKnownPrices ? `Rs. ${total.toLocaleString()}` : 'Confirming…'}
                    </span>
                  </div>
                  <p style={{ color: '#5f4a47', fontSize: '0.85rem', marginTop: '10px' }}>
                    Cash on Delivery
                  </p>
                  <Link
                    href="/"
                    className="btn-solid-pink"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      marginTop: '16px',
                      background: '#d49b9f',
                      color: 'white',
                      padding: '14px',
                      borderRadius: '60px',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                    }}
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              background: 'white',
              padding: '35px',
              borderRadius: '24px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              height: 'fit-content',
            }}
          >
            <h2 style={{ fontSize: '1.5rem', color: '#3d2c2a', marginBottom: '20px' }}>
              Delivery Details
            </h2>
            <p style={{ color: '#5f4a47', marginBottom: '25px', fontSize: '0.95rem' }}>
              Please fill in your delivery information. We offer Cash on Delivery nationwide.
            </p>

            <form onSubmit={handlePlaceOrder} noValidate ref={formRef}>
              {formError && (
                <div
                  role="alert"
                  style={{
                    background: '#fff0f0',
                    border: '1px solid #ffb3b3',
                    color: '#8a2f2f',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    marginBottom: '18px',
                    fontSize: '0.9rem',
                  }}
                >
                  {formError}
                </div>
              )}

              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={deliveryDetails.name}
                  onChange={handleInputChange}
                  ref={(el) => { fieldRefs.current.name = el }}
                  style={{ ...inputStyle, borderColor: fieldErrors.name ? '#e08a8a' : '#f0dbd9' }}
                  placeholder="Enter your full name"
                />
                {fieldErrors.name && (
                  <p role="alert" style={{ color: '#8a2f2f', fontSize: '0.82rem', margin: '5px 0 0' }}>
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={deliveryDetails.email}
                  onChange={handleInputChange}
                  ref={(el) => { fieldRefs.current.email = el }}
                  style={{ ...inputStyle, borderColor: fieldErrors.email ? '#e08a8a' : '#f0dbd9' }}
                  placeholder="your@email.com (optional)"
                />
                {fieldErrors.email && (
                  <p role="alert" style={{ color: '#8a2f2f', fontSize: '0.82rem', margin: '5px 0 0' }}>
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Delivery Address *</label>
                <input
                  type="text"
                  name="address"
                  value={deliveryDetails.address}
                  onChange={handleInputChange}
                  ref={(el) => { fieldRefs.current.address = el }}
                  style={{ ...inputStyle, borderColor: fieldErrors.address ? '#e08a8a' : '#f0dbd9' }}
                  placeholder="House #, Street, Area"
                />
                {fieldErrors.address && (
                  <p role="alert" style={{ color: '#8a2f2f', fontSize: '0.82rem', margin: '5px 0 0' }}>
                    {fieldErrors.address}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>City *</label>
                <input
                  type="text"
                  name="city"
                  value={deliveryDetails.city}
                  onChange={handleInputChange}
                  ref={(el) => { fieldRefs.current.city = el }}
                  style={{ ...inputStyle, borderColor: fieldErrors.city ? '#e08a8a' : '#f0dbd9' }}
                  placeholder="Enter your city"
                />
                {fieldErrors.city && (
                  <p role="alert" style={{ color: '#8a2f2f', fontSize: '0.82rem', margin: '5px 0 0' }}>
                    {fieldErrors.city}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={deliveryDetails.phone}
                  onChange={handleInputChange}
                  ref={(el) => { fieldRefs.current.phone = el }}
                  style={{ ...inputStyle, borderColor: fieldErrors.phone ? '#e08a8a' : '#f0dbd9' }}
                  placeholder="03XX-XXXXXXX"
                />
                {fieldErrors.phone && (
                  <p role="alert" style={{ color: '#8a2f2f', fontSize: '0.82rem', margin: '5px 0 0' }}>
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={labelStyle}>Special Instructions</label>
                <textarea
                  name="instructions"
                  value={deliveryDetails.instructions}
                  onChange={handleInputChange}
                  rows="3"
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="Any special delivery instructions..."
                />
              </div>

              <button
                type="submit"
                disabled={items.length === 0 || submitting}
                className="btn-solid-pink"
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '60px',
                  border: 'none',
                  background: items.length === 0 || submitting ? '#e8d4d2' : '#d49b9f',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  cursor: items.length === 0 || submitting ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {submitting ? 'Placing order...' : 'Place Order (Cash on Delivery)'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />

      <style jsx global>{`
        .btn-solid-pink:hover:not(:disabled) {
          background: #a34d54 !important;
          color: white !important;
        }
        .btn-ghost-pink:hover {
          color: #a34d54 !important;
          border-color: #a34d54 !important;
        }
        .qty-btn:hover {
          border-color: #a34d54 !important;
          color: #a34d54 !important;
        }
        @media (max-width: 900px) {
          .cart-layout {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
        }
      `}</style>
    </div>
  )
}

const labelStyle = {
  display: 'block',
  color: '#3d2c2a',
  fontWeight: '500',
  marginBottom: '5px',
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '16px',
  border: '1px solid #f0dbd9',
  fontFamily: 'inherit',
  fontSize: '1rem',
  background: '#fef9f7',
}

const qtyButtonStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  border: '1px solid #f0dbd9',
  background: 'white',
  cursor: 'pointer',
  fontFamily: 'inherit',
}
