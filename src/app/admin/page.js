'use client'
import { useState } from 'react'
import { products as initialProducts } from '../data/products'

export default function AdminPage() {
  const [products, setProducts] = useState(initialProducts)

  const handleUpdateProduct = (productId, field, value) => {
    const updatedProducts = products.map(p => 
      p.id === productId ? { ...p, [field]: value } : p
    )
    setProducts(updatedProducts)
    // In a real app, you'd save this to a database
  }

  const handleAddProduct = () => {
    const newProduct = {
      id: products.length + 1,
      name: 'New Product',
      price: 1000,
      category: 'necklace',
      img: '/images/placeholder.jpg',
      description: 'Add description here'
    }
    setProducts([...products, newProduct])
    alert('New product added!')
  }

  const handleDeleteProduct = (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId))
      alert('Product deleted!')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fef9f7',
      padding: '40px 20px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '40px',
        padding: '40px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      }}>
        {/* Admin Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '2px solid #fce4e6',
        }}>
          <div>
            <h1 style={{
              color: '#3d2c2a',
              fontSize: '2rem',
              marginBottom: '5px',
            }}>
              🛠️ Admin Panel
            </h1>
            <p style={{ color: '#b58d8a' }}>
              Manage your jewelry products
            </p>
          </div>
          <button
            onClick={handleAddProduct}
            style={{
              background: '#f5c6cb',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '40px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            + Add New Product
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}>
          <div style={{
            background: '#fce4e6',
            padding: '20px',
            borderRadius: '20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '600', color: '#3d2c2a' }}>
              {products.length}
            </div>
            <div style={{ color: '#b58d8a' }}>Total Products</div>
          </div>
          <div style={{
            background: '#fce4e6',
            padding: '20px',
            borderRadius: '20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '600', color: '#3d2c2a' }}>
              {products.filter(p => p.category === 'necklace').length}
            </div>
            <div style={{ color: '#b58d8a' }}>Necklaces</div>
          </div>
          <div style={{
            background: '#fce4e6',
            padding: '20px',
            borderRadius: '20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '600', color: '#3d2c2a' }}>
              {products.filter(p => p.category === 'bracelet').length}
            </div>
            <div style={{ color: '#b58d8a' }}>Bracelets</div>
          </div>
          <div style={{
            background: '#fce4e6',
            padding: '20px',
            borderRadius: '20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '600', color: '#3d2c2a' }}>
              {products.filter(p => p.category === 'charm').length}
            </div>
            <div style={{ color: '#b58d8a' }}>Charms</div>
          </div>
        </div>

        {/* Product List */}
        <div style={{
          display: 'grid',
          gap: '20px',
        }}>
          {products.map((product) => (
            <div key={product.id} style={{
              background: '#fef9f7',
              borderRadius: '20px',
              padding: '20px',
              border: '1px solid #f0dbd9',
              display: 'grid',
              gridTemplateColumns: '100px 1fr 1fr 1fr auto',
              gap: '15px',
              alignItems: 'center',
            }}>
              {/* Product Image */}
              <div style={{
                width: '80px',
                height: '80px',
                background: '#f1e0df',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                color: '#a77a78',
                overflow: 'hidden',
              }}>
                {product.img ? (
                  <img src={product.img} alt={product.name} style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }} />
                ) : (
                  <span>📷</span>
                )}
              </div>

              {/* Product Name Input */}
              <div>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => handleUpdateProduct(product.id, 'name', e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid #eed7d6',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    fontFamily: 'inherit',
                    background: 'white',
                    fontSize: '1rem',
                  }}
                  placeholder="Product name"
                />
              </div>

              {/* Price Input */}
              <div>
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) => handleUpdateProduct(product.id, 'price', parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    border: '1px solid #eed7d6',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    fontFamily: 'inherit',
                    background: 'white',
                    fontSize: '1rem',
                  }}
                  placeholder="Price"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <select
                  value={product.category}
                  onChange={(e) => handleUpdateProduct(product.id, 'category', e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid #eed7d6',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    fontFamily: 'inherit',
                    background: 'white',
                    fontSize: '1rem',
                  }}
                >
                  <option value="necklace">Necklace</option>
                  <option value="bracelet">Bracelet</option>
                  <option value="charm">Charm</option>
                </select>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteProduct(product.id)}
                style={{
                  background: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Admin Footer */}
        <div style={{
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '2px solid #fce4e6',
          textAlign: 'center',
          color: '#b58d8a',
        }}>
          <p>🔒 Admin panel is only accessible via /admin URL</p>
          <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>
            <a href="/" style={{ color: '#d49b9f', textDecoration: 'none' }}>← Back to website</a>
          </p>
        </div>
      </div>
    </div>
  )
}