import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import multer from "multer";
import mysql from "mysql2/promise";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const uploadsDir = path.join(rootDir, "uploads");

fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();
const port = Number(process.env.PORT ?? 3000);
const adminPin = process.env.ADMIN_PIN;
if (!adminPin || adminPin.length < 12) {
  console.error("FATAL: ADMIN_PIN env var is required and must be at least 12 characters.");
  process.exit(1);
}
const adminHost = String(process.env.ADMIN_HOST || "").trim().toLowerCase();

const allowedOrigins = new Set(
  (process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:3000")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) callback(null, true);
    else callback(new Error("CORS: origin not allowed"));
  },
  credentials: true,
}));
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(uploadsDir));

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many requests. Try again later." },
});
app.use("/api/admin/", adminLimiter);

app.use((req, res, next) => {
  const hostname = req.hostname.toLowerCase();
  const isAdminHostname = hostname.startsWith("admin.") || (adminHost && hostname === adminHost);
  const isLocalHostname = hostname === "localhost" || hostname === "127.0.0.1";

  if (req.method === "GET" && req.path === "/" && isAdminHostname) {
    res.redirect("/admin");
    return;
  }

  if (
    req.method === "GET"
    && adminHost
    && !isAdminHostname
    && !isLocalHostname
    && (req.path === "/admin" || req.path.startsWith("/admin/"))
  ) {
    res.redirect(`https://${adminHost}${req.originalUrl}`);
    return;
  }
  next();
});

let pool;

function hasDatabaseConfig() {
  return Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME);
}

function getPool() {
  if (!hasDatabaseConfig()) {
    const error = new Error("Database is not configured. Add DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME.");
    error.statusCode = 503;
    throw error;
  }

  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD ?? "",
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_CONNECTION_LIMIT ?? 8),
      namedPlaceholders: false,
      decimalNumbers: true,
    });
  }

  return pool;
}

async function query(sql, params = []) {
  const [rows] = await getPool().query(sql, params);
  return rows;
}

async function transaction(callback) {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

function requireAdmin(req, res, next) {
  const providedPin = req.header("x-admin-pin");
  if (!providedPin || providedPin !== adminPin) {
    res.status(401).json({ ok: false, error: "Admin PIN is required." });
    return;
  }
  next();
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function safeStatus(value, fallback = "available") {
  return ["available", "out-of-stock", "dm-for-price", "hidden"].includes(value) ? value : fallback;
}

function safeCategory(value) {
  return ["AI Tools", "Streaming", "VPN", "Creative", "Productivity", "Learning"].includes(value)
    ? value
    : "AI Tools";
}

function normalizeProductPayload(payload, productId) {
  const id = slugify(productId || payload.id || payload.name);
  if (!id) throw Object.assign(new Error("Product name is required."), { statusCode: 400 });

  const durations = Array.isArray(payload.durations) ? payload.durations : [];
  const plans = Array.isArray(payload.plans) && payload.plans.length > 0
    ? payload.plans
    : [{
        id: "default",
        name: payload.planName || "Default",
        description: "",
        status: payload.status || "available",
        durations,
      }];

  return {
    id,
    name: String(payload.name || id).trim(),
    category: safeCategory(payload.category),
    summary: String(payload.summary || "").trim(),
    description: String(payload.description || "").trim(),
    status: safeStatus(payload.status),
    statusNote: String(payload.statusNote || payload.status_note || "").trim(),
    tone: ["blue", "violet", "green", "orange"].includes(payload.tone) ? payload.tone : "blue",
    logoUrl: String(payload.logoUrl || payload.logo_url || "").trim(),
    logoBackground: String(payload.logoBackground || payload.logo_background || "#f6f6f6").trim(),
    promoted: payload.promoted === true || payload.promoted === 1 || payload.promoted === "1",
    promotionLabel: String(payload.promotionLabel || payload.promotion_label || "").trim(),
    promotionNote: String(payload.promotionNote || payload.promotion_note || "").trim(),
    sortOrder: Number.isFinite(Number(payload.sortOrder ?? payload.sort_order)) ? Number(payload.sortOrder ?? payload.sort_order) : 0,
    plans,
    features: Array.isArray(payload.features) ? payload.features : [],
  };
}

function normalizeContactPayload(payload, contactId) {
  const id = slugify(contactId || payload.id || payload.title || payload.type);
  if (!id) throw Object.assign(new Error("Contact title is required."), { statusCode: 400 });

  return {
    id,
    type: String(payload.type || "telegram").trim(),
    title: String(payload.title || id).trim(),
    subtitle: String(payload.subtitle || "").trim(),
    url: String(payload.url || "").trim(),
    imageUrl: String(payload.imageUrl || payload.image_url || "").trim(),
    backgroundUrl: String(payload.backgroundUrl || payload.background_url || "").trim(),
    status: safeStatus(payload.status, "available"),
    sortOrder: Number.isFinite(Number(payload.sortOrder ?? payload.sort_order)) ? Number(payload.sortOrder ?? payload.sort_order) : 0,
  };
}

async function listProducts({ admin = false } = {}) {
  const products = await query(
    `SELECT id, name, category, summary, description, status, status_note, tone, logo_url, logo_background,
            promoted, promotion_label, promotion_note, sort_order
     FROM products
     ${admin ? "" : "WHERE status <> 'hidden'"}
     ORDER BY sort_order ASC, name ASC`,
  );

  if (products.length === 0) return [];

  const ids = products.map((product) => product.id);
  const plans = await query(
    `SELECT id, product_id, name, description, status, sort_order
     FROM product_plans
     WHERE product_id IN (?)
     ORDER BY sort_order ASC, name ASC`,
    [ids],
  );
  const planIds = plans.map((plan) => plan.id);
  const durations = planIds.length
    ? await query(
        `SELECT id, plan_id, label, price, original_price, status, sort_order
         FROM product_plan_durations
         WHERE plan_id IN (?)
         ORDER BY sort_order ASC, id ASC`,
        [planIds],
      )
    : [];
  const featureGroups = await query(
    `SELECT id, product_id, title, sort_order
     FROM product_feature_groups
     WHERE product_id IN (?)
     ORDER BY sort_order ASC, id ASC`,
    [ids],
  );
  const groupIds = featureGroups.map((group) => group.id);
  const featureItems = groupIds.length
    ? await query(
        `SELECT group_id, item, sort_order
         FROM product_features
         WHERE group_id IN (?)
         ORDER BY sort_order ASC, id ASC`,
        [groupIds],
      )
    : [];

  const productMap = new Map(products.map((product) => [product.id, {
    id: product.id,
    name: product.name,
    category: product.category,
    summary: product.summary,
    description: product.description,
    status: product.status,
    statusNote: product.status_note,
    tone: product.tone,
    logoUrl: product.logo_url,
    logoBackground: product.logo_background,
    promoted: Boolean(product.promoted),
    promotionLabel: product.promotion_label,
    promotionNote: product.promotion_note,
    sortOrder: product.sort_order,
    plans: [],
    durations: [],
    features: [],
  }]));

  const durationsByPlan = new Map();
  for (const duration of durations) {
    const list = durationsByPlan.get(duration.plan_id) || [];
    list.push({
      id: duration.id,
      label: duration.label,
      price: Number(duration.price ?? 0),
      originalPrice: duration.original_price == null ? undefined : Number(duration.original_price),
      status: duration.status,
      sortOrder: duration.sort_order,
    });
    durationsByPlan.set(duration.plan_id, list);
  }

  for (const plan of plans) {
    const product = productMap.get(plan.product_id);
    if (!product) continue;
    product.plans.push({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      status: plan.status,
      sortOrder: plan.sort_order,
      durations: durationsByPlan.get(plan.id) || [],
    });
  }

  for (const product of productMap.values()) {
    product.durations = product.plans[0]?.durations || [];
  }

  const itemsByGroup = new Map();
  for (const item of featureItems) {
    const list = itemsByGroup.get(item.group_id) || [];
    list.push(item.item);
    itemsByGroup.set(item.group_id, list);
  }

  for (const group of featureGroups) {
    const product = productMap.get(group.product_id);
    if (!product) continue;
    product.features.push({
      title: group.title,
      items: itemsByGroup.get(group.id) || [],
    });
  }

  return [...productMap.values()];
}

async function getProduct(productId, { admin = false } = {}) {
  const products = await listProducts({ admin });
  return products.find((product) => product.id === productId);
}

async function saveProduct(productId, payload) {
  const product = normalizeProductPayload(payload, productId);

  await transaction(async (connection) => {
    await connection.query(
      `INSERT INTO products
        (id, name, category, summary, description, status, status_note, tone, logo_url, logo_background,
         promoted, promotion_label, promotion_note, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        category = VALUES(category),
        summary = VALUES(summary),
        description = VALUES(description),
        status = VALUES(status),
        status_note = VALUES(status_note),
        tone = VALUES(tone),
        logo_url = VALUES(logo_url),
        logo_background = VALUES(logo_background),
        promoted = VALUES(promoted),
        promotion_label = VALUES(promotion_label),
        promotion_note = VALUES(promotion_note),
        sort_order = VALUES(sort_order)`,
      [product.id, product.name, product.category, product.summary, product.description, product.status, product.statusNote, product.tone, product.logoUrl, product.logoBackground, product.promoted, product.promotionLabel, product.promotionNote, product.sortOrder],
    );

    await connection.query("DELETE FROM product_feature_groups WHERE product_id = ?", [product.id]);
    await connection.query("DELETE FROM product_plans WHERE product_id = ?", [product.id]);

    for (const [planIndex, planPayload] of product.plans.entries()) {
      const requestedPlanId = slugify(planPayload.id || planPayload.name || `plan-${planIndex + 1}`);
      const planId = requestedPlanId.startsWith(`${product.id}-`) ? requestedPlanId : `${product.id}-${requestedPlanId}`;
      await connection.query(
        `INSERT INTO product_plans (id, product_id, name, description, status, sort_order)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          planId,
          product.id,
          String(planPayload.name || `Plan ${planIndex + 1}`).trim(),
          String(planPayload.description || "").trim(),
          safeStatus(planPayload.status, product.status),
          Number(planPayload.sortOrder ?? planIndex),
        ],
      );

      const planDurations = Array.isArray(planPayload.durations) ? planPayload.durations : [];
      for (const [durationIndex, duration] of planDurations.entries()) {
        const durationLabel = String(duration.label || "").trim();
        if (!durationLabel) continue;
        await connection.query(
          `INSERT INTO product_plan_durations (plan_id, label, price, original_price, status, sort_order)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            planId,
            durationLabel,
            Number(duration.price ?? 0),
            duration.originalPrice ?? duration.original_price ?? null,
            safeStatus(duration.status, product.status),
            Number(duration.sortOrder ?? durationIndex),
          ],
        );
      }
    }

    for (const [groupIndex, group] of product.features.entries()) {
      const [result] = await connection.query(
        `INSERT INTO product_feature_groups (product_id, title, sort_order)
         VALUES (?, ?, ?)`,
        [product.id, String(group.title || "Details").trim(), Number(group.sortOrder ?? groupIndex)],
      );
      const groupId = result.insertId;

      const items = Array.isArray(group.items) ? group.items : [];
      for (const [itemIndex, item] of items.entries()) {
        await connection.query(
          `INSERT INTO product_features (group_id, item, sort_order)
           VALUES (?, ?, ?)`,
          [groupId, String(item).trim(), itemIndex],
        );
      }
    }
  });

  return getProduct(product.id, { admin: true });
}

async function deleteProduct(productId) {
  const result = await query("DELETE FROM products WHERE id = ?", [productId]);
  return result.affectedRows > 0;
}

async function listContacts({ admin = false } = {}) {
  return query(
    `SELECT id, type, title, subtitle, url, image_url, background_url, status, sort_order
     FROM contacts
     ${admin ? "" : "WHERE status = 'available'"}
     ORDER BY sort_order ASC, title ASC`,
  );
}

async function getContact(contactId, { admin = false } = {}) {
  const contacts = await listContacts({ admin });
  return contacts.find((contact) => contact.id === contactId);
}

async function saveContact(contactId, payload) {
  const contact = normalizeContactPayload(payload, contactId);
  await query(
    `INSERT INTO contacts (id, type, title, subtitle, url, image_url, background_url, status, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      type = VALUES(type),
      title = VALUES(title),
      subtitle = VALUES(subtitle),
      url = VALUES(url),
      image_url = VALUES(image_url),
      background_url = VALUES(background_url),
      status = VALUES(status),
      sort_order = VALUES(sort_order)`,
    [contact.id, contact.type, contact.title, contact.subtitle, contact.url, contact.imageUrl, contact.backgroundUrl, contact.status, contact.sortOrder],
  );
  return getContact(contact.id, { admin: true });
}

async function deleteContact(contactId) {
  const result = await query("DELETE FROM contacts WHERE id = ?", [contactId]);
  return result.affectedRows > 0;
}

const ALLOWED_IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);
const ALLOWED_IMAGE_MIMETYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (_req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      callback(null, `${Date.now()}-${slugify(path.basename(file.originalname, extension))}${extension}`);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_IMAGE_MIMETYPES.has(file.mimetype) || !ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
      callback(new Error("Only JPEG, PNG, GIF, and WebP uploads are allowed."));
    } else {
      callback(null, true);
    }
  },
});

function asyncRoute(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    app: "digimium-store",
    databaseConfigured: hasDatabaseConfig(),
  });
});

app.get("/api/products", asyncRoute(async (_req, res) => {
  res.json({ ok: true, products: await listProducts() });
}));

app.get("/api/products/:id", asyncRoute(async (req, res) => {
  const product = await getProduct(req.params.id);
  if (!product) {
    res.status(404).json({ ok: false, error: "Product not found." });
    return;
  }
  res.json({ ok: true, product });
}));

app.get("/api/contacts", asyncRoute(async (_req, res) => {
  res.json({ ok: true, contacts: await listContacts() });
}));

app.get("/api/admin/products", requireAdmin, asyncRoute(async (_req, res) => {
  res.json({ ok: true, products: await listProducts({ admin: true }) });
}));

app.post("/api/admin/products", requireAdmin, asyncRoute(async (req, res) => {
  const product = await saveProduct(undefined, req.body);
  res.status(201).json({ ok: true, product });
}));

app.put("/api/admin/products/:id", requireAdmin, asyncRoute(async (req, res) => {
  const product = await saveProduct(req.params.id, req.body);
  res.json({ ok: true, product });
}));

app.delete("/api/admin/products/:id", requireAdmin, asyncRoute(async (req, res) => {
  res.json({ ok: true, deleted: await deleteProduct(req.params.id) });
}));

app.get("/api/admin/contacts", requireAdmin, asyncRoute(async (_req, res) => {
  res.json({ ok: true, contacts: await listContacts({ admin: true }) });
}));

app.post("/api/admin/contacts", requireAdmin, asyncRoute(async (req, res) => {
  const contact = await saveContact(undefined, req.body);
  res.status(201).json({ ok: true, contact });
}));

app.put("/api/admin/contacts/:id", requireAdmin, asyncRoute(async (req, res) => {
  const contact = await saveContact(req.params.id, req.body);
  res.json({ ok: true, contact });
}));

app.delete("/api/admin/contacts/:id", requireAdmin, asyncRoute(async (req, res) => {
  res.json({ ok: true, deleted: await deleteContact(req.params.id) });
}));

app.post("/api/admin/uploads", requireAdmin, upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ ok: false, error: "Upload an image file." });
    return;
  }
  res.status(201).json({ ok: true, url: `/uploads/${req.file.filename}` });
});

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api/")) {
      next();
      return;
    }
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.use((error, _req, res, _next) => {
  const status = error.statusCode || 500;
  const isUserFacing = status < 500;
  if (!isUserFacing) console.error("[error]", error.message);
  res.status(status).json({
    ok: false,
    error: isUserFacing ? (error.message || "Request error.") : "Server error.",
  });
});

app.listen(port, () => {
  console.log(`Digimium server running on http://localhost:${port}`);
  if (!hasDatabaseConfig()) {
    console.log("Database is not configured yet. Add DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME.");
  }
});
