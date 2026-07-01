-- Run this once only if the products table was created before homepage promotions were added.
ALTER TABLE products
  ADD COLUMN promoted TINYINT(1) NOT NULL DEFAULT 0 AFTER logo_background,
  ADD COLUMN promotion_label VARCHAR(120) NOT NULL DEFAULT '' AFTER promoted,
  ADD COLUMN promotion_note VARCHAR(255) NOT NULL DEFAULT '' AFTER promotion_label;
