# 🗄 Database Schema - Supabase PostgreSQL

## Overview
All tables use UUID primary keys, created_at timestamps,
and Row Level Security (RLS) policies.

## Run this SQL in Supabase SQL Editor in this exact order:

```sql
-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: categories
-- ============================================
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: products
-- ============================================
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  short_description TEXT,
  full_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  sku VARCHAR(100) UNIQUE,
  stock_quantity INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_new_arrival BOOLEAN DEFAULT false,
  wattage INTEGER,
  blade_size VARCHAR(50),
  rpm VARCHAR(50),
  airflow VARCHAR(100),
  noise_level VARCHAR(50),
  warranty_years INTEGER DEFAULT 2,
  colors_available TEXT[],
  meta_title VARCHAR(200),
  meta_description TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: product_images
-- ============================================
CREATE TABLE product_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(200),
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: product_specifications
-- ============================================
CREATE TABLE product_specifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  spec_key VARCHAR(100) NOT NULL,
  spec_value VARCHAR(200) NOT NULL,
  display_order INTEGER DEFAULT 0
);

-- ============================================
-- TABLE: orders
-- ============================================
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(200) NOT NULL,
  customer_email VARCHAR(200),
  customer_phone VARCHAR(50) NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city VARCHAR(100) NOT NULL,
  customer_province VARCHAR(100),
  payment_method VARCHAR(50) DEFAULT 'cod',
  payment_status VARCHAR(50) DEFAULT 'pending',
  order_status VARCHAR(50) DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_fee DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  tracking_number VARCHAR(200),
  courier_name VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order status options: pending, confirmed, processing, shipped, delivered, cancelled, returned

-- ============================================
-- TABLE: order_items
-- ============================================
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(200) NOT NULL,
  product_sku VARCHAR(100),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  selected_color VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: order_status_history
-- ============================================
CREATE TABLE order_status_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  note TEXT,
  created_by VARCHAR(100) DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: reviews
-- ============================================
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_name VARCHAR(200) NOT NULL,
  customer_city VARCHAR(100),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_approved BOOLEAN DEFAULT false,
  is_verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: hero_banners
-- ============================================
CREATE TABLE hero_banners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  subtitle TEXT,
  cta_text VARCHAR(100),
  cta_link VARCHAR(200),
  image_url TEXT,
  background_color VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: site_settings
-- ============================================
CREATE TABLE site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default settings
INSERT INTO site_settings (key, value, description) VALUES
('site_name', 'Taimoor Fans', 'Website name'),
('tagline', 'Pakistan''s Most Energy Efficient Fans', 'Main tagline'),
('phone', '+92-XXX-XXXXXXX', 'Contact phone'),
('whatsapp', '+92-XXX-XXXXXXX', 'WhatsApp number'),
('email', 'info@tamoorfans.com', 'Contact email'),
('address', 'Your Address, Pakistan', 'Physical address'),
('shipping_fee', '150', 'Default shipping fee in PKR'),
('free_shipping_threshold', '5000', 'Order amount for free shipping'),
('facebook_url', '', 'Facebook page URL'),
('instagram_url', '', 'Instagram page URL'),
('youtube_url', '', 'YouTube channel URL'),
('traditional_fan_wattage', '75', 'Traditional fan watts for calculator'),
('taimoor_fan_wattage', '30', 'Taimoor fan watts for calculator'),
('electricity_rate_pkr', '50', 'PKR per unit electricity rate'),
('hours_per_day', '12', 'Average fan usage hours');

-- ============================================
-- TABLE: newsletter_subscribers
-- ============================================
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(200) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: contact_messages
-- ============================================
CREATE TABLE contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200),
  phone VARCHAR(50),
  subject VARCHAR(200),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: coupons
-- ============================================
CREATE TABLE coupons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) DEFAULT 'percentage',
  discount_value DECIMAL(10,2) NOT NULL,
  minimum_order DECIMAL(10,2) DEFAULT 0,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_phone ON orders(customer_phone);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_product_images_product ON product_images(product_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read active categories" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read product images" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Public can read product specs" ON product_specifications
  FOR SELECT USING (true);

CREATE POLICY "Public can read approved reviews" ON reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Public can read site settings" ON site_settings
  FOR SELECT USING (true);

-- Public insert policies
CREATE POLICY "Anyone can create an order" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can add order items" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit a review" ON reviews
  FOR INSERT WITH CHECK (true);

-- Service role has full access (for admin operations)
-- This is handled by using service role key in admin routes
```

## Supabase Storage Buckets

```
Create these buckets in Supabase Dashboard > Storage:

1. "product-images" (Public bucket)
   - Max file size: 5MB
   - Allowed types: image/jpeg, image/png, image/webp

2. "category-images" (Public bucket)
   - Max file size: 2MB
   - Allowed types: image/jpeg, image/png, image/webp

3. "banner-images" (Public bucket)
   - Max file size: 3MB
   - Allowed types: image/jpeg, image/png, image/webp
```
