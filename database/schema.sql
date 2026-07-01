-- Digimium Store — Fresh Install Schema
-- Run this once on a new database.
-- All migrations up to v0.1.0 are already incorporated here.
--
-- Usage:
--   mysql -u root -p your_database_name < database/schema.sql

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS products (
  id                VARCHAR(120)  PRIMARY KEY,
  name              VARCHAR(180)  NOT NULL,
  category          VARCHAR(60)   NOT NULL,
  summary           VARCHAR(255)  NOT NULL DEFAULT '',
  description       TEXT          NOT NULL,
  status            ENUM('available','out-of-stock','dm-for-price','hidden') NOT NULL DEFAULT 'available',
  status_note       VARCHAR(255)  NOT NULL DEFAULT '',
  tone              ENUM('blue','violet','green','orange') NOT NULL DEFAULT 'blue',
  logo_url          VARCHAR(500)  NOT NULL DEFAULT '',
  logo_background   VARCHAR(40)   NOT NULL DEFAULT '#f6f6f6',
  promoted          TINYINT(1)    NOT NULL DEFAULT 0,
  promotion_label   VARCHAR(120)  NOT NULL DEFAULT '',
  promotion_note    VARCHAR(255)  NOT NULL DEFAULT '',
  sort_order        INT           NOT NULL DEFAULT 0,
  created_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_products_status_sort (status, sort_order),
  INDEX idx_products_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_plans (
  id          VARCHAR(160)  PRIMARY KEY,
  product_id  VARCHAR(120)  NOT NULL,
  name        VARCHAR(180)  NOT NULL,
  description TEXT          NOT NULL,
  status      ENUM('available','out-of-stock','dm-for-price','hidden') NOT NULL DEFAULT 'available',
  sort_order  INT           NOT NULL DEFAULT 0,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_product_plans_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product_plans_product_sort (product_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_plan_durations (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  plan_id         VARCHAR(160)    NOT NULL,
  label           VARCHAR(80)     NOT NULL,
  price           DECIMAL(12,2)   NOT NULL DEFAULT 0,
  original_price  DECIMAL(12,2)   NULL,
  status          ENUM('available','out-of-stock','dm-for-price','hidden') NOT NULL DEFAULT 'available',
  sort_order      INT             NOT NULL DEFAULT 0,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_product_plan_durations_plan
    FOREIGN KEY (plan_id) REFERENCES product_plans(id) ON DELETE CASCADE,
  UNIQUE KEY uq_duration_plan_label (plan_id, label),
  INDEX idx_durations_plan_sort (plan_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_feature_groups (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id  VARCHAR(120)  NOT NULL,
  title       VARCHAR(160)  NOT NULL,
  sort_order  INT           NOT NULL DEFAULT 0,
  CONSTRAINT fk_feature_groups_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_feature_groups_product_sort (product_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_features (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  group_id    BIGINT UNSIGNED NOT NULL,
  item        VARCHAR(255)    NOT NULL,
  sort_order  INT             NOT NULL DEFAULT 0,
  CONSTRAINT fk_product_features_group
    FOREIGN KEY (group_id) REFERENCES product_feature_groups(id) ON DELETE CASCADE,
  INDEX idx_product_features_group_sort (group_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contacts (
  id              VARCHAR(120)  PRIMARY KEY,
  type            VARCHAR(40)   NOT NULL,
  title           VARCHAR(180)  NOT NULL,
  subtitle        VARCHAR(255)  NOT NULL DEFAULT '',
  url             VARCHAR(500)  NOT NULL DEFAULT '',
  image_url       VARCHAR(500)  NOT NULL DEFAULT '',
  background_url  VARCHAR(500)  NOT NULL DEFAULT '',
  status          ENUM('available','out-of-stock','dm-for-price','hidden') NOT NULL DEFAULT 'available',
  sort_order      INT           NOT NULL DEFAULT 0,
  created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_contacts_status_sort (status, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
