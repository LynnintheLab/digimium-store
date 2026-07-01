# Backend Schema + API

## Data Models

### products

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | VARCHAR(120) | PK | Slugified name, e.g. `chatgpt-plus` |
| name | VARCHAR(180) | NOT NULL | Display name |
| category | VARCHAR(60) | NOT NULL | See Category enum |
| summary | VARCHAR(255) | NOT NULL DEFAULT '' | One-line description for cards |
| description | TEXT | NOT NULL | Full description for product page |
| status | ENUM | NOT NULL DEFAULT 'available' | See ProductStatus enum |
| status_note | VARCHAR(255) | NOT NULL DEFAULT '' | Optional note shown with status |
| tone | ENUM | NOT NULL DEFAULT 'blue' | Card accent color: blue/violet/green/orange |
| logo_url | VARCHAR(500) | NOT NULL DEFAULT '' | Must start with https:// or /uploads/ |
| logo_background | VARCHAR(40) | NOT NULL DEFAULT '#f6f6f6' | Hex color for logo container |
| promoted | TINYINT(1) | NOT NULL DEFAULT 0 | Shows in home page spotlight |
| promotion_label | VARCHAR(120) | NOT NULL DEFAULT '' | e.g. "Limited offer" |
| promotion_note | VARCHAR(255) | NOT NULL DEFAULT '' | Subtitle for promotion card |
| sort_order | INT | NOT NULL DEFAULT 0 | Lower = earlier in grid |
| created_at | TIMESTAMP | NOT NULL | Auto set |
| updated_at | TIMESTAMP | NOT NULL | Auto updated |

### product_plans

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | VARCHAR(160) | PK | `{product_id}-{slugified-plan-name}` |
| product_id | VARCHAR(120) | FK -> products.id CASCADE | |
| name | VARCHAR(180) | NOT NULL | e.g. "Personal", "Family" |
| description | TEXT | NOT NULL | Shown under plan name |
| status | ENUM | NOT NULL DEFAULT 'available' | See ProductStatus enum |
| sort_order | INT | NOT NULL DEFAULT 0 | |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

### product_plan_durations

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK AUTO_INCREMENT | |
| plan_id | VARCHAR(160) | FK -> product_plans.id CASCADE | |
| label | VARCHAR(80) | NOT NULL | e.g. "1 Month", "3 Months" |
| price | DECIMAL(12,2) | NOT NULL DEFAULT 0 | Current price in MMK |
| original_price | DECIMAL(12,2) | NULL | Shown as strikethrough when set |
| status | ENUM | NOT NULL DEFAULT 'available' | See ProductStatus enum |
| sort_order | INT | NOT NULL DEFAULT 0 | |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

Unique constraint: `(plan_id, label)` - no duplicate duration labels per plan.

### product_feature_groups

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK AUTO_INCREMENT | |
| product_id | VARCHAR(120) | FK -> products.id CASCADE | |
| title | VARCHAR(160) | NOT NULL | e.g. "What you get" |
| sort_order | INT | NOT NULL DEFAULT 0 | |

### product_features

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK AUTO_INCREMENT | |
| group_id | BIGINT UNSIGNED | FK -> product_feature_groups.id CASCADE | |
| item | VARCHAR(255) | NOT NULL | Feature bullet text |
| sort_order | INT | NOT NULL DEFAULT 0 | |

### contacts

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | VARCHAR(120) | PK | Slugified title |
| type | VARCHAR(40) | NOT NULL | See ContactType |
| title | VARCHAR(180) | NOT NULL | Display name |
| subtitle | VARCHAR(255) | NOT NULL DEFAULT '' | Secondary label |
| url | VARCHAR(500) | NOT NULL DEFAULT '' | Link URL |
| image_url | VARCHAR(500) | NOT NULL DEFAULT '' | Must be https:// or /uploads/ |
| background_url | VARCHAR(500) | NOT NULL DEFAULT '' | Must be https:// or /uploads/ |
| status | ENUM | NOT NULL DEFAULT 'available' | See ProductStatus enum |
| sort_order | INT | NOT NULL DEFAULT 0 | |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

## Relationships

```
products (1) -> (many) product_plans
product_plans (1) -> (many) product_plan_durations
products (1) -> (many) product_feature_groups
product_feature_groups (1) -> (many) product_features
```

All child tables cascade delete from parent.

## Enums + Constants

### ProductStatus
`available` | `out-of-stock` | `dm-for-price` | `hidden`

- `available` - purchasable, shown
- `out-of-stock` - shown but add-to-cart disabled
- `dm-for-price` - shown, price hidden, DM button shown
- `hidden` - not shown in public store; visible in admin

### Category
`AI Tools` | `Streaming` | `VPN` | `Creative` | `Productivity` | `Learning`

### ProductTone (card accent color)
`blue` | `violet` | `green` | `orange`

### ContactType
`telegram` | `telegram-admin` | `telegram-channel` | `facebook` | any string

## Validation Rules

| Field | Rules |
|-------|-------|
| product.id | Slugified from name; max 80 chars; required |
| product.name | Required; trimmed string |
| product.category | Must match Category enum; defaults to "AI Tools" |
| product.status | Must match ProductStatus enum; defaults to "available" |
| product.tone | Must be blue/violet/green/orange; defaults to "blue" |
| product.logoUrl | Must start with `https://` or `/uploads/`; empty string otherwise |
| duration.price | Numeric; defaults to 0 |
| duration.label | Required; trimmed; unique per plan |
| contact.url | Free string (external URLs allowed) |
| contact.imageUrl | Must start with `https://` or `/uploads/` |
| contact.backgroundUrl | Must start with `https://` or `/uploads/` |

## File / Media Storage

- **Location:** `uploads/` directory on server filesystem
- **Served at:** `/uploads/:filename`
- **Naming:** `{Date.now()}-{slugified-original-name}.{ext}`
- **Allowed types:** JPEG, PNG, GIF, WebP (SVG blocked)
- **Max size:** 2 MB per file
- **Access:** Public (no auth required to read)

## Caching

No application-level cache. MySQL query pool has `connectionLimit: 8`. Add Redis if read latency becomes an issue at scale.

## Migration Strategy

Files in `database/`:
- `schema.sql` - full DDL, safe to re-run (`CREATE TABLE IF NOT EXISTS`)
- `migration-001-promotions.sql` - additive migration for promotion fields
- Future migrations: `migration-{NNN}-{description}.sql`

---

## API

### Base URL

```
Production: https://buywith-digimium.store/api
Development: http://localhost:3000/api
```

No versioning prefix currently. Add `/v2/` when breaking changes are needed.

### Auth Method

Admin endpoints require `x-admin-pin` request header. Value must match `ADMIN_PIN` env var. No token, no session.

```
x-admin-pin: your-admin-pin-here
```

### Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/health | Server health check | No |
| GET | /api/products | List all public products (excludes hidden) | No |
| GET | /api/products/:id | Get single product by id | No |
| GET | /api/contacts | List all available contacts | No |
| GET | /api/admin/products | List all products including hidden | PIN |
| POST | /api/admin/products | Create product | PIN |
| PUT | /api/admin/products/:id | Update product | PIN |
| DELETE | /api/admin/products/:id | Delete product | PIN |
| GET | /api/admin/contacts | List all contacts including unavailable | PIN |
| POST | /api/admin/contacts | Create contact | PIN |
| PUT | /api/admin/contacts/:id | Update contact | PIN |
| DELETE | /api/admin/contacts/:id | Delete contact | PIN |
| POST | /api/admin/uploads | Upload image file | PIN |

### Request / Response Examples

**GET /api/products**
```json
{
  "ok": true,
  "products": [
    {
      "id": "chatgpt-plus",
      "name": "ChatGPT Plus",
      "category": "AI Tools",
      "summary": "GPT-4o with priority access",
      "status": "available",
      "tone": "green",
      "promoted": false,
      "plans": [
        {
          "id": "chatgpt-plus-personal",
          "name": "Personal",
          "durations": [
            { "label": "1 Month", "price": 12000, "originalPrice": 15000, "status": "available" }
          ]
        }
      ],
      "features": [
        { "title": "What you get", "items": ["GPT-4o access", "Image generation", "Priority queue"] }
      ]
    }
  ]
}
```

**POST /api/admin/uploads**
```
Content-Type: multipart/form-data
x-admin-pin: your-pin

file: <image binary>
```
```json
{ "ok": true, "url": "/uploads/1719830400000-chatgpt-logo.png" }
```

### Error Response Format

```json
{ "ok": false, "error": "Descriptive error message." }
```

HTTP status codes:
- `400` - Bad request / validation error (message shown to client)
- `401` - Missing or wrong admin PIN
- `404` - Resource not found
- `429` - Rate limit exceeded (30 req / 15 min on admin routes)
- `500` - Server error (generic message only, no internal details)
- `503` - Database not configured

### Rate Limiting

Admin routes: 30 requests per 15-minute window per IP. Returns 429 with:
```json
{ "ok": false, "error": "Too many requests. Try again later." }
```
