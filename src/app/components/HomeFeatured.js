'use client'

import ProductGrid from './ProductGrid'

export default function HomeFeatured({ products }) {
  return (
    <section
      style={{
        padding: '30px 16px',
        maxWidth: '1300px',
        margin: '0 auto',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', color: '#3d2c2a', fontWeight: '600' }}>
          Most Beloved <span style={{ color: '#d49b9f' }}>Pieces</span>
        </h2>
        <p style={{ color: '#5f4a47', fontSize: '0.95rem', marginTop: '8px' }}>
          Each piece tells a story of craftsmanship and love
        </p>
      </div>

      <ProductGrid
        products={products}
        gridClassName="product-grid"
        emptyMessage="Featured products will appear here soon."
      />

      <style jsx global>{`
        .product-grid {
          grid-template-columns: repeat(3, 1fr) !important;
          gap: 20px !important;
        }

        @media (max-width: 600px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </section>
  )
}
