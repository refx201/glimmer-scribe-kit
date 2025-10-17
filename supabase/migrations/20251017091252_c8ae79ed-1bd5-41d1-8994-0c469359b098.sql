-- Add button fields to sliding_photos table
ALTER TABLE sliding_photos
ADD COLUMN IF NOT EXISTS button1_text text,
ADD COLUMN IF NOT EXISTS button1_link text,
ADD COLUMN IF NOT EXISTS button2_text text,
ADD COLUMN IF NOT EXISTS button2_link text;

-- Update existing records with default values
UPDATE sliding_photos
SET button1_text = 'تسوق الان',
    button1_link = '/products',
    button2_text = 'تواصل معنا',
    button2_link = '/contact'
WHERE button1_text IS NULL;