-- PROMO CODES TABLE SETUP
-- Run this SQL in your Supabase SQL Editor to enable promo codes functionality
-- Go to: Supabase Dashboard > SQL Editor > New Query > Paste this and click "Run"

-- Create promo_codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percentage DECIMAL(5,2) NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  profit_percentage DECIMAL(5,2) DEFAULT 0 CHECK (profit_percentage >= 0 AND profit_percentage <= 100),
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON promo_codes(is_active);

-- Enable RLS
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Allow public to read active promo codes (for validation)
CREATE POLICY "Allow public to read active promo codes"
  ON promo_codes
  FOR SELECT
  TO public
  USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- Allow authenticated users to read all promo codes
CREATE POLICY "Allow authenticated to read all promo codes"
  ON promo_codes
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert/update/delete promo codes (admin functionality)
CREATE POLICY "Allow authenticated to manage promo codes"
  ON promo_codes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_promo_codes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER promo_codes_updated_at
  BEFORE UPDATE ON promo_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_promo_codes_updated_at();

-- Update orders table to link to promo codes
DO $$ 
BEGIN
  -- Add promo_code column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'promo_code'
  ) THEN
    ALTER TABLE orders ADD COLUMN promo_code TEXT;
    CREATE INDEX IF NOT EXISTS idx_orders_promo_code ON orders(promo_code);
  END IF;

  -- Add foreign key to promo_codes if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'orders_promo_code_fkey'
  ) THEN
    ALTER TABLE orders 
    ADD CONSTRAINT orders_promo_code_fkey 
    FOREIGN KEY (promo_code) 
    REFERENCES promo_codes(code) 
    ON DELETE SET NULL;
  END IF;
END $$;

-- Insert some sample promo codes (optional - remove if not needed)
INSERT INTO promo_codes (code, discount_percentage, profit_percentage, max_uses, is_active)
VALUES 
  ('WELCOME10', 10, 5, 100, true),
  ('SAVE20', 20, 10, 50, true),
  ('VIP30', 30, 15, 20, true)
ON CONFLICT (code) DO NOTHING;

-- Success message
SELECT 'Promo codes table created successfully! You can now manage promo codes from the admin panel.' as status;
