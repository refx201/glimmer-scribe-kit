-- Add support for multiple items per order
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS order_number TEXT UNIQUE DEFAULT NULL;

-- Create index for order_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- Add comment
COMMENT ON COLUMN orders.items IS 'Array of cart items included in this order';
COMMENT ON COLUMN orders.order_number IS 'Unique order number for grouping multiple items';