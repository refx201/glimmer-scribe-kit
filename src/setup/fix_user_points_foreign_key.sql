-- FIX USER POINTS FOREIGN KEY TO REFERENCE PROFILES
-- Run this SQL in your Supabase SQL Editor AFTER running profiles_setup.sql

-- First, drop the existing foreign key constraint on user_points
ALTER TABLE user_points 
DROP CONSTRAINT IF EXISTS user_points_user_id_fkey;

-- Now add the foreign key to reference profiles instead of auth.users
ALTER TABLE user_points
ADD CONSTRAINT user_points_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Ensure all users have a profile entry
INSERT INTO profiles (id, email, full_name)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', email) as full_name
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Success message
SELECT 'User points foreign key fixed successfully! Now points reference profiles.' as status;
