# Setup + Testing + Changelog

## Prerequisites

- Node.js 22.x (`node --version` should show `v22.*`)
- npm 10+
- MySQL 8+ (local or Hostinger)
- Git

## Install Steps

```sh
# 1. Clone
git clone https://github.com/LynnintheLab/digimium-store.git
cd digimium-store

# 2. Install dependencies
npm install

# 3. Copy env file and fill in values
cp .env.example .env
# Edit .env - see Env Vars section below

# 4. Create MySQL database and run schema
mysql -u root -p < database/schema.sql
# Optional: seed sample data
mysql -u root -p your_db_name < database/sample-seed.sql

# 5. Run frontend dev server
npm run dev

# 6. Run API server (separate terminal)
npm run dev:api
```

Vite dev server runs on `http://localhost:5173` and proxies `/api/*` to the Express server on port 3000.

## Env Vars

All values go in `.env` (copy from `.env.example`).

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Express port (default: 3000) |
| `ADMIN_PIN` | **Yes** | Admin panel PIN - minimum 12 characters. Server will not start without it. |
| `ADMIN_HOST` | No | Hostname for admin subdomain redirect, e.g. `admin.buywith-digimium.store` |
| `ALLOWED_ORIGINS` | No | Comma-separated CORS origins. Default: `http://localhost:5173,http://localhost:3000` |
| `DB_HOST` | No* | MySQL host. If absent, falls back to static data. |
| `DB_PORT` | No | MySQL port (default: 3306) |
| `DB_USER` | No* | MySQL username |
| `DB_PASSWORD` | No* | MySQL password |
| `DB_NAME` | No* | MySQL database name |
| `DB_CONNECTION_LIMIT` | No | Pool connection limit (default: 8) |
| `VITE_TELEGRAM_USERNAME` | **Yes** | Telegram username for order handoff (no @ prefix) |

*DB vars are optional - app falls back to static data in `src/data/products.ts` when absent.

Frontend env vars (prefixed `VITE_`) must be set before running `npm run build`.

## How to Run Locally

**Dev mode (frontend + API separately):**

```sh
# Terminal 1 - Vite frontend
npm run dev

# Terminal 2 - Express API
npm run dev:api
```

**Production build:**

```sh
npm run build       # TypeScript check + Vite build -> dist/
npm start           # Express serves dist/ + /api/*
```

**Cloudflare tunnel (for mobile testing on phone):**

```sh
npm run dev:tunnel  # Vite with VITE_TUNNEL=1
npm run tunnel      # cloudflared tunnel --url http://localhost:5173
```

See `docs/cloudflare-testing.md` for full tunnel setup.

## Common Errors + Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `FATAL: ADMIN_PIN env var is required` | `ADMIN_PIN` not set or < 12 chars | Set `ADMIN_PIN` in `.env` with 12+ chars |
| `ER_ACCESS_DENIED_ERROR` | Wrong DB credentials | Check `DB_USER` and `DB_PASSWORD` in `.env` |
| `ECONNREFUSED` on API calls | API server not running | Run `npm run dev:api` in separate terminal |
| Products not loading in store | DB not configured | Either set DB vars or check `src/data/products.ts` static data |
| Telegram button does nothing | `VITE_TELEGRAM_USERNAME` not set | Set `VITE_TELEGRAM_USERNAME` in `.env` and rebuild |
| CORS error on API call | Origin not in allowlist | Add origin to `ALLOWED_ORIGINS` in `.env` |

---

## Testing

### Test Framework

No test suite currently configured. **This is a gap - see below.**

### Coverage Target

80%+ coverage required per project rules. Not yet achieved.

### Test Types Required

1. **Unit** - `src/lib/telegram.ts` (message builder), `src/data/products.ts` (helpers)
2. **Integration** - Express API endpoints with real MySQL (test DB)
3. **E2E** - Playwright: home -> store -> add to cart -> Telegram handoff

### TDD Workflow

RED -> GREEN -> REFACTOR. Write failing test first. See `~/.claude/rules/common/testing.md`.

### How to Set Up Tests

Recommended stack:
```sh
npm install --save-dev vitest @vitest/coverage-v8 @testing-library/react playwright
```

Add to `package.json`:
```json
"scripts": {
  "test": "vitest",
  "test:coverage": "vitest --coverage",
  "test:e2e": "playwright test"
}
```

### How to Write New Tests

- Unit tests: `src/**/*.test.ts` alongside source files
- E2E tests: `e2e/` directory at root
- Test the behavior, not the implementation

### Mocking Strategy

- Mock `fetch` in unit tests for API-dependent code
- Use real DB (test database) for integration tests - no mock DB
- Playwright E2E against local dev server

---

## Changelog

### [0.1.0] - 2026-07-01

#### Added

- Initial Digimium store website
- Home page with brand intro, checkout steps, promotion spotlight, logo cloud
- Store page with category filter and search
- Product page with plan picker, duration selector, and feature list
- Cart drawer with quantity controls and Telegram order message generator
- Contact page with configurable contact links
- Admin panel with PIN auth - product and contact CRUD, logo upload
- Express 5 API with MySQL backend and static data fallback
- Full security hardening: helmet, rate limiting, strict CORS, upload allowlist, URL validation
- Project documentation: PRD, TECH, SCHEMA, DESIGN, PLAN, SETUP, security-audit
