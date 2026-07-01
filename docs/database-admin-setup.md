# Digimium database + admin setup

This project now has two parts:

- Public store: React/Vite frontend
- Admin/API: Node.js + MySQL backend

The same Node app serves both `buywith-digimium.store` and `admin.buywith-digimium.store`.

## Local development

Run the frontend:

```bash
npm run dev
```

By default, local frontend design uses fallback data and does not call the API. To test the API from Vite locally:

```bash
VITE_USE_API=1 npm run dev
```

Run the API server:

```bash
npm run dev:api
```

If MySQL is not configured yet, the admin page still opens in preview mode.

Admin URL:

```txt
http://localhost:5173/admin
```

If Vite uses another port, use that port instead.

## Hostinger setup

### 1. Create MySQL database

In Hostinger hPanel:

```txt
Databases → MySQL Databases
```

Create:

- database name
- database user
- database password

Then import:

```txt
database/schema.sql
```

If you already imported an older version of the schema, run this once instead of recreating the database:

```txt
database/migration-001-promotions.sql
```

You can usually import it in phpMyAdmin.

Optional starter data:

```txt
database/sample-seed.sql
```

This adds your Facebook/Telegram links and three sample products showing `available`, `out-of-stock`, and `dm-for-price`.

The product editor supports multiple detail plan cards. Each card has its own name, description, status, and any number of manually named duration/price rows. A product can also be marked for the homepage promotion area with custom promotion text.

### 2. Configure Node app environment variables

In Hostinger Node.js app settings, add:

```txt
PORT=3000
ADMIN_PIN=your-secret-pin
ADMIN_HOST=admin.buywith-digimium.store
DB_HOST=your-hostinger-db-host
DB_PORT=3306
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
```

Do not keep `ADMIN_PIN=123456` on the real website.

### 3. Node.js app settings

Use:

```txt
Install command: npm install
Build command: npm run build
Start command: npm start
Startup file: server.js
```

If Hostinger asks for root directory, choose the folder containing:

```txt
package.json
server/
src/
database/
```

### 4. Domain/subdomain plan

Recommended:

```txt
buywith-digimium.store        → same Node app
admin.buywith-digimium.store  → same Node app
```

The server automatically redirects:

```txt
admin.buywith-digimium.store/
```

to:

```txt
admin.buywith-digimium.store/admin
```

So it feels like a separate admin site.

## Product statuses

Products support:

```txt
available       customer can buy
out-of-stock    card is faded and button disabled
dm-for-price    customer can DM admin for price
hidden          admin only, not shown in store
```

## API routes

Public:

```txt
GET /api/health
GET /api/products
GET /api/products/:id
GET /api/contacts
```

Admin, requires `x-admin-pin` header:

```txt
GET    /api/admin/products
POST   /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id

GET    /api/admin/contacts
POST   /api/admin/contacts
PUT    /api/admin/contacts/:id
DELETE /api/admin/contacts/:id

POST   /api/admin/uploads
```

Uploads are stored in:

```txt
uploads/
```

and served from:

```txt
/uploads/file-name.png
```

## Public store data flow

The public site now tries the API first:

```txt
/api/products
/api/contacts
```

If the API is offline or MySQL is not configured, the website falls back to the local product/contact data so local design work can continue.
