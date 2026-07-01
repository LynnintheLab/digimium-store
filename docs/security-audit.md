# Security Audit Report

**Date:** 2026-07-01
**Scope:** Full (OWASP Top 10)
**Project:** digimium-store — React 19 / TypeScript / Express 5 / MySQL / Vite 8
**Auditor:** Claude Code (automated + static analysis)
**Status:** All CRITICAL and HIGH issues fixed on 2026-07-01

---

## CRITICAL (must fix before production)

### C1 — [server/index.js:22] Hardcoded default admin PIN

```js
const adminPin = process.env.ADMIN_PIN || "123456";
```

Default `"123456"` is active when `ADMIN_PIN` env var is unset. Anyone who discovers
the admin route gets full CRUD over products, contacts, and file uploads with zero effort.

**Recommendation:** Remove the fallback. Crash on startup if `ADMIN_PIN` is absent:

```js
const adminPin = process.env.ADMIN_PIN;
if (!adminPin || adminPin.length < 12) {
  console.error("FATAL: ADMIN_PIN env var is required and must be at least 12 characters.");
  process.exit(1);
}
```

---

### C2 — [server/index.js:103] PIN accepted via query string

```js
const providedPin = req.header("x-admin-pin") || req.query.pin;
```

`?pin=` value appears in:
- Server access logs (plain text)
- Reverse-proxy / CDN access logs (Cloudflare, Hostinger)
- Browser history and bookmarks
- HTTP `Referer` headers on any outbound link click

**Recommendation:** Remove `req.query.pin` fallback entirely. Header-only:

```js
const providedPin = req.header("x-admin-pin");
```

---

### C3 — [server/index.js:102-108] No rate limiting on auth or any endpoint

PIN space is 6-digit numeric = 1,000,000 combinations. No lockout, no delay, no IP
throttling. A script can exhaust the full keyspace in under 10 minutes over a fast connection.

**Recommendation:** Add `express-rate-limit` on admin routes (and globally as hygiene):

```js
import rateLimit from "express-rate-limit";

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many requests." },
});

app.use("/api/admin/", adminLimiter);
```

---

## HIGH (fix before release)

### H1 — [server/index.js:25] Wildcard CORS with credentials

```js
app.use(cors({ origin: true, credentials: true }));
```

`origin: true` reflects every `Origin` header back as allowed. Combined with `credentials: true`,
any site can make credentialed cross-origin requests to the admin API. This is effectively no CORS
protection at all.

**Recommendation:** Lock to explicit origins:

```js
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("CORS: origin not allowed"));
  },
  credentials: true,
}));
```

---

### H2 — [server/index.js:436-438] SVG upload enables stored XSS

```js
filename: (_req, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();
  // extension is user-controlled and NOT validated
```

`fileFilter` checks `file.mimetype.startsWith("image/")` only. SVG MIME type
(`image/svg+xml`) passes this check. An SVG file containing `<script>` tags will
execute JavaScript when opened in the browser via `/uploads/malicious.svg`.

**Recommendation:** Allowlist specific extensions and set `Content-Disposition` header on uploads:

```js
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);

fileFilter: (_req, file, callback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!file.mimetype.startsWith("image/") || !ALLOWED_EXTENSIONS.has(ext)) {
    callback(new Error("Only JPEG, PNG, GIF, and WebP uploads are allowed."));
  } else {
    callback(null, true);
  }
},
```

Also add `Content-Disposition: attachment` to the `/uploads` static route to force
download instead of inline rendering.

---

### H3 — [server/index.js, missing] No security headers

No `helmet` or manual headers. Missing:

| Header | Risk without it |
|--------|----------------|
| `Content-Security-Policy` | XSS execution |
| `X-Frame-Options` | Clickjacking |
| `X-Content-Type-Options` | MIME sniffing |
| `Strict-Transport-Security` | Protocol downgrade |
| `Referrer-Policy` | URL leakage |

**Recommendation:**

```sh
npm install helmet
```

```js
import helmet from "helmet";
app.use(helmet());
```

---

### H4 — [server/index.js:538-543] Error handler leaks internal messages

```js
app.use((error, _req, res, _next) => {
  const status = error.statusCode || 500;
  res.status(status).json({
    ok: false,
    error: error.message || "Server error.",
  });
});
```

Database errors, constraint violations, and internal path strings flow directly to
the client as `error.message`. Example: a MySQL error would expose table name, column
names, or query fragments.

**Recommendation:** Separate internal from user-safe errors:

```js
app.use((error, _req, res, _next) => {
  const status = error.statusCode || 500;
  const isUserFacing = status < 500;
  res.status(status).json({
    ok: false,
    error: isUserFacing ? (error.message || "Request error.") : "Server error.",
  });
  if (!isUserFacing) console.error("[error]", error);
});
```

---

### H5 — [src/lib/telegram.ts:5] Hardcoded operator identity in source

```ts
export const TELEGRAM_USERNAME = "LynnIsHeree";
```

Operator Telegram handle is committed to source. Any fork, leak, or public repo
exposes the personal contact. Also creates a change-deploy cycle for any username update.

**Recommendation:** Move to env var:

```ts
export const TELEGRAM_USERNAME = import.meta.env.VITE_TELEGRAM_USERNAME ?? "";
```

---

## MEDIUM (fix soon)

### M1 — [server/index.js:154, 175] URL fields stored without validation

`logoUrl`, `imageUrl`, `backgroundUrl` accept any string. No validation blocks
`javascript:` URIs or `data:` URIs, which render as `src`/`href` in the frontend
and can trigger XSS or unwanted data exfiltration.

**Recommendation:** Validate that URL fields start with `https://` or `/uploads/`:

```js
function safeUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  if (url.startsWith("/uploads/") || url.startsWith("https://")) return url;
  return "";
}
```

---

### M2 — [server/index.js:458-463] Health endpoint leaks DB config state

```json
{ "ok": true, "app": "digimium-store", "databaseConfigured": true }
```

Reveals infrastructure configuration to unauthenticated callers. Minor, but useful
for an attacker mapping the stack.

**Recommendation:** Remove `databaseConfigured` from the public response or gate
behind `requireAdmin`.

---

### M3 — [src/context/cart-context.tsx:29] Unguarded JSON.parse on localStorage

```ts
const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as unknown;
```

No try/catch. Manually corrupted or cross-tab interference causes an unhandled
exception that crashes the cart context and breaks the entire store page.

**Recommendation:**

```ts
function loadCart(): CartItem[] {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}
```

---

### M4 — [server/index.js:27] Uploaded files served without auth

```js
app.use("/uploads", express.static(uploadsDir));
```

Any uploaded logo is publicly accessible by URL-guessing or directory enumeration
(if dir listing somehow enabled). File names are time-based + slugified original name,
so not opaque.

**Recommendation:** Filename is `${Date.now()}-${slug}${ext}` which is reasonable
entropy. Ensure directory listing is disabled (Express static does this by default).
No action required unless private media is ever uploaded.

---

## LOW / INFORMATIONAL

### L1 — [server/index.js:23] `adminHost` matching uses hostname only

```js
const isAdminHostname = hostname.startsWith("admin.") || ...
```

Any subdomain starting with `admin.` on any domain triggers admin redirect behavior.
Low risk since it only redirects; auth still required.

### L2 — No audit log for admin mutations

Admin product/contact CRUD leaves no server-side log. If credentials are compromised,
there is no forensic trail of what was changed.

**Recommendation:** Add a console log line per mutating admin action (at minimum):

```js
console.log(`[admin] ${req.method} ${req.path} from ${req.ip}`);
```

### L3 — `CLOUDFLARE_TESTING.md`, `HOSTINGER_DEPLOY.md` in repo

Deployment architecture details are committed. Not sensitive if repo is private, but
remove or move to `.gitignore` before making the repo public.

### L4 — PIN held in React component state only

PIN is NOT stored in localStorage or sessionStorage. It lives in component state
only. This is the correct, safe approach. No action needed.

### L5 — All SQL uses parameterized queries

All `query()` calls use `?` placeholders. No string concatenation in SQL detected.
No SQL injection risk.

---

## Dependency Audit

```
npm audit result: 0 vulnerabilities (0 critical, 0 high, 0 moderate, 0 low)
Total packages: 253 (181 prod, 73 dev, 44 optional)
```

**Clean.** No action required.

---

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 3 |
| HIGH | 5 |
| MEDIUM | 4 |
| LOW / INFO | 5 |
| Dep CVEs | 0 |

**Verdict: FAIL — do not deploy to production without resolving C1, C2, C3.**

### Priority fix order

1. **C1** — Remove `"123456"` fallback, enforce strong PIN at startup
2. **C2** — Remove `?pin=` query string auth path
3. **C3** — Add rate limiting on `/api/admin/` routes
4. **H1** — Restrict CORS to known origins
5. **H2** — Block SVG uploads, add extension allowlist
6. **H3** — Add `helmet` for security headers
7. **H4** — Sanitize error messages in global error handler
8. **H5** — Move Telegram username to `VITE_TELEGRAM_USERNAME` env var
