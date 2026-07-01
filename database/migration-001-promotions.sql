-- Migration 001: Add promotion columns to products
-- SKIP THIS if you ran schema.sql fresh — these columns are already included.
-- Only run on existing databases created before v0.1.0.

ALTER TABLE products
  ADD COLUMN promoted        TINYINT(1)   NOT NULL DEFAULT 0           AFTER logo_background,
  ADD COLUMN promotion_label VARCHAR(120) NOT NULL DEFAULT ''          AFTER promoted,
  ADD COLUMN promotion_note  VARCHAR(255) NOT NULL DEFAULT ''          AFTER promotion_label;
