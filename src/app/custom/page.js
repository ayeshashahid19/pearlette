'use client'
import { useState, useRef } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function CustomPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    jewelryType: 'necklace',
    description: '',
    budget: '',
    timeline: '',
    details: ''
  })

  const [inspirationImages, setInspirationImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const fileInputRef = useRef(null)
  const [submitted, setSubmitted] = useState(false)
  const [submittedRequestId, setSubmittedRequestId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (formError) setFormError('')
  }

  const validateClientImage = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return `${file.name} must be JPG, PNG, or WebP.`
    }
    if (file.size > 5 * 1024 * 1024) {
      return `${file.name} must be 5MB or smaller.`
    }
    return null
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)

    if (inspirationImages.length + files.length > 5) {
      setFormError('You can upload a maximum of 5 inspiration images.')
      return
    }

    for (const file of files) {
      const error = validateClientImage(file)
      if (error) {
        setFormError(error)
        return
      }
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setImagePreviews([...imagePreviews, ...newPreviews])
    setInspirationImages([...inspirationImages, ...files])
    setFormError('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (index) => {
    const newPreviews = [...imagePreviews]
    const newImages = [...inspirationImages]
    
    URL.revokeObjectURL(newPreviews[index])
    
    newPreviews.splice(index, 1)
    newImages.splice(index, 1)
    
    setImagePreviews(newPreviews)
    setInspirationImages(newImages)
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setFormError('')

    try {
      const body = new FormData()
      body.append('customerName', formData.name)
      body.append('customerEmail', formData.email)
      body.append('customerPhone', formData.phone)
      body.append('jewelryType', formData.jewelryType)
      body.append('description', formData.description)
      body.append('budget', formData.budget)
      body.append('timeline', formData.timeline)

      inspirationImages.forEach((file) => {
        body.append('inspirationImages', file)
      })

      const response = await fetch('/api/custom-orders', {
        method: 'POST',
        body,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit custom order request.')
      }

      setSubmittedRequestId(data.customOrder.id)
      setSubmitted(true)
    } catch (error) {
      setFormError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div>
        <Navbar />
        <div style={{
          maxWidth: '1300px',
          margin: '0 auto',
          padding: '60px 16px',
          textAlign: 'center',
        }}>
          <div style={{
            background: 'white',
            padding: '40px 20px',
            borderRadius: '32px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>✨</div>
            <h2 style={{ fontSize: '2rem', color: '#3d2c2a', marginBottom: '12px' }}>
              Thank You!
            </h2>
            <p style={{ fontSize: '1rem', color: '#5f4a47', maxWidth: '500px', margin: '0 auto', lineHeight: '1.8' }}>
              Your custom order request has been received. We will reach out within 24 hours to discuss your dream piece.
              {submittedRequestId && (
                <>
                  <br />
                  <br />
                  <strong>Request ID:</strong> {submittedRequestId}
                </>
              )}
            </p>
            <p style={{ fontSize: '0.9rem', color: '#5f4a47', maxWidth: '520px', margin: '16px auto 0', lineHeight: '1.8' }}>
              A 50% advance payment will be confirmed with you directly before crafting begins. The remaining balance can be paid via Cash on Delivery.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              style={{
                marginTop: '25px',
                background: 'linear-gradient(135deg, #d49b9f, #c4848a)',
                color: 'white',
                border: 'none',
                padding: '12px 35px',
                borderRadius: '60px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '16px',
      }}>
        {/* Mobile Info Section - Visible on phones only */}
        <div className="mobile-info" style={{
          display: 'none',
          marginBottom: '16px',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #fce4e6, #fef9f7)',
            padding: '16px',
            borderRadius: '16px',
            border: '1px solid #fce4e6',
          }}>
            <h3 style={{ 
              color: '#3d2c2a', 
              marginBottom: '8px', 
              fontWeight: '600', 
              fontSize: '0.95rem',
              textAlign: 'center',
            }}>
              How Custom Creations Works
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              color: '#5f4a47',
              lineHeight: '2.2',
              fontSize: '0.85rem',
            }}>
              <li>✧ Fill in the form with your ideas</li>
              <li>✧ Upload inspiration photos (optional)</li>
              <li>✧ We will review and reach out within 24 hours</li>
              <li>✧ We will discuss design, materials, and pricing</li>
              <li>✧ 50% advance payment required to start crafting</li>
              <li>✧ We will handcraft your unique piece</li>
              <li>✧ Delivery with Cash on Delivery for remaining amount</li>
            </ul>
          </div>

          <div style={{
            background: 'white',
            padding: '12px',
            borderRadius: '12px',
            border: '2px solid #d49b9f',
            marginTop: '10px',
          }}>
            <h4 style={{ 
              color: '#3d2c2a', 
              marginBottom: '6px',
              fontSize: '0.9rem',
              fontWeight: '600',
              textAlign: 'center',
            }}>
              Payment Information
            </h4>
            <p style={{ 
              color: '#5f4a47', 
              fontSize: '0.8rem',
              lineHeight: '1.6',
              textAlign: 'center',
            }}>
              50% advance payment required before crafting. Remaining 50% via Cash on Delivery.
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid #fce4e6',
            marginTop: '10px',
          }}>
            <p style={{ color: '#5f4a47', fontSize: '0.8rem', lineHeight: '1.8', textAlign: 'center' }}>
              <span style={{ fontWeight: '600' }}>Delivery:</span> Cash on Delivery nationwide<br />
              <span style={{ fontWeight: '600' }}>Timeline:</span> 7-14 days for custom pieces
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
        }} className="custom-grid">
          
          {/* Left Column - Full Info (Visible on desktop AND mobile) */}
          <div className="desktop-info">
            <div style={{
              width: '60px',
              height: '3px',
              background: 'linear-gradient(to right, #f5c6cb, #d49b9f)',
              marginBottom: '15px',
              borderRadius: '2px',
            }} />
            <h1 style={{
              fontSize: '2.5rem',
              color: '#3d2c2a',
              fontWeight: '300',
              letterSpacing: '1px',
              marginBottom: '8px',
            }}>
              <span style={{ 
                background: 'linear-gradient(135deg, #d49b9f, #f5c6cb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '600',
              }}>
                Custom Creations
              </span>
            </h1>
            <p style={{
              fontSize: '0.95rem',
              color: '#5f4a47',
              fontWeight: '300',
              letterSpacing: '1px',
              marginBottom: '20px',
            }}>
              Tell Me What You Want
            </p>
            <div style={{
              width: '60px',
              height: '3px',
              background: 'linear-gradient(to right, #d49b9f, #f5c6cb)',
              marginBottom: '20px',
              borderRadius: '2px',
            }} />
            
            <p style={{
              fontSize: '0.95rem',
              color: '#5f4a47',
              lineHeight: '1.8',
              marginBottom: '20px',
            }}>
              Every piece of jewelry tells a story. Whether you want a custom necklace 
              for a special occasion, a personalized bracelet for a loved one, or a 
              unique charm that captures a memory — I am here to bring your vision to life.
            </p>

            {/* How It Works - Full Version (Desktop) */}
            <div style={{
              background: 'linear-gradient(135deg, #fce4e6, #fef9f7)',
              padding: '20px',
              borderRadius: '16px',
              marginBottom: '15px',
              border: '1px solid #fce4e6',
            }}>
              <h3 style={{ color: '#3d2c2a', marginBottom: '12px', fontWeight: '600', fontSize: '1rem' }}>
                How It Works
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                color: '#5f4a47',
                lineHeight: '2.5',
                fontSize: '0.9rem',
              }}>
                <li>✧ Fill in the form with your ideas</li>
                <li>✧ Upload inspiration photos (optional)</li>
                <li>✧ We will review and reach out within 24 hours</li>
                <li>✧ We will discuss design, materials, and pricing</li>
                <li>✧ 50% advance payment required to start crafting</li>
                <li>✧ We will handcraft your unique piece</li>
                <li>✧ Delivery with Cash on Delivery for remaining amount</li>
              </ul>
            </div>

            {/* Payment Information - Full Version (Desktop) */}
            <div style={{
              background: 'white',
              padding: '16px',
              borderRadius: '14px',
              border: '2px solid #d49b9f',
              marginBottom: '15px',
            }}>
              <h4 style={{ 
                color: '#3d2c2a', 
                marginBottom: '8px',
                fontSize: '1rem',
                fontWeight: '600',
              }}>
                Payment Information
              </h4>
              <p style={{ 
                color: '#5f4a47', 
                fontSize: '0.85rem',
                lineHeight: '1.8',
              }}>
                For custom orders, we require a 50% advance payment before starting the crafting process. 
                The remaining 50% can be paid via Cash on Delivery when you receive your finished piece.
              </p>
            </div>

            {/* Delivery & Timeline - Desktop */}
            <div style={{
              background: 'white',
              padding: '16px',
              borderRadius: '14px',
              border: '1px solid #fce4e6',
            }}>
              <p style={{ color: '#5f4a47', fontSize: '0.85rem', lineHeight: '2' }}>
                <span style={{ fontWeight: '600' }}>Delivery:</span> Cash on Delivery available nationwide.
                <br />
                <span style={{ fontWeight: '600' }}>Timeline:</span> Custom pieces typically take 7-14 days.
                <br />
                <span style={{ fontWeight: '600' }}>Quality:</span> Premium materials, handcrafted with love.
              </p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div style={{
            background: 'white',
            padding: '24px 20px',
            borderRadius: '24px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            border: '1px solid #fce4e6',
            width: '100%',
          }}>
            <h2 style={{
              fontSize: '1.3rem',
              color: '#3d2c2a',
              marginBottom: '20px',
              fontWeight: '600',
              textAlign: 'center',
            }}>
              Custom Order Form
            </h2>
            
            <form onSubmit={handleSubmit}>
              {formError && (
                <div
                  role="alert"
                  style={{
                    background: '#fff0f0',
                    border: '1px solid #ffb3b3',
                    color: '#8a2f2f',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    marginBottom: '14px',
                    fontSize: '0.85rem',
                  }}
                >
                  {formError}
                </div>
              )}

              <div style={{ marginBottom: '14px' }}>
                <label style={{
                  display: 'block',
                  color: '#3d2c2a',
                  fontWeight: '500',
                  marginBottom: '4px',
                  fontSize: '0.85rem',
                }}>Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid #f0dbd9',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    background: '#fef9f7',
                    transition: '0.3s',
                  }}
                  placeholder="Enter your name"
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{
                  display: 'block',
                  color: '#3d2c2a',
                  fontWeight: '500',
                  marginBottom: '4px',
                  fontSize: '0.85rem',
                }}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid #f0dbd9',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    background: '#fef9f7',
                    transition: '0.3s',
                  }}
                  placeholder="your@email.com"
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{
                  display: 'block',
                  color: '#3d2c2a',
                  fontWeight: '500',
                  marginBottom: '4px',
                  fontSize: '0.85rem',
                }}>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid #f0dbd9',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    background: '#fef9f7',
                    transition: '0.3s',
                  }}
                  placeholder="03XX-XXXXXXX"
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{
                  display: 'block',
                  color: '#3d2c2a',
                  fontWeight: '500',
                  marginBottom: '4px',
                  fontSize: '0.85rem',
                }}>Type of Jewelry *</label>
                <select
                  name="jewelryType"
                  value={formData.jewelryType}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid #f0dbd9',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    background: '#fef9f7',
                    transition: '0.3s',
                  }}
                >
                  <option value="necklace">Necklace</option>
                  <option value="bracelet">Bracelet</option>
                  <option value="earrings">Earrings</option>
                  <option value="ring">Ring</option>
                  <option value="armcuff">Arm Cuff</option>
                  <option value="charm">Charm</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{
                  display: 'block',
                  color: '#3d2c2a',
                  fontWeight: '500',
                  marginBottom: '4px',
                  fontSize: '0.85rem',
                }}>Describe Your Vision *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid #f0dbd9',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    background: '#fef9f7',
                    resize: 'vertical',
                    transition: '0.3s',
                  }}
                  placeholder="Tell me what you want! Describe the design, colors, stones, occasion..."
                />
              </div>

              {/* Inspiration Image Upload */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{
                  display: 'block',
                  color: '#3d2c2a',
                  fontWeight: '500',
                  marginBottom: '4px',
                  fontSize: '0.85rem',
                }}>
                  Upload Inspiration Photos (Optional)
                </label>
                <p style={{
                  color: '#b58d8a',
                  fontSize: '0.75rem',
                  marginBottom: '8px',
                }}>
                  Upload up to 5 images that inspire your custom design
                </p>
                
                <div
                  style={{
                    border: '2px dashed #f0dbd9',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: '0.3s',
                    background: '#fef9f7',
                  }}
                  onClick={() => fileInputRef.current.click()}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '4px' }}>📷</div>
                  <p style={{ color: '#5f4a47', fontSize: '0.85rem' }}>
                    Click to upload inspiration images
                  </p>
                  <p style={{ color: '#b58d8a', fontSize: '0.75rem' }}>
                    JPG, PNG, WebP accepted
                  </p>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />

                {imagePreviews.length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(65px, 1fr))',
                    gap: '8px',
                    marginTop: '10px',
                  }}>
                    {imagePreviews.map((preview, index) => (
                      <div key={index} style={{
                        position: 'relative',
                        aspectRatio: '1/1',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: '2px solid #fce4e6',
                      }}>
                        <img 
                          src={preview} 
                          alt={`Inspiration ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          style={{
                            position: 'absolute',
                            top: '2px',
                            right: '2px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: 'none',
                            background: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p style={{
                  color: '#b58d8a',
                  fontSize: '0.75rem',
                  marginTop: '6px',
                }}>
                  {imagePreviews.length} of 5 images uploaded
                </p>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{
                  display: 'block',
                  color: '#3d2c2a',
                  fontWeight: '500',
                  marginBottom: '4px',
                  fontSize: '0.85rem',
                }}>Budget Range (PKR)</label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid #f0dbd9',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    background: '#fef9f7',
                    transition: '0.3s',
                  }}
                >
                  <option value="">Select budget range</option>
                  <option value="100-500">Rs. 100 - 500</option>
                  <option value="500-1000">Rs. 500 - 1,000</option>
                  <option value="1000-3000">Rs. 1,000 - 3,000</option>
                  <option value="3000-5000">Rs. 3,000 - 5,000</option>
                  <option value="5000-10000">Rs. 5,000 - 10,000</option>
                  <option value="10000+">Rs. 10,000+</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  color: '#3d2c2a',
                  fontWeight: '500',
                  marginBottom: '4px',
                  fontSize: '0.85rem',
                }}>When do you need it?</label>
                <input
                  type="text"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid #f0dbd9',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    background: '#fef9f7',
                    transition: '0.3s',
                  }}
                  placeholder="e.g., 2 weeks, next month, for a wedding..."
                />
              </div>

              {/* Payment Notice */}
              <div style={{
                background: '#fce4e6',
                padding: '10px',
                borderRadius: '10px',
                marginBottom: '16px',
                border: '1px solid #f5c6cb',
              }}>
                <p style={{
                  color: '#3d2c2a',
                  fontSize: '0.8rem',
                  lineHeight: '1.5',
                  margin: 0,
                }}>
                  <strong>Note:</strong> For custom orders, a 50% advance payment is required 
                  before we start crafting your piece. The remaining 50% can be paid via 
                  Cash on Delivery upon delivery.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '60px',
                  border: 'none',
                  background: submitting
                    ? '#d9b3b6'
                    : 'linear-gradient(135deg, #d49b9f, #c4848a)',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: '0.3s',
                  boxShadow: '0 4px 15px rgba(212, 155, 159, 0.3)',
                }}
              >
                {submitting ? 'Submitting request...' : 'Submit Custom Request'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Desktop: Show full info on left, hide mobile info */
        @media (min-width: 768px) {
          .custom-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 40px !important;
          }
          .desktop-info {
            display: block !important;
          }
          .mobile-info {
            display: none !important;
          }
        }

        /* Mobile: Hide desktop info (left column), show mobile info at top */
        @media (max-width: 767px) {
          .custom-grid {
            grid-template-columns: 1fr !important;
            gap: 0px !important;
          }
          .desktop-info {
            display: none !important;
          }
          .mobile-info {
            display: block !important;
          }
        }
      `}</style>
      <Footer />
    </div>
  )
}