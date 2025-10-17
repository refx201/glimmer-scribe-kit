-- Add reviewer_name column to reviews table
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS reviewer_name TEXT;

-- Update ReviewsDisplay to show reviewer_name when available
UPDATE public.reviews 
SET reviewer_name = 'عميل محقق' 
WHERE reviewer_name IS NULL;