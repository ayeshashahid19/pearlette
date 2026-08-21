'use client'

import ProductCard from './ProductCard'

export default function ProductGrid({
  products,
  gridClassName = 'product-grid',
  emptyMessage = 'No products found.',
}) {
  if (!products?.length) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'white',
          borderRadius: '24px',
          color: '#5f4a47',
        }}
      >
        <p style={{ fontSize: '1.1rem' }}>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        margin: '20px 0 40px',
      }}
      className={gridClassName}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
