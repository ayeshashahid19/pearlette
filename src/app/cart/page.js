'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const router = useRouter()
  const {
    items,
    isHydrated,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
    getSubtotal,
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

  const subtotal = getSubtotal()

  const handleInputChange = (e) => {
    setDeliveryDetails({
      ...deliveryDetails,
      [e.target.name]: e.target.value,
    })
    if (formError) setFormError('')
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()

    if (items.length === 0) {
      setFormError('Your cart is empty.')
      return
    }

    setSubmitting(true)
    setFormError('')

    try {
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
    } finally {
      setSubmitting(false)
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
              style={{
                background: 'transparent',
                border: '1px solid #f0dbd9',
                color: '#5f4a47',
                padding: '10px 18px',
                borderRadius: '999px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: '500',
              }}
            >
              Clear cart
            </button>
          )}
        </div>

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
                        Rs. {item.price.toLocaleString()}
                      </p>
                      <p style={{ color: '#5f4a47', fontSize: '0.85rem', margin: '4px 0 0' }}>
                        Line total: Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.name}`}
                          onClick={() => decrementItem(item.productId)}
                          style={qtyButtonStyle}
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
                          style={qtyButtonStyle}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        style={{
                          background: '#ff6b6b',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          fontSize: '0.85rem',
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
                    <span>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                    }}
                  >
                    <span style={{ color: '#3d2c2a' }}>Total</span>
                    <span style={{ color: '#d49b9f' }}>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <p style={{ color: '#5f4a47', fontSize: '0.85rem', marginTop: '10px' }}>
                    Free shipping · Cash on Delivery
                  </p>
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

            <form onSubmit={handlePlaceOrder}>
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
                  required
                  style={inputStyle}
                  placeholder="Enter your full name"
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={deliveryDetails.email}
                  onChange={handleInputChange}
                  style={inputStyle}
                  placeholder="your@email.com (optional)"
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Delivery Address *</label>
                <input
                  type="text"
                  name="address"
                  value={deliveryDetails.address}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                  placeholder="House #, Street, Area"
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>City *</label>
                <input
                  type="text"
                  name="city"
                  value={deliveryDetails.city}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                  placeholder="Enter your city"
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={deliveryDetails.phone}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                  placeholder="03XX-XXXXXXX"
                />
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
