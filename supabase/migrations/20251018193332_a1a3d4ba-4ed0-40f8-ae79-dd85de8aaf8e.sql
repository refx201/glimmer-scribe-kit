-- Add page column to stat_boxes table
ALTER TABLE stat_boxes ADD COLUMN IF NOT EXISTS page text NOT NULL DEFAULT 'home';

-- Add comment to explain the column
COMMENT ON COLUMN stat_boxes.page IS 'Page where the stat box appears: home, trade_in, purchase, maintenance';

-- Update existing records to home page
UPDATE stat_boxes SET page = 'home' WHERE page IS NULL OR page = '';