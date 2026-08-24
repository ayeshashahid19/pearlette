'use client'

import Link from 'next/link'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const detailHref = product.slug ? `/products/${product.slug}` : null

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '20px',
        padding: '14px 12px 16px',
        boxShadow: '0 4px 15px rgba(210, 160, 160, 0.08)',
        transition: '0.25s ease',
        border: '1px solid #fbeaec',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {detailHref ? (
        <Link
          href={detailHref}
          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
        >
          <ProductImage product={product} />
          <h3
            style={{
              fontWeight: '600',
              fontSize: '1rem',
              margin: '6px 0 4px',
              color: '#3d2c2a',
              lineHeight: '1.3',
            }}
          >
            {product.name}
          </h3>
        </Link>
      ) : (
        <div>
          <ProductImage product={product} />
          <h3
            style={{
              fontWeight: '600',
              fontSize: '1rem',
              margin: '6px 0 4px',
              color: '#3d2c2a',
              lineHeight: '1.3',
            }}
          >
            {product.name}
          </h3>
        </div>
      )}

      <p style={{ color: '#d49b9f', fontWeight: '600', fontSize: '1.1rem' }}>
        Rs. {Number(product.price).toLocaleString()}
      </p>

      <button
        type="button"
        className="add-to-cart-btn"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          addItem(product, 1)
        }}
        style={{
          background: '#fce4e6',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '40px',
          marginTop: '8px',
          fontWeight: '600',
          color: '#3d2c2a',
          fontFamily: 'inherit',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.9rem',
          width: '100%',
          justifyContent: 'center',
          transition: 'background 0.2s ease, color 0.2s ease',
        }}
      >
        <span aria-hidden="true">🛒</span> Add to Cart
      </button>

      <style jsx>{`
        .add-to-cart-btn:hover {
          background: #a34d54 !important;
          color: white !important;
        }
        @media (max-width: 480px) {
          div {
            padding: 12px 10px 14px !important;
          }
          h3 {
            font-size: 0.9rem !important;
          }
          p {
            font-size: 1rem !important;
          }
          button {
            font-size: 0.85rem !important;
            padding: 10px 12px !important;
          }
        }
      `}</style>
    </div>
  )
}

function ProductImage({ product }) {
  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '1/1',
        background: 'linear-gradient(135deg, #fef9f7, #fce4e6)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.8rem',
        color: '#b58d8a',
        fontWeight: '500',
        marginBottom: '10px',
        overflow: 'hidden',
      }}
    >
      {product.img ? (
        <img
          src={product.img}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span>{product.category}</span>
      )}
    </div>
  )
}
