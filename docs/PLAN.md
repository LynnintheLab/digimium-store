# Implementation Plan + Tasks

## Project Phases

### Phase 1 - Foundation (Complete)

**Goal:** Working store with static data, basic cart, and Telegram handoff.

**Tasks:**
1. Project scaffold (Vite + React + TypeScript + Tailwind)
2. Routing setup (React Router, lazy pages)
3. Static product data (`src/data/products.ts`)
4. Home page (landing, checkout steps, logo cloud)
5. Store page (product grid, category filter, search)
6. Product page (plan picker, duration selector, pricing card)
7. Cart context + localStorage persistence
8. Cart drawer + Telegram order message builder
9. Contact page

**Deliverables:** Public store with static data, fully navigable on mobile.

### Phase 2 - Backend + Admin (Complete)

**Goal:** Live product management via MySQL + admin panel.

**Tasks:**
1. MySQL schema design (`database/schema.sql`)
2. Express 5 server setup with mysql2 pool
3. Public API endpoints (`/api/products`, `/api/contacts`)
4. Static data fallback when DB not configured
5. Admin API endpoints (CRUD products, contacts, uploads)
6. PIN auth middleware + rate limiting
7. Admin page (product editor, contact editor, logo upload)
8. multer upload handler
9. Hostinger deploy setup

**Deliverables:** Full-stack app deployable to Hostinger, admin panel functional.

### Phase 3 - Security Hardening (Complete)

**Goal:** Production-safe security posture before launch.

**Tasks:**
1. Remove hardcoded ADMIN_PIN default - crash on missing/short PIN
2. Remove `?pin=` query string auth path - header only
3. Add express-rate-limit on admin routes
4. Fix CORS - locked to ALLOWED_ORIGINS env var
5. Add helmet for security headers
6. Block SVG uploads - extension + mimetype allowlist
7. Sanitize 5xx error messages
8. Move TELEGRAM_USERNAME to env var
9. Add safeUrl() for logo/image/background fields
10. Remove databaseConfigured from public health endpoint
11. Fix stale admin PIN hint in UI
12. Declare VITE_TELEGRAM_USERNAME in env types
13. Consolidate docs to docs/
14. Full security audit documented in docs/security-audit.md

**Deliverables:** Security audit passed, all CRITICAL + HIGH + MEDIUM issues resolved.

### Phase 4 - Polish + Launch (Next)

**Goal:** Production launch with final content, performance tuning, and monitoring.

**Tasks:**
- [ ] Set ADMIN_PIN, VITE_TELEGRAM_USERNAME, ALLOWED_ORIGINS in production .env
- [ ] Run `database/schema.sql` on Hostinger MySQL
- [ ] Seed real product catalog via admin panel
- [ ] Upload all product logos via admin panel
- [ ] Test full order flow on mobile (Telegram in-app browser)
- [ ] Test cart persistence across sessions
- [ ] Test admin panel on desktop
- [ ] Verify Telegram handoff message format with real products
- [ ] Performance audit (Lighthouse mobile)
- [ ] Set up PM2 or cPanel Node.js process on Hostinger

---

## Milestone Table

| Milestone | Description | Target Date | Status |
|-----------|-------------|-------------|--------|
| Static store | Working store, static data, Telegram handoff | - | Done |
| Backend + admin | MySQL, Express API, admin CRUD panel | - | Done |
| Security hardening | All audit issues resolved | 2026-07-01 | Done |
| Production launch | Live on Hostinger with real catalog | TBD | Planned |
| Burmese i18n | Language toggle for Burmese content | TBD | Backlog |

---

## Current Tasks

## In Progress

- [ ] Production deployment - set env vars, run schema, seed catalog

## Backlog

- [ ] Lighthouse mobile audit + fix any CLS/LCP issues
- [ ] `@media (prefers-reduced-motion)` audit on Framer Motion animations
- [ ] Admin audit log - log each mutation to console with timestamp + IP
- [ ] Burmese language toggle (i18n)
- [ ] Order history via Telegram bot webhook
- [ ] Product availability notifications

## Done

- [x] Project scaffold + routing
- [x] Static product data + cart
- [x] Telegram order message builder
- [x] Home, Store, Product, Contact, Admin pages
- [x] MySQL schema + Express API
- [x] Admin PIN auth + rate limiting
- [x] Security hardening (Phase 3)
- [x] Documentation (PRD, TECH, SCHEMA, DESIGN, PLAN, SETUP)

---

## Dependencies Map

```
schema.sql -> Admin panel seeding
ADMIN_PIN env var -> Server starts
VITE_TELEGRAM_USERNAME env var -> Telegram handoff works
ALLOWED_ORIGINS env var -> CORS in production works
DB_* env vars -> Live product data (static fallback otherwise)
```

---

## Risks + Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Hostinger Node.js process restarts and loses session | Medium | Low | Stateless design - no server-side sessions |
| MySQL connection pool exhausted under load | Low | High | Pool limit 8; add read replica if traffic grows |
| Admin PIN brute-forced | Low | High | Rate limit 30/15min; min 12 chars; header-only delivery |
| Telegram username changes break handoff | Medium | High | VITE_TELEGRAM_USERNAME env var - change without redeploy |
| Static fallback diverges from DB schema | Medium | Medium | Keep `src/data/products.ts` updated when Product type changes |

---

## Definition of Done

**Phase complete when:**
- All tasks checked off
- No CRITICAL or HIGH security issues
- Admin panel CRUD verified end-to-end
- Mobile order flow verified in Telegram in-app browser
- Docs updated to reflect any changes
