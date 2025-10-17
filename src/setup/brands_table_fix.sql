-- FIX BRANDS TABLE STRUCTURE
-- Run this SQL in your Supabase SQL Editor

-- Add missing columns to brands table if they don't exist
DO $$ 
BEGIN
  -- Add is_active column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'brands' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE brands ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;

  -- Add order_index column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'brands' AND column_name = 'order_index'
  ) THEN
    ALTER TABLE brands ADD COLUMN order_index INTEGER DEFAULT 0;
  END IF;

  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'brands' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE brands ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  -- Rename logo column to logo_url if needed
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'brands' AND column_name = 'logo'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'brands' AND column_name = 'logo_url'
  ) THEN
    ALTER TABLE brands RENAME COLUMN logo TO logo_url;
  END IF;
END $$;

-- Create trigger for updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION update_brands_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS brands_updated_at ON brands;
CREATE TRIGGER brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW
  EXECUTE FUNCTION update_brands_updated_at();

-- Update existing brands to have order_index based on display_order
UPDATE brands 
SET order_index = COALESCE(display_order, 0)
WHERE order_index = 0 OR order_index IS NULL;

-- Success message
SELECT 'Brands table fixed successfully!' as status;
