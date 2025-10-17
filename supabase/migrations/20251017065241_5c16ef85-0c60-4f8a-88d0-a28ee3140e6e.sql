-- Create promo_code_package_discounts table for package-specific promo codes
CREATE TABLE IF NOT EXISTS promo_code_package_discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID REFERENCES promo_codes(id) ON DELETE CASCADE NOT NULL,
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE NOT NULL,
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  profit_percentage INTEGER DEFAULT 0 CHECK (profit_percentage >= 0 AND profit_percentage <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(promo_code_id, package_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_promo_package_promo_id ON promo_code_package_discounts(promo_code_id);
CREATE INDEX IF NOT EXISTS idx_promo_package_package_id ON promo_code_package_discounts(package_id);

-- Enable RLS
ALTER TABLE promo_code_package_discounts ENABLE ROW LEVEL SECURITY;

-- Allow public to read promo code package discounts
CREATE POLICY "promo_code_package_discounts_public_select"
  ON promo_code_package_discounts
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated to manage
CREATE POLICY "promo_code_package_discounts_public_insert"
  ON promo_code_package_discounts
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "promo_code_package_discounts_public_update"
  ON promo_code_package_discounts
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "promo_code_package_discounts_public_delete"
  ON promo_code_package_discounts
  FOR DELETE
  TO public
  USING (true);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_promo_package_discounts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER promo_package_discounts_updated_at
  BEFORE UPDATE ON promo_code_package_discounts
  FOR EACH ROW
  EXECUTE FUNCTION update_promo_package_discounts_updated_at();