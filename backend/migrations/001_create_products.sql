CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    image_url TEXT NOT NULL,
    product_name TEXT,
    short_title TEXT,
    category TEXT,
    subcategory TEXT,
    description TEXT,
    materials TEXT[] DEFAULT '{}',
    colors TEXT[] DEFAULT '{}',
    pattern TEXT,
    style TEXT,
    shape TEXT,
    finish TEXT,
    target_audience TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    use_cases TEXT[] DEFAULT '{}',
    selling_points TEXT[] DEFAULT '{}',
    seo_keywords TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    price_min NUMERIC,
    price_max NUMERIC,
    confidence NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own products
CREATE POLICY "Users can view own products" ON products FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own products" ON products FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own products" ON products FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own products" ON products FOR DELETE USING (user_id = auth.uid());

-- Index for faster queries
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
