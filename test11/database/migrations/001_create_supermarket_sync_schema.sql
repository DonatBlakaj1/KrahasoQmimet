-- =======================================================================
-- Çmimi.ks - Supermarket Price Comparison Database Schema (PostgreSQL/Supabase)
-- Migration: 001_create_supermarket_sync_schema.sql
-- =======================================================================

-- 1. Supermarkets Table
CREATE TABLE IF NOT EXISTS supermarkets (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    color VARCHAR(32) NOT NULL DEFAULT '#059669',
    badge_bg VARCHAR(64) DEFAULT 'bg-emerald-50 text-emerald-700 border-emerald-200',
    total_stores INTEGER DEFAULT 0,
    cities TEXT[] NOT NULL DEFAULT '{}',
    description TEXT,
    website VARCHAR(512),
    hotline VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Data Sources & Integration Registry
CREATE TABLE IF NOT EXISTS supermarket_sources (
    id VARCHAR(64) PRIMARY KEY,
    supermarket_id VARCHAR(64) NOT NULL REFERENCES supermarkets(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    official_url VARCHAR(512) NOT NULL,
    status VARCHAR(64) NOT NULL DEFAULT 'pending_authorization', -- 'active_public_catalog', 'partially_authorized_pdf', 'pending_authorization', 'unreachable_dev_host'
    auth_type VARCHAR(64) NOT NULL DEFAULT 'commercial_feed', -- 'public_e_shop', 'pdf_leaflet', 'partner_api', 'commercial_feed'
    data_format VARCHAR(64) NOT NULL DEFAULT 'JSON/REST',
    is_authorized BOOLEAN DEFAULT FALSE,
    sync_interval_hours INTEGER DEFAULT 12,
    last_sync_at TIMESTAMPTZ,
    next_sync_at TIMESTAMPTZ,
    imported_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    last_error TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Universal Normalized Products Table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    category VARCHAR(128) NOT NULL,
    package_size VARCHAR(64) NOT NULL,
    unit_measure VARCHAR(32) DEFAULT 'kg', -- 'kg', 'L', 'copë'
    barcode VARCHAR(64) UNIQUE,
    image_url TEXT NOT NULL,
    description TEXT,
    is_popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for rapid barcode & product lookup
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);

-- 4. Current Price Records (Idempotent: One current record per product per supermarket)
CREATE TABLE IF NOT EXISTS price_records (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    supermarket_id VARCHAR(64) NOT NULL REFERENCES supermarkets(id) ON DELETE CASCADE,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    old_price NUMERIC(10, 2) CHECK (old_price >= 0),
    is_on_discount BOOLEAN DEFAULT FALSE,
    promotion_start_date TIMESTAMPTZ,
    promotion_end_date TIMESTAMPTZ,
    is_available BOOLEAN DEFAULT TRUE,
    source_url VARCHAR(512),
    source_name VARCHAR(128),
    source_type VARCHAR(64) DEFAULT 'online_shop', -- 'online_shop', 'promotional_pdf', 'partner_feed', 'manual_verification'
    verified_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_product_supermarket UNIQUE (product_id, supermarket_id)
);

CREATE INDEX IF NOT EXISTS idx_price_records_product ON price_records(product_id);
CREATE INDEX IF NOT EXISTS idx_price_records_supermarket ON price_records(supermarket_id);

-- 5. Historical Price Log (Tracks price changes over time)
CREATE TABLE IF NOT EXISTS price_history (
    id BIGSERIAL PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    supermarket_id VARCHAR(64) NOT NULL REFERENCES supermarkets(id) ON DELETE CASCADE,
    old_price NUMERIC(10, 2) NOT NULL,
    new_price NUMERIC(10, 2) NOT NULL,
    change_type VARCHAR(32) NOT NULL, -- 'increase', 'decrease', 'initial'
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    source_name VARCHAR(128)
);

CREATE INDEX IF NOT EXISTS idx_price_history_product_date ON price_history(product_id, recorded_at);

-- 6. Synchronization Audit Logs Table
CREATE TABLE IF NOT EXISTS sync_audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    source_id VARCHAR(64) REFERENCES supermarket_sources(id) ON DELETE SET NULL,
    source_name VARCHAR(128) NOT NULL,
    status VARCHAR(32) NOT NULL, -- 'success', 'warning', 'error', 'pending'
    items_imported INTEGER DEFAULT 0,
    items_updated INTEGER DEFAULT 0,
    items_unchanged INTEGER DEFAULT 0,
    message TEXT,
    duration_ms INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sync_audit_source ON sync_audit_logs(source_id, created_at);

-- 7. Trigger to automatically record price changes into price_history
CREATE OR REPLACE FUNCTION log_price_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE' AND OLD.price <> NEW.price) THEN
        INSERT INTO price_history (
            product_id,
            supermarket_id,
            old_price,
            new_price,
            change_type,
            source_name
        ) VALUES (
            NEW.product_id,
            NEW.supermarket_id,
            OLD.price,
            NEW.price,
            CASE WHEN NEW.price < OLD.price THEN 'decrease' ELSE 'increase' END,
            NEW.source_name
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_price_change ON price_records;
CREATE TRIGGER trg_price_change
AFTER UPDATE ON price_records
FOR EACH ROW
EXECUTE FUNCTION log_price_change();
