-- Drop all existing policies for user_points
DROP POLICY IF EXISTS "Allow authenticated to manage points" ON user_points;
DROP POLICY IF EXISTS "Allow authenticated to read all points" ON user_points;
DROP POLICY IF EXISTS "Users can view their own points" ON user_points;
DROP POLICY IF EXISTS "Allow authenticated users to read all points" ON user_points;
DROP POLICY IF EXISTS "Allow authenticated users to insert points" ON user_points;
DROP POLICY IF EXISTS "Allow authenticated users to update points" ON user_points;
DROP POLICY IF EXISTS "Allow authenticated users to delete points" ON user_points;

-- Create new policies with unique names
CREATE POLICY "authenticated_read_points"
  ON user_points
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "authenticated_insert_points"
  ON user_points
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "authenticated_update_points"
  ON user_points
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "authenticated_delete_points"
  ON user_points
  FOR DELETE
  TO authenticated
  USING (true);

-- Drop all existing policies for user_points_history
DROP POLICY IF EXISTS "Allow authenticated to manage history" ON user_points_history;
DROP POLICY IF EXISTS "Users can view their own history" ON user_points_history;
DROP POLICY IF EXISTS "Allow authenticated users to manage history" ON user_points_history;

-- Create new policies for history with unique names
CREATE POLICY "authenticated_manage_history"
  ON user_points_history
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);