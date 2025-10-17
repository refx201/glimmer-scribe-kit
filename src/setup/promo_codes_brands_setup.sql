-- BRAND-SPECIFIC PROMO CODES SETUP
-- Run this SQL in your Supabase SQL Editor

-- First, check if brands table exists, if not create it
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Allow public to read brands
CREATE POLICY "Allow public to read brands"
  ON brands
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated to manage brands
CREATE POLICY "Allow authenticated to manage brands"
  ON brands
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create brand-specific promo code discounts table
CREATE TABLE IF NOT EXISTS promo_code_brand_discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID REFERENCES promo_codes(id) ON DELETE CASCADE NOT NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  discount_percentage DECIMAL(5,2) NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  profit_percentage DECIMAL(5,2) DEFAULT 0 CHECK (profit_percentage >= 0 AND profit_percentage <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(promo_code_id, brand_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_promo_brand_promo_id ON promo_code_brand_discounts(promo_code_id);
CREATE INDEX IF NOT EXISTS idx_promo_brand_brand_id ON promo_code_brand_discounts(brand_id);

-- Enable RLS
ALTER TABLE promo_code_brand_discounts ENABLE ROW LEVEL SECURITY;

-- Allow public to read active promo code discounts
CREATE POLICY "Allow public to read promo brand discounts"
  ON promo_code_brand_discounts
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated to manage
CREATE POLICY "Allow authenticated to manage promo brand discounts"
  ON promo_code_brand_discounts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- Add trigger for updated_at on promo_code_brand_discounts
CREATE OR REPLACE FUNCTION update_promo_brand_discounts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER promo_brand_discounts_updated_at
  BEFORE UPDATE ON promo_code_brand_discounts
  FOR EACH ROW
  EXECUTE FUNCTION update_promo_brand_discounts_updated_at();

-- Insert default brands if they don't exist
INSERT INTO brands (name) VALUES 
  ('Apple'),
  ('OPPO'),
  ('Realme')
ON CONFLICT (name) DO NOTHING;

-- Success message
SELECT 'Brand-specific promo codes setup completed successfully!' as status;
