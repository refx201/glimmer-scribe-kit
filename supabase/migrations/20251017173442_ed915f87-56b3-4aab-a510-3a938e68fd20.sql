-- Add logo_url column to suppliers table
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS logo_url TEXT;