# Hostinger deployment checklist

Upload `digimium-hostinger.zip` as a **Node.js Web App**. The ZIP is prepared with `package.json` at its root; do not put it inside another folder before uploading.

## 1. Create the MySQL database

In hPanel, open **Databases → MySQL Databases** and create a database, user, and strong password.

Open phpMyAdmin for that database and import, in this order:

1. `database/schema.sql`
2. `database/sample-seed.sql`

Use `database/migration-001-promotions.sql` only when upgrading a database that was created using an older version of this project. Do not run it after the current `schema.sql`.

## 2. Add the Node.js website

In hPanel, choose **Websites → Add Website → Node.js Web App → Upload your website files** and upload the ZIP.

Use these settings:

```txt
Framework: Node.js + Vite (choose Other if this option is not shown)
Node.js: 22.x
Install command: npm install
Build command: npm run build
Start command: npm start
Entry file: server.js
Output directory: dist
```

## 3. Add environment variables

Add these in Hostinger's deployment settings. Do not upload a real `.env` file or place secrets in the ZIP.

```txt
ADMIN_PIN=replace-with-a-long-private-pin
ADMIN_HOST=admin.buywith-digimium.store
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_hostinger_database_user
DB_PASSWORD=your_hostinger_database_password
DB_NAME=your_hostinger_database_name
DB_CONNECTION_LIMIT=8
```

Do not add `PORT`. Hostinger supplies the application port automatically and the server already reads it.

## 4. Deploy and test

After deployment, open:

```txt
https://your-hostinger-preview-domain/api/health
```

Expected response:

```json
{"ok":true,"app":"digimium-store","databaseConfigured":true}
```

Then test:

```txt
https://your-hostinger-preview-domain/
https://your-hostinger-preview-domain/store
https://your-hostinger-preview-domain/admin
```

Log into `/admin` using the `ADMIN_PIN`, edit one product, save it, refresh the page, and confirm the edit remains.

## 5. Connect the real domains

Connect the main Node app to:

```txt
buywith-digimium.store
```

Then, inside that website's hPanel dashboard, open **Domains → Subdomains**, create:

```txt
admin.buywith-digimium.store
```

Keep it as part of the existing Node.js website so both hostnames reach the same Express app and the same uploaded files. If the domain uses Hostinger nameservers, DNS is normally created automatically. If DNS is managed elsewhere, point an `A` record named `admin` to the hosting plan IP.

After the subdomain works, confirm:

```txt
https://buywith-digimium.store
https://admin.buywith-digimium.store
```

The admin hostname redirects its root to `/admin`. With `ADMIN_HOST` configured, opening `/admin` on the store domain also redirects to the admin subdomain.

## Important upload note

Product/contact images uploaded through the admin are stored in the app's `uploads/` directory. Back up that directory before replacing or redeploying the application ZIP.
