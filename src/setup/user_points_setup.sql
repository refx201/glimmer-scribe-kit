-- USER POINTS TABLE SETUP
-- Run this SQL in your Supabase SQL Editor

-- Create user_points table
CREATE TABLE IF NOT EXISTS user_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  points INTEGER DEFAULT 0 CHECK (points >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON user_points(user_id);

-- Enable RLS
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own points
CREATE POLICY "Users can view their own points"
  ON user_points
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow authenticated users to read all points (for display)
CREATE POLICY "Allow authenticated to read all points"
  ON user_points
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to manage points (admin functionality)
CREATE POLICY "Allow authenticated to manage points"
  ON user_points
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_user_points_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_points_updated_at
  BEFORE UPDATE ON user_points
  FOR EACH ROW
  EXECUTE FUNCTION update_user_points_updated_at();

-- Create points history table for tracking
CREATE TABLE IF NOT EXISTS user_points_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  points_change INTEGER NOT NULL,
  reason TEXT,
  admin_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on history
ALTER TABLE user_points_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own history"
  ON user_points_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated to manage history"
  ON user_points_history
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Success message
SELECT 'User points tables created successfully!' as status;
