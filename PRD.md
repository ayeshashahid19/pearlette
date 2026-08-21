# Product Requirements Document (PRD)
## Pearlette.pk — Premium Handmade Jewelry E-Commerce Platform

| Field | Value |
|-------|-------|
| **Product Name** | Pearlette.pk |
| **Document Version** | 1.0 |
| **Date** | August 21, 2026 |
| **Status** | In Development (MVP Frontend Complete, Backend Partial) |
| **Domain** | pearlette.pk |

---

## 1. Executive Summary

Pearlette.pk is a Pakistan-focused e-commerce website for a boutique handmade jewelry brand. The platform enables customers to browse handcrafted jewelry collections, add items to cart, place Cash on Delivery (COD) orders, and submit custom jewelry requests. The brand emphasizes craftsmanship, personalization, and a warm, feminine aesthetic.

The project is built with **Next.js 16**, **React 19**, and **Prisma 7** (PostgreSQL). The customer-facing UI is largely implemented with static product data. Database schema, admin authentication seeding, and backend API routes are planned but not yet fully integrated.

---

## 2. Problem Statement

Small handmade jewelry businesses in Pakistan often rely on Instagram DMs and manual order tracking, which limits scalability, creates inconsistent customer experience, and makes inventory/order management difficult.

Pearlette.pk addresses this by providing:
- A professional, mobile-first storefront
- Structured product catalog by category
- A formal checkout flow with COD
- A dedicated custom order intake system
- (Planned) Admin tools for product and order management

---

## 3. Product Vision & Goals

### Vision
Become the go-to online destination for premium, handcrafted jewelry in Pakistan — combining artisan storytelling with a seamless shopping experience.

### Business Goals
| Goal | Description |
|------|-------------|
| **Increase sales reach** | Expand beyond Instagram to a owned web channel |
| **Reduce manual friction** | Standardize orders via forms instead of unstructured DMs |
| **Build brand trust** | Professional site with clear pricing, story, and COD assurance |
| **Enable custom revenue** | Capture high-margin custom jewelry requests with structured intake |
| **Operational efficiency** | (Future) Centralized admin for products, orders, and custom requests |

### Success Metrics (KPIs)
| Metric | Target (6 months post-launch) |
|--------|-------------------------------|
| Monthly unique visitors | 5,000+ |
| Conversion rate (visit → order) | 2–4% |
| Custom order submissions/month | 20+ |
| Average order value (PKR) | Rs. 3,000+ |
| Cart abandonment rate | < 70% |
| Mobile traffic share | > 65% |
| Order fulfillment time (standard) | 3–5 business days |
| Custom order response time | < 24 hours |

---

## 4. Target Users & Personas

### Persona 1: Sarah — The Gift Buyer
- **Age:** 22–35
- **Location:** Urban Pakistan (Lahore, Karachi, Islamabad)
- **Behavior:** Discovers brands on Instagram; prefers COD; shops on mobile
- **Needs:** Beautiful products, clear pricing, easy checkout, gift-worthy packaging messaging
- **Pain points:** Hesitant to pay online; wants trust signals before ordering

### Persona 2: Ayesha — The Custom Client
- **Age:** 25–40
- **Behavior:** Has a specific design in mind (wedding, anniversary, personal milestone)
- **Needs:** Easy way to describe vision, upload inspiration photos, understand pricing/timeline
- **Pain points:** Unclear process and payment expectations for bespoke work

### Persona 3: Admin (Brand Owner)
- **Role:** Pearlette founder/operator
- **Needs:** Manage product catalog, view/process orders, track custom requests, update prices
- **Pain points:** Currently no persistent backend; changes are lost on refresh

---

## 5. Current State Analysis

### 5.1 What Is Built (Implemented)

| Area | Status | Notes |
|------|--------|-------|
| Homepage | ✅ Complete | Hero, brand story, featured products (6 items), custom CTA |
| Category pages | ✅ Complete | Necklace, Bracelets, Earrings, Rings, Arm Cuffs, Charms |
| Product cards & modal | ✅ Complete | Click-to-view details, add to cart |
| Navigation | ✅ Complete | Sticky navbar, mobile hamburger menu, cart link |
| Footer | ✅ Complete | Links, contact, Instagram, COD badge |
| Custom order page | ✅ Complete | Full form, image upload (client-side), success state |
| Cart page | ⚠️ Partial | UI complete; uses hardcoded sample data |
| Admin panel | ⚠️ Partial | CRUD UI in local state only; no auth |
| Responsive design | ✅ Complete | Mobile-first breakpoints across pages |
| Animated background | ✅ Complete | Floating emoji particles sitewide |
| Product catalog data | ⚠️ Static | 13 products in `src/app/data/products.js` |
| Database schema | ✅ Defined | Prisma models for Product, Order, CustomOrder, Admin |
| Database integration | ❌ Not wired | No API routes; frontend doesn't use Prisma |
| Authentication | ❌ Not wired | bcrypt/JWT deps installed; seed creates admin only |
| Payment gateway | ❌ N/A | COD-only by design |
| Image storage | ❌ Not implemented | Placeholder images; custom uploads not persisted |

### 5.2 Known Gaps & Technical Debt

1. **No shared cart state** — Cart on homepage/category pages is local; Navbar cart count is always 0; cart page has separate hardcoded items
2. **No API layer** — Zero `/api` routes exist
3. **Admin is unsecured** — Accessible at `/admin` with no login
4. **Product data duplication** — Static JS file vs. Prisma `Product` model
5. **Custom order images** — Uploaded client-side only; not sent to server
6. **Admin category dropdown incomplete** — Missing earrings, rings, armcuff options
7. **Placeholder media** — Hero/story videos use external w3schools sample MP4

---

## 6. Feature Requirements

### 6.1 Customer-Facing Features

#### F1: Homepage
| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| F1.1 | Hero section with brand tagline and dual CTAs (Explore Collection, Custom Order) | P0 | ✅ Done |
| F1.2 | Brand story section with video + narrative copy | P0 | ✅ Done |
| F1.3 | Featured collection grid (6 products, 3×2 layout) | P0 | ✅ Done |
| F1.4 | Custom creations CTA section | P1 | ✅ Done |
| F1.5 | Product detail modal with image, price, description, add to cart | P0 | ✅ Done |
| F1.6 | Replace placeholder videos with brand-owned media | P2 | ❌ Pending |

#### F2: Product Catalog & Category Browsing
| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| F2.1 | Six category pages: Necklace, Bracelets, Earrings, Rings, Arm Cuffs, Charms | P0 | ✅ Done |
| F2.2 | Filter products by category | P0 | ✅ Done (static) |
| F2.3 | Responsive product grid (2/3/4 columns by breakpoint) | P0 | ✅ Done |
| F2.4 | Product fields: name, price (PKR), category, image, description | P0 | ✅ Done |
| F2.5 | Fetch products from database API | P0 | ❌ Pending |
| F2.6 | Product search/filter (price range, material) | P2 | ❌ Pending |
| F2.7 | Individual product detail pages (`/products/[id]`) | P2 | ❌ Pending |

#### F3: Shopping Cart
| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| F3.1 | Add product to cart from card or modal | P0 | ⚠️ Partial (local state only) |
| F3.2 | Persistent cart across pages (Context/localStorage) | P0 | ❌ Pending |
| F3.3 | Navbar cart count reflects actual items | P0 | ❌ Pending |
| F3.4 | View cart items with name, price, quantity | P0 | ⚠️ Partial |
| F3.5 | Update quantity / remove items | P1 | ❌ Pending |
| F3.6 | Display order total in PKR | P0 | ✅ Done |

#### F4: Checkout & Orders (Cash on Delivery)
| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| F4.1 | Delivery form: name*, address*, city*, phone*, instructions | P0 | ✅ Done (UI) |
| F4.2 | Payment method fixed to Cash on Delivery | P0 | ✅ Done |
| F4.3 | Submit order to backend and persist in database | P0 | ❌ Pending |
| F4.4 | Order confirmation page/email/SMS | P1 | ❌ Pending |
| F4.5 | Order status tracking for customer | P2 | ❌ Pending |

**Delivery form fields (from schema):**
- `customerName` (required)
- `customerPhone` (required)
- `customerAddress` (required)
- `customerCity` (required)
- `customerEmail` (optional)
- `customerInstructions` (optional)

#### F5: Custom Order Requests
| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| F5.1 | Custom order form with contact info | P0 | ✅ Done |
| F5.2 | Jewelry type selector (necklace, bracelet, earrings, ring, arm cuff, charm, other) | P0 | ✅ Done |
| F5.3 | Vision description (required textarea) | P0 | ✅ Done |
| F5.4 | Budget range selector (PKR tiers) | P1 | ✅ Done |
| F5.5 | Timeline/deadline field | P1 | ✅ Done |
| F5.6 | Inspiration image upload (max 5, JPG/PNG/WebP) | P1 | ⚠️ Client-side only |
| F5.7 | Persist custom order to database | P0 | ❌ Pending |
| F5.8 | Upload inspiration images to cloud storage | P1 | ❌ Pending |
| F5.9 | Admin notification on new custom request | P1 | ❌ Pending |
| F5.10 | Success confirmation with 24-hour response promise | P0 | ✅ Done |

**Custom order business rules:**
- 50% advance payment required before crafting begins
- Remaining 50% via COD on delivery
- Typical turnaround: 7–14 days

#### F6: Site Navigation & Layout
| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| F6.1 | Sticky navbar with logo (Pearlette.pk) | P0 | ✅ Done |
| F6.2 | Desktop + mobile navigation (hamburger ≤768px) | P0 | ✅ Done |
| F6.3 | Footer with quick links, contact, Instagram, COD info | P0 | ✅ Done |
| F6.4 | Sitewide animated background | P2 | ✅ Done |
| F6.5 | SEO metadata (title, description) | P1 | ⚠️ Basic only |

---

### 6.2 Admin Features

#### F7: Admin Authentication
| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| F7.1 | Admin login page with email/password | P0 | ❌ Pending |
| F7.2 | JWT-based session management | P0 | ❌ Pending |
| F7.3 | Protect `/admin` routes behind auth middleware | P0 | ❌ Pending |
| F7.4 | Seed default admin (`admin@pearlette.pk`) | P0 | ✅ Done (seed script) |

#### F8: Product Management
| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| F8.1 | List all products with inline edit (name, price, category) | P0 | ⚠️ UI only |
| F8.2 | Add new product | P0 | ⚠️ UI only |
| F8.3 | Delete product with confirmation | P0 | ⚠️ UI only |
| F8.4 | Dashboard stats (total products, per-category counts) | P1 | ⚠️ UI only |
| F8.5 | Persist changes to PostgreSQL via API | P0 | ❌ Pending |
| F8.6 | Image upload for products | P1 | ❌ Pending |
| F8.7 | Edit description, material, handcrafted flag | P1 | ❌ Pending |
| F8.8 | Support all 6 product categories in admin dropdown | P1 | ❌ Pending |

#### F9: Order Management (Planned)
| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| F9.1 | View all orders with status filter | P0 | ❌ Pending |
| F9.2 | Update order status (pending → confirmed → shipped → delivered) | P0 | ❌ Pending |
| F9.3 | View order details and line items | P0 | ❌ Pending |
| F9.4 | View/manage custom order requests | P0 | ❌ Pending |
| F9.5 | Update custom order status | P1 | ❌ Pending |

---

## 7. User Stories

### Customer Stories
| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | Visitor | See a beautiful homepage that tells the brand story | I trust the quality before browsing |
| US-02 | Shopper | Browse jewelry by category | I can quickly find what I need |
| US-03 | Shopper | View product details and price in PKR | I can make an informed purchase |
| US-04 | Shopper | Add items to a cart that persists | I can shop across multiple pages |
| US-05 | Shopper | Checkout with COD and my delivery address | I can order without online payment |
| US-06 | Custom client | Submit my design idea with photos | The artisan understands my vision |
| US-07 | Mobile user | Use the site comfortably on my phone | I can shop on the go |
| US-08 | Shopper | See COD and free shipping messaging | I feel confident about delivery |

### Admin Stories
| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-09 | Admin | Log in securely | Only I can manage the store |
| US-10 | Admin | Add/edit/delete products | My catalog stays current |
| US-11 | Admin | View incoming orders | I can fulfill them promptly |
| US-12 | Admin | Review custom order requests | I can follow up within 24 hours |

---

## 8. Information Architecture

```
pearlette.pk/
├── /                          → Homepage
├── /necklace                  → Necklace category
├── /bracelets                 → Bracelet category
├── /earrings                  → Earrings category
├── /rings                     → Rings category
├── /armcuffs                  → Arm cuffs category
├── /charms                    → Charms category
├── /custom                    → Custom order form
├── /cart                      → Cart & checkout
├── /admin                     → Admin panel (protected)
└── /admin/login               → Admin login (planned)

API (planned):
├── POST   /api/orders
├── GET    /api/products
├── POST   /api/products
├── PUT    /api/products/[id]
├── DELETE /api/products/[id]
├── POST   /api/custom-orders
├── POST   /api/auth/login
└── GET    /api/admin/orders
```

---

## 9. Data Model

Based on `prisma/schema.prisma`:

### Product
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | Primary key |
| name | String | Product name |
| price | Float | Price in PKR |
| category | String | necklace, bracelet, earrings, ring, armcuff, charm |
| img | String | Image URL/path |
| description | String | Product description |
| handcrafted | Boolean | Default: true |
| material | String? | Optional (e.g., gold-plated, pearl) |
| createdAt / updatedAt | DateTime | Timestamps |

### Order
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | Primary key |
| total | Float | Order total PKR |
| customerName | String | Required |
| customerEmail | String? | Optional |
| customerPhone | String | Required |
| customerAddress | String | Required |
| customerCity | String | Required |
| customerInstructions | String? | Optional |
| status | String | Default: "pending" |
| paymentMethod | String | Default: "Cash on Delivery" |
| items | OrderItem[] | Relation |
| createdAt | DateTime | Order timestamp |

### OrderItem
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | Primary key |
| orderId | String | FK → Order |
| productId | String | FK → Product |
| name | String | Snapshot at order time |
| price | Float | Snapshot at order time |
| quantity | Int | Item quantity |

### CustomOrder
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | Primary key |
| customerName | String | Required |
| customerEmail | String? | Optional |
| customerPhone | String | Required |
| jewelryType | String | Category selection |
| description | String | Vision description |
| budget | String? | Budget range |
| timeline | String? | Desired deadline |
| inspirationImages | String[] | Image URLs |
| status | String | Default: "pending" |
| createdAt | DateTime | Submission timestamp |

### Admin
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | Primary key |
| email | String | Unique |
| password | String | bcrypt hashed |
| createdAt | DateTime | Account creation |

---

## 10. Technical Architecture

### 10.1 Stack
| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.3 (App Router) |
| UI Library | React 19.2 |
| Language | JavaScript (no TypeScript in app code) |
| Styling | Inline styles + styled-jsx + globals.css |
| Icons | Lucide React, React Icons |
| Font | Quicksand (Google Fonts) |
| ORM | Prisma 7.9 |
| Database | PostgreSQL |
| Auth (planned) | bcryptjs + jsonwebtoken |
| Config | dotenv, prisma.config.ts |

### 10.2 Project Structure
```
pearlette-website/
├── prisma/
│   ├── schema.prisma       # Database models
│   └── seed.js             # Admin seed data
├── prisma.config.ts        # Prisma 7 config (DATABASE_URL)
├── src/app/
│   ├── page.js             # Homepage
│   ├── layout.js           # Root layout + font + background
│   ├── globals.css         # Design tokens & responsive utilities
│   ├── data/products.js    # Static product catalog (13 items)
│   ├── components/         # Navbar, Footer, ProductCard, backgrounds
│   ├── [category]/page.js  # Category listing pages
│   ├── cart/page.js        # Cart & checkout
│   ├── custom/page.js      # Custom order form
│   └── admin/page.js       # Admin panel
└── public/                 # Static assets
```

### 10.3 Environment Variables (Required)
| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |

### 10.4 Deployment Considerations
- **Recommended host:** Vercel (Next.js native)
- **Database:** Prisma Postgres, Neon, Supabase, or Railway PostgreSQL
- **Image storage (future):** Cloudinary, AWS S3, or Vercel Blob
- **Domain:** pearlette.pk

---

## 11. Design System

### 11.1 Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `--pink` | `#f5c6cb` | Accents, gradients |
| `--pink-light` | `#fce4e6` | Backgrounds, badges |
| `--pink-dark` | `#d49b9f` | Primary CTA, prices, links |
| Background | `#fef9f7` | Page background |
| Text primary | `#3d2c2a` | Headings, body |
| Text secondary | `#5f4a47` | Descriptions |
| Text muted | `#b58d8a` | Placeholders, footer |

### 11.2 Typography
- **Font family:** Quicksand (300–700 weights)
- **Heading style:** Light weight with gradient accent spans
- **Body:** 0.85rem–1.05rem, line-height 1.6–2.0

### 11.3 UI Patterns
- Rounded corners (16px–60px pill buttons)
- Soft box shadows with pink tint
- Gradient backgrounds (`#fce4e6` → `#fef9f7`)
- Modal overlays with backdrop blur
- Responsive grids with breakpoint-specific column counts

### 11.4 Breakpoints
| Breakpoint | Behavior |
|------------|----------|
| ≤360px | Single-column footer, compact nav |
| ≤480px | 2-column product grids, smaller typography |
| ≤768px | Mobile hamburger menu, stacked layouts |
| 769–1024px | Tablet nav (compact links) |
| ≥1025px | Full desktop navigation |

---

## 12. Product Catalog (Current)

| # | Product | Category | Price (PKR) |
|---|---------|----------|-------------|
| 1 | Pearl Drop Necklace | Necklace | 4,500 |
| 2 | Gold Chain Necklace | Necklace | 3,800 |
| 3 | Gold Chain Bracelet | Bracelet | 3,200 |
| 4 | Beaded Stretch Bracelet | Bracelet | 2,100 |
| 5 | Pearl Drop Earrings | Earrings | 2,800 |
| 6 | Gold Hoop Earrings | Earrings | 2,200 |
| 7 | Crystal Stud Earrings | Earrings | 1,800 |
| 8 | Rose Gold Ring | Ring | 2,800 |
| 9 | Diamond Halo Ring | Ring | 7,500 |
| 10 | Gold Arm Cuff | Arm Cuff | 4,200 |
| 11 | Beaded Arm Cuff | Arm Cuff | 3,500 |
| 12 | Heart Charm | Charm | 950 |
| 13 | Butterfly Charm | Charm | 850 |

**Price range:** Rs. 850 – Rs. 7,500

---

## 13. Non-Functional Requirements

### Performance
- First Contentful Paint < 2.5s on 4G mobile
- Lighthouse Performance score ≥ 80
- Optimize product images (WebP, lazy loading)

### Security
- Admin routes protected with JWT + HTTP-only cookies
- Passwords hashed with bcrypt (cost factor 10)
- Input validation on all forms (server-side)
- Rate limiting on order/custom submission endpoints
- No secrets in client-side code

### Accessibility
- Semantic HTML landmarks
- Aria labels on mobile menu toggle
- Sufficient color contrast on text
- Keyboard-navigable modals and forms

### Reliability
- Database backups (daily)
- Graceful error handling on API failures
- Order submission must be idempotent or confirmable

### Localization
- Currency: PKR (Rs.)
- Phone format: Pakistani (`03XX-XXXXXXX`)
- Language: English (Urdu support — future consideration)

---

## 14. Release Roadmap

### Phase 1 — MVP Launch (Current → 4 weeks)
**Goal:** Functional storefront with real orders

| Task | Priority |
|------|----------|
| Connect Prisma to PostgreSQL; run migrations | P0 |
| Seed products into database | P0 |
| Build `/api/products`, `/api/orders`, `/api/custom-orders` | P0 |
| Implement global cart context (React Context + localStorage) | P0 |
| Wire cart page to shared state + order submission API | P0 |
| Admin login + JWT auth | P0 |
| Wire admin CRUD to database | P0 |
| Replace placeholder product/hero images | P1 |

### Phase 2 — Operations (Weeks 5–8)
**Goal:** Admin can run the business from the panel

| Task | Priority |
|------|----------|
| Admin order management dashboard | P0 |
| Admin custom order inbox | P0 |
| Order confirmation (email or WhatsApp) | P1 |
| Cloud image upload (products + custom inspiration) | P1 |
| Order status updates | P1 |

### Phase 3 — Growth (Weeks 9–12)
**Goal:** Improve discovery and conversion

| Task | Priority |
|------|----------|
| Individual product pages with SEO | P1 |
| Search and filter | P2 |
| Instagram feed integration | P2 |
| Customer order tracking page | P2 |
| Analytics (GA4 / Plausible) | P2 |
| Reviews/testimonials section | P3 |

### Phase 4 — Scale (Future)
- Online payment (JazzCash, EasyPaisa, card)
- Inventory/stock management
- Discount codes & promotions
- Multi-admin roles
- Urdu language support
- WhatsApp order notifications bot

---

## 15. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cart state not shared | High — lost sales | Phase 1: global cart context |
| No backend persistence | High — lost orders | Phase 1: API + DB integration |
| Unsecured admin panel | Critical — data breach | Phase 1: JWT auth middleware |
| COD fraud/ghost orders | Medium | Phone verification; confirm via call/WhatsApp |
| Custom order image loss | Medium | Cloud storage in Phase 2 |
| Single artisan bottleneck | Medium | Set clear timelines; limit concurrent custom orders |
| Placeholder content | Low — brand trust | Replace with real photography/video |

---

## 16. Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| PostgreSQL database | Infrastructure | Required — not configured in repo |
| `DATABASE_URL` env variable | Configuration | Required |
| Domain DNS (pearlette.pk) | External | Unknown |
| Product photography | Content | Placeholder images in use |
| Instagram account (@pearlette.pk) | Marketing | Referenced in footer |
| Courier/COD logistics | Operations | External — nationwide COD claimed |

---

## 17. Acceptance Criteria (MVP)

The MVP is ready for production when:

- [ ] All 13+ products load from the database on category pages and homepage
- [ ] User can add items to cart, navigate away, and return with cart intact
- [ ] Navbar cart count updates correctly
- [ ] User can complete checkout; order saved to `Order` + `OrderItem` tables
- [ ] Custom order form saves to `CustomOrder` table
- [ ] Admin can log in at `/admin/login`
- [ ] Admin can CRUD products with changes persisting after refresh
- [ ] Admin panel is inaccessible without authentication
- [ ] Site is responsive on mobile, tablet, and desktop
- [ ] No console errors on primary user flows

---

## 18. Open Questions

1. **Payment for custom orders:** How will 50% advance be collected (bank transfer, JazzCash, etc.)?
2. **Order notifications:** Email, SMS, WhatsApp, or manual dashboard check?
3. **Shipping partners:** Which courier(s) for nationwide COD?
4. **Return/refund policy:** Needed for trust; not yet on site
5. **Product inventory:** Track stock quantities or made-to-order only?
6. **Real contact details:** Footer uses placeholder phone/email — confirm production values
7. **Image assets:** Timeline for professional product photography?
8. **Legal pages:** Privacy policy, terms of service — required before launch?

---

## 19. Appendix

### A. Brand Messaging
- **Tagline:** "Handcrafted with Love"
- **Value props:** 100% Handcrafted, Premium Quality, Made with Love
- **Payment:** Cash on Delivery nationwide, free shipping
- **Custom orders:** 50% advance, 7–14 day turnaround, 24-hour response SLA

### B. Contact (as shown on site)
- Email: hello@pearlette.pk
- Phone: +92 300 123 4567
- Location: Lahore, Pakistan
- Instagram: [@pearlette.pk](https://www.instagram.com/pearlette.pk)

### C. Default Admin Credentials (Development Only)
- Email: `admin@pearlette.pk`
- Password: `admin123`
- ⚠️ Must be changed before production deployment

---

*This document reflects the codebase as analyzed on August 21, 2026. Update version history as features ship.*
