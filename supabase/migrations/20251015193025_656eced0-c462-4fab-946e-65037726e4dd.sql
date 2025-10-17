-- Allow public read access to user_points so admin UI can display points without auth
-- Note: Policies are permissive (OR). This adds a public SELECT policy without affecting existing ones.

-- Ensure RLS is enabled (safe if already enabled)
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;

-- Create a permissive SELECT policy for public (anon)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'user_points' 
      AND policyname = 'Public can read user points'
  ) THEN
    CREATE POLICY "Public can read user points"
    ON public.user_points
    FOR SELECT
    TO public
    USING (true);
  END IF;
END $$;
