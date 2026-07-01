# Product Requirements + App Flow

## Problem Statement

Burmese customers lack a trustworthy, mobile-friendly way to browse and order digital subscriptions (AI tools, streaming, VPN, creative apps). Existing options are cluttered, require payment forms, or are only reachable through informal Telegram messages with no product clarity.

## Goals + Success Metrics

| Goal | Metric |
|------|--------|
| Customer understands the business on landing | Bounce rate < 50% on home page |
| Customer finds and selects a product quickly | Store-to-cart in < 30 seconds |
| Cart-to-Telegram handoff is frictionless | < 3 taps from cart to Telegram message sent |
| Admin can update catalog without code | Product CRUD via /admin in < 2 minutes |

## Target Users

**Primary - Burmese digital consumer**
Mobile-first. Often opens links inside Telegram's in-app browser. Wants to see what they get, how long, and how much - without being forced through a payment form. May read Burmese; UI must be legible in both languages.

**Secondary - Digimium admin**
Business owner managing products, pricing, and promotions. Needs a simple PIN-protected panel to add/edit/remove products and contact links without touching code.

## Features

### Core (MVP)

- Home page: brand intro, 3-step checkout explanation, promoted product spotlight, logo cloud
- Store page: product grid with category filter and search
- Product page: plan picker, duration selector, feature list, add-to-cart
- Cart drawer: item list, quantity controls, total, Telegram order message generator
- Contact page: contact links (Telegram, Facebook, channel)
- Admin panel: product + contact CRUD, logo upload, promotion toggle
- Static data fallback when database is not configured

### Extended (v2)

- Burmese language toggle / i18n
- Order history via Telegram bot webhook
- Product availability notifications
- Admin analytics: page views, popular products

### Out of Scope

- Payment processing or checkout forms
- User accounts or authentication for customers
- Direct shipping or physical product orders
- Third-party checkout (Stripe, PayPal, etc.)

## User Stories

- As a customer, I want to see what products are available with prices, so I can decide what to buy before contacting anyone.
- As a customer, I want to build a cart and send it as a Telegram message, so I do not have to type out my order manually.
- As a customer, I want to filter products by category, so I can find AI tools or streaming services without scrolling past unrelated items.
- As an admin, I want to mark a product as out of stock or dm-for-price, so customers get accurate availability without me editing code.
- As an admin, I want to upload a product logo from my phone, so the store looks polished without requiring a developer.

## Constraints

- Mobile-first: primary viewport is 390px wide (iPhone-class)
- Telegram in-app browser compatibility required
- No payment processing - legal and operational decision
- Hostinger shared hosting - no Docker, no always-on Node process without PM2/cPanel config
- Myanmar (Burmese) text must render correctly on all supported devices

## Open Questions / Assumptions

- Assumed: all prices are in Myanmar Kyat (MMK) - confirm currency display format
- Open: should cart persist across sessions if a product goes out of stock? (Currently yes - stale items are pruned on next load)
- Open: is a Burmese-language UI toggle planned for v1 or v2?

---

## App Flow

### Entry Points

| Entry | Route | Notes |
|-------|-------|-------|
| Direct URL | `/` | Home page |
| Telegram link | `/store?category=AI+Tools` | Deep-link to filtered store |
| Product link | `/product/:productId` | Direct product page |
| Contact | `/contact` | Contact links |
| Admin | `/admin` | PIN-protected, no nav link shown |

### Core Flow 1 - Browse and order

1. Customer lands on `/` - sees brand intro, checkout steps, promoted product
2. Taps "Explore store" - navigates to `/store`
3. Optionally filters by category or searches by name
4. Taps a product card - add button adds with default plan/duration, opens cart drawer
   - Or: taps product name - navigates to `/product/:id` for full plan/duration picker
5. On product page: selects plan (if multiple), selects duration, taps "Add to cart"
6. Cart drawer opens - reviews items, adjusts quantities
7. Taps "Continue on Telegram" - opens Telegram with pre-written order message
8. Conversation continues with admin on Telegram

### Core Flow 2 - Product detail + DM for price

1. Product has status `dm-for-price`
2. Add to cart button is replaced with "DM admin for price"
3. Tapping opens Telegram DM with pre-filled message naming the product

### Core Flow 3 - Admin catalog management

1. Navigate to `/admin`
2. Enter PIN (min 12 chars, set via `ADMIN_PIN` env)
3. See product list - click product to expand editor
4. Edit name, category, status, plans, durations, logo, promotion
5. Save - PUT `/api/admin/products/:id`
6. Add new product - POST `/api/admin/products`
7. Delete - DELETE `/api/admin/products/:id`

### Navigation Structure

```
Header (SiteLayout)
  Logo -> /
  Store -> /store
  Contact -> /contact
  Cart icon (item count badge) -> opens CartDrawer

CartDrawer (global overlay)
  Item list with quantity +/-
  Total
  "Continue on Telegram" CTA

/admin (no header, standalone)
  PIN login form
  Product editor panel
  Contact editor panel
```

### Auth Gating

| Route | Auth required |
|-------|---------------|
| `/` `/store` `/product/*` `/contact` | Public |
| `/admin` | Admin PIN via `x-admin-pin` header |
| `GET /api/products` `GET /api/contacts` | Public |
| `GET/POST/PUT/DELETE /api/admin/*` | Admin PIN header |

### State Transitions

| State | Trigger | UI |
|-------|---------|-----|
| Loading products | API fetch in progress | Skeleton / "Loading..." |
| No products | API returns empty | "No products found." + clear filters button |
| Product out of stock | `status = out-of-stock` | Card shows tag; add button disabled |
| DM for price | `status = dm-for-price` | Telegram DM button replaces add-to-cart |
| Cart empty | No items | Empty state in drawer |
| DB not configured | No `DB_*` env vars | Falls back to `src/data/products.ts` static data |

### Edge Cases

- **Stale cart items**: on product data load, cart prunes any item whose product/plan/duration no longer exists or is unavailable
- **Unknown route**: falls through to `HomePage` (`path="*"`)
- **Product not found**: `ProductPage` redirects to `/store`
- **Admin PIN wrong**: 401 response; frontend shows error inline
- **Too many admin requests**: 429 after 30 req/15 min; frontend should handle gracefully
