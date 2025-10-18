-- Add filter_category_id to products table
ALTER TABLE products 
ADD COLUMN filter_category_id uuid REFERENCES product_filter_categories(id);

-- Add index for better performance
CREATE INDEX idx_products_filter_category ON products(filter_category_id);