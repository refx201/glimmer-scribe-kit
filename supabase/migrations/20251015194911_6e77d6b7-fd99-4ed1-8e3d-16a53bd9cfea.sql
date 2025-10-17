-- Add is_featured and featured_order columns to packages table
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS featured_order integer;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_packages_featured ON packages(is_featured, featured_order) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_packages_hot_sale ON packages(is_hot_sale) WHERE is_hot_sale = true;
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured, featured_order) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_hot_sale ON products(is_hot_sale) WHERE is_hot_sale = true;