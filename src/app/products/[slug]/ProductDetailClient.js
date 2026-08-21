'use client'

import Link from 'next/link'
import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ProductCard from '../../components/ProductCard'
import { getCategoryMeta, getCategoryPath } from '../../../lib/categories.js'
import { useCart } from '../../context/CartContext'

export default function ProductDetailClient({ product, relatedProducts }) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const categoryMeta = getCategoryMeta(product.category)

  const handleAddToCart = () => {
    addItem(product, quantity)
  }

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px 48px' }}>
        <nav aria-label="Breadcrumb" style={{ marginBottom: '24px', fontSize: '0.85rem' }}>
          <Link href="/" style={{ color: '#5f4a47', textDecoration: 'none' }}>
            Home
          </Link>
          <span style={{ color: '#b58d8a', margin: '0 8px' }}>/</span>
          <Link
            href={getCategoryPath(product.category)}
            style={{ color: '#5f4a47', textDecoration: 'none' }}
          >
            {categoryMeta.label}
          </Link>
          <span style={{ color: '#b58d8a', margin: '0 8px' }}>/</span>
          <span style={{ color: '#3d2c2a' }}>{product.name}</span>
        </nav>

        <article
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            alignItems: 'start',
          }}
          className="product-detail-grid"
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #fef9f7, #fce4e6)',
              borderRadius: '24px',
              aspectRatio: '1/1',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {product.img ? (
              <img
                src={product.img}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ color: '#b58d8a' }}>{categoryMeta.label}</span>
            )}
          </div>

          <div>
            <p style={{ color: '#d49b9f', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>
              {categoryMeta.label}
            </p>
            <h1 style={{ fontSize: '2.2rem', color: '#3d2c2a', marginBottom: '12px', fontWeight: '600' }}>
              {product.name}
            </h1>
            <p style={{ fontSize: '1.8rem', color: '#d49b9f', fontWeight: '700', marginBottom: '16px' }}>
              Rs. {product.price.toLocaleString()}
            </p>

            <p style={{ color: '#5f4a47', lineHeight: '1.9', marginBottom: '20px' }}>{product.description}</p>

            <dl style={{ marginBottom: '24px', color: '#5f4a47', fontSize: '0.95rem' }}>
              {product.material && (
                <div style={{ marginBottom: '8px' }}>
                  <dt style={{ fontWeight: '600', display: 'inline' }}>Material: </dt>
                  <dd style={{ display: 'inline' }}>{product.material}</dd>
                </div>
              )}
              <div style={{ marginBottom: '8px' }}>
                <dt style={{ fontWeight: '600', display: 'inline' }}>Handcrafted: </dt>
                <dd style={{ display: 'inline' }}>{product.handcrafted ? 'Yes' : 'No'}</dd>
              </div>
              <div>
                <dt style={{ fontWeight: '600', display: 'inline' }}>Shipping: </dt>
                <dd style={{ display: 'inline' }}>Free nationwide · Cash on Delivery</dd>
              </div>
            </dl>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <label htmlFor="quantity" style={{ fontWeight: '600', color: '#3d2c2a' }}>
                Quantity
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={qtyButtonStyle}
                >
                  −
                </button>
                <span id="quantity" style={{ minWidth: '24px', textAlign: 'center', fontWeight: '600' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => q + 1)}
                  style={qtyButtonStyle}
                >
                  +
                </button>
              </div>
            </div>

            <button type="button" onClick={handleAddToCart} style={addButtonStyle}>
              Add to Cart
            </button>

            <div
              style={{
                marginTop: '16px',
                background: '#fce4e6',
                padding: '12px 16px',
                borderRadius: '14px',
                fontSize: '0.85rem',
                color: '#3d2c2a',
              }}
            >
              Cash on Delivery available nationwide · Free shipping
            </div>
          </div>
        </article>

        {relatedProducts.length > 0 && (
          <section style={{ marginTop: '56px' }}>
            <h2 style={{ fontSize: '1.6rem', color: '#3d2c2a', marginBottom: '20px', fontWeight: '600' }}>
              Related <span style={{ color: '#d49b9f' }}>Pieces</span>
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
              }}
              className="related-grid"
            >
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />

      <style jsx global>{`
        @media (max-width: 768px) {
          .product-detail-grid {
            grid-template-columns: 1fr !important;
          }
          .related-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  )
}

const qtyButtonStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  border: '1px solid #f0dbd9',
  background: 'white',
  cursor: 'pointer',
  fontSize: '1.1rem',
  fontFamily: 'inherit',
}

const addButtonStyle = {
  width: '100%',
  maxWidth: '320px',
  background: '#d49b9f',
  color: 'white',
  border: 'none',
  padding: '14px 24px',
  borderRadius: '60px',
  fontWeight: '600',
  fontSize: '1rem',
  cursor: 'pointer',
  fontFamily: 'inherit',
}
