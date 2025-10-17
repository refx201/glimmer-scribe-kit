-- Remove unique constraint to allow multiple reviews per user per product
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_product_id_user_id_key;