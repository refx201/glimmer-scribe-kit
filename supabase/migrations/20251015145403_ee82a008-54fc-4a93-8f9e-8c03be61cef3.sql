-- Fix RLS policies for user_points to allow proper upsert operations
DROP POLICY IF EXISTS "Allow authenticated to manage points" ON user_points;
DROP POLICY IF EXISTS "Allow authenticated to read all points" ON user_points;
DROP POLICY IF EXISTS "Users can view their own points" ON user_points;

-- Create new comprehensive policies
CREATE POLICY "Allow authenticated users to read all points"
  ON user_points
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert points"
  ON user_points
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update points"
  ON user_points
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete points"
  ON user_points
  FOR DELETE
  TO authenticated
  USING (true);

-- Same for user_points_history
DROP POLICY IF EXISTS "Allow authenticated to manage history" ON user_points_history;
DROP POLICY IF EXISTS "Users can view their own history" ON user_points_history;

CREATE POLICY "Allow authenticated users to manage history"
  ON user_points_history
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);