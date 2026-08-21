'use client'

import Navbar from './Navbar'
import Footer from './Footer'
import ProductGrid from './ProductGrid'

export default function CategoryPage({ title, subtitle, products }) {
  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 16px' }}>
        <div
          style={{
            padding: '30px 0 25px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '50px',
              height: '2px',
              background: 'linear-gradient(to right, #f5c6cb, #d49b9f)',
              margin: '0 auto 15px',
              borderRadius: '2px',
            }}
          />
          <h1
            style={{
              fontSize: '2.5rem',
              color: '#3d2c2a',
              fontWeight: '300',
              letterSpacing: '2px',
              marginBottom: '8px',
            }}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #d49b9f, #f5c6cb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '600',
              }}
            >
              {title}
            </span>
          </h1>
          <p
            style={{
              color: '#5f4a47',
              fontSize: '0.95rem',
              fontWeight: '300',
              letterSpacing: '1px',
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            {subtitle}
          </p>
          <div
            style={{
              width: '50px',
              height: '2px',
              background: 'linear-gradient(to right, #d49b9f, #f5c6cb)',
              margin: '15px auto 0',
              borderRadius: '2px',
            }}
          />
        </div>

        <ProductGrid products={products} gridClassName="category-grid" />
      </main>
      <Footer />

      <style jsx global>{`
        .category-grid {
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 12px !important;
        }

        @media (min-width: 600px) {
          .category-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 16px !important;
          }
        }

        @media (min-width: 992px) {
          .category-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 25px !important;
          }
        }

        @media (min-width: 1200px) {
          .category-grid {
            gap: 30px !important;
          }
        }
      `}</style>
    </div>
  )
}
