-- ============================================================
-- VelgGarage Database Schema
-- ============================================================

-- brands table
CREATE TABLE IF NOT EXISTS brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  country VARCHAR(100),
  founded_year INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  brand_id INTEGER REFERENCES brands(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  model VARCHAR(200),
  category VARCHAR(100),
  construction_type VARCHAR(100),
  material VARCHAR(100),
  description TEXT,
  price NUMERIC(12, 2) DEFAULT 45000000,
  stock INTEGER DEFAULT 5,
  image_url TEXT,
  image_source_url TEXT,
  manufacturer_source_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- product_specifications table
CREATE TABLE IF NOT EXISTS product_specifications (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  diameter DECIMAL(4,1),
  width DECIMAL(4,1),
  pcd VARCHAR(50),
  offset_range VARCHAR(50),
  finish VARCHAR(200),
  weight_kg DECIMAL(4,2),
  load_rating INTEGER
);

CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_product_specs_product_id ON product_specifications(product_id);
