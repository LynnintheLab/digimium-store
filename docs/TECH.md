# Architecture + Decisions + Security

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend framework | React 19 | Concurrent features, large ecosystem |
| Build tool | Vite 8 | Fast HMR, native ESM, Tailwind 4 plugin |
| Language | TypeScript 6 | Type safety across frontend + shared types |
| Styling | Tailwind CSS 4 | Utility-first, co-located with markup |
| UI components | Ant Design 6 + Radix UI | Ant for admin forms/drawer; Radix for headless primitives |
| Animation | Framer Motion | Declarative motion for landing/transitions |
| Routing | React Router 7 | File-less routing, lazy page loading |
| Backend | Express 5 | Minimal, well-known, compatible with shared hosting |
| Runtime | Node.js 22 | LTS, native ESM support |
| Database | MySQL (mysql2/promise) | Hostinger provides MySQL; connection pooling built-in |
| File uploads | multer | Multipart form handling for logo uploads |
| Security | helmet + express-rate-limit + cors | Header hardening, rate limiting, CORS lockdown |
| Deploy | Hostinger shared hosting | Client constraint - no container runtime |

## Folder Structure

```
digimium-store/
├── server/
│   └── index.js          # Express API - all routes + DB logic
├── server.js             # Entry point (imports server/index.js)
├── src/
│   ├── App.tsx           # Router, providers, lazy page imports
│   ├── main.tsx          # React root mount
│   ├── types.ts          # Shared TypeScript interfaces
│   ├── vite-env.d.ts     # Vite env var type declarations
│   ├── components/
│   │   ├── cart/         # CartDrawer
│   │   ├── layout/       # SiteLayout, PageCanvas
│   │   └── ui/           # Button, Card, PricingCard, LogoCloud, etc.
│   ├── context/
│   │   ├── cart-context.tsx         # Cart state + localStorage sync
│   │   └── product-data-context.tsx # API fetch + static fallback
│   ├── data/
│   │   ├── products.ts   # Static fallback product data + helpers
│   │   └── contacts.ts   # Static fallback contact data
│   ├── lib/
│   │   ├── telegram.ts   # Order message builder + URL helpers
│   │   ├── product-logos.ts # Logo asset map
│   │   └── utils.ts      # cn() class merge helper
│   ├── pages/
│   │   ├── home-page.tsx
│   │   ├── store-page.tsx
│   │   ├── product-page.tsx
│   │   ├── contact-page.tsx
│   │   └── admin-page.tsx
│   └── styles/
│       └── globals.css   # CSS variables, Tailwind import, global styles
├── database/
│   ├── schema.sql         # Full DDL - create tables
│   ├── migration-001-promotions.sql
│   └── sample-seed.sql
├── logos/                 # Product logo assets (PNG)
├── assets/                # Brand assets + fonts
├── uploads/               # Runtime upload destination (gitignored content)
├── docs/                  # All project documentation
├── public/                # Static assets served by Vite
├── .env.example
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Request Lifecycle

```
Browser
  └─ Vite dev server (port 5173, dev only)
       └─ Proxy /api/* -> Express (port 3000)

Production:
Browser -> Express (port 3000)
  ├─ Static files from dist/ (Vite build output)
  ├─ /uploads/* -> uploads/ directory
  └─ /api/* -> route handlers
       ├─ requireAdmin middleware (x-admin-pin header check)
       ├─ adminLimiter (30 req / 15 min)
       ├─ DB query via mysql2 pool
       └─ JSON response
```

## Technical Goals

- Page load < 2s on 3G mobile
- Admin CRUD operations < 500ms round-trip on Hostinger MySQL
- Zero-downtime product updates (admin panel, no redeploy)
- Works inside Telegram in-app browser (WebKit-based)

## Integration Points

| Service | Auth | Purpose |
|---------|------|---------|
| MySQL (Hostinger) | DB credentials via env | Product + contact storage |
| Telegram | None (URL scheme only) | Order handoff via `t.me/USERNAME?text=...` |
| Cloudflare Tunnel | Tunnel token | Dev/staging HTTPS exposure |

## Deployment

- **Target:** Hostinger Business shared hosting
- **Node:** PM2 or cPanel Node.js app manager
- **Build:** `npm run build` -> `dist/` served by Express static
- **DB:** Hostinger MySQL, credentials in `.env`
- **Uploads:** `uploads/` on server filesystem, served at `/uploads/*`
- See `docs/hostinger-deploy.md` for step-by-step

## Observability

- `console.log` for server startup and unconfigured DB warning
- `console.error` for 5xx errors (error message only, not stack)
- No metrics or alerting configured - add if uptime SLA needed

---

## Architecture Decision Records

### [2024] Use Telegram as checkout handoff instead of payment gateway

**Status:** Accepted
**Context:** Digimium operates in Myanmar where card payment infrastructure is unreliable and customers prefer negotiating via messaging apps. A payment gateway would add compliance overhead, transaction fees, and trust barriers.
**Decision:** Cart generates a formatted order message and opens `t.me/USERNAME?text=...`. No payment data is handled by the site.
**Consequences:** No automated order confirmation. Admin must manually respond to each order. Scales poorly at high volume, but removes PCI compliance scope entirely.

### [2024] Static data fallback when DB is not configured

**Status:** Accepted
**Context:** Dev environments and first-time deploys may not have MySQL ready. Blocking all functionality on DB presence makes onboarding painful.
**Decision:** `ProductDataContext` fetches from API; if DB env vars are absent, `server/index.js` returns 503 and context falls back to `src/data/products.ts` and `src/data/contacts.ts`.
**Consequences:** Static fallback can drift from DB schema. Must keep fallback data updated when product shape changes.

### [2026-07-01] PIN-only admin auth with header delivery

**Status:** Accepted
**Context:** Admin panel needs protection. Full JWT/session auth is over-engineered for a single-operator tool accessed from a known device.
**Decision:** ADMIN_PIN env var (min 12 chars, mandatory). Sent via `x-admin-pin` header only (no query string). Rate-limited to 30 req / 15 min per IP.
**Consequences:** No multi-user admin, no audit trail per user. Acceptable for single-operator use. Upgrade to JWT if multiple admins are needed.

### [2026-07-01] Helmet + explicit CORS origins

**Status:** Accepted
**Context:** Initial CORS config was `origin: true, credentials: true` (wildcard), exposing admin API to CSRF from any origin.
**Decision:** `ALLOWED_ORIGINS` env var (comma-separated). Helmet for security headers (CSP, HSTS, noSniff, X-Frame-Options).
**Consequences:** Requires `ALLOWED_ORIGINS` to be set in production `.env`. Dev defaults to `localhost:5173,localhost:3000`.

---

## Security

### Auth + Authorization

- Admin routes: `x-admin-pin` header, checked by `requireAdmin` middleware
- PIN minimum 12 characters; server crashes on startup if absent or too short
- Rate limit: 30 requests per 15 minutes per IP on all `/api/admin/` routes
- No customer auth - store is fully public

### Input Validation

- Product/contact payloads normalized through `normalizeProductPayload` / `normalizeContactPayload`
- All enum fields validated against allowlists (`safeStatus`, `safeCategory`, tone check)
- URL fields (`logoUrl`, `imageUrl`, `backgroundUrl`) validated by `safeUrl()` - only `https://` and `/uploads/` allowed
- All SQL uses parameterized queries (`?` placeholders) via mysql2 - no string concatenation

### Secret Management

- `ADMIN_PIN`, `DB_PASSWORD`, `DB_USER`, `DB_HOST`, `DB_NAME` - all via env vars
- `VITE_TELEGRAM_USERNAME` - via env var, not hardcoded in source
- `.env` is in `.gitignore`; `.env.example` has no real values

### Upload Security

- Allowed extensions: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp` (allowlist)
- Allowed MIME types: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- SVG blocked (prevents stored XSS via `<script>` in SVG)
- Max file size: 2 MB
- Filenames: `{timestamp}-{slugified-original}.{ext}` - no path traversal possible

### Known Attack Surfaces

| Surface | Mitigation |
|---------|-----------|
| Admin PIN brute force | Rate limit 30 req/15 min; PIN min 12 chars |
| XSS via uploaded SVG | Extension + mimetype allowlist blocks SVG |
| CSRF on admin API | CORS locked to `ALLOWED_ORIGINS`; credentials required |
| SQL injection | All queries parameterized |
| Internal error leakage | 5xx errors return "Server error." only |
| `javascript:` URIs in logo/image fields | `safeUrl()` strips anything not `https://` or `/uploads/` |

### Dependency Audit

Run `npm audit` before each release. As of 2026-07-01: 0 vulnerabilities across 253 packages.
See `docs/security-audit.md` for full audit results.
