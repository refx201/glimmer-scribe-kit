-- Clean up sliding_photos RLS policies and ensure proper access
DROP POLICY IF EXISTS "Allow anyone to manage sliding photos" ON sliding_photos;
DROP POLICY IF EXISTS "Allow authenticated users to manage sliding photos" ON sliding_photos;
DROP POLICY IF EXISTS "Allow public read of active sliding photos" ON sliding_photos;
DROP POLICY IF EXISTS "Allow public read of sliding photos" ON sliding_photos;

-- Create clean, simple policies
CREATE POLICY "Public can view active slides"
  ON sliding_photos FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users full access"
  ON sliding_photos FOR ALL
  USING (true)
  WITH CHECK (true);

-- Ensure functions are working correctly
CREATE OR REPLACE FUNCTION public.insert_sliding_photo(
  photo_title text,
  photo_image_url text,
  photo_is_active boolean,
  photo_link text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO sliding_photos (title, image_url, is_active, link, created_at, updated_at)
  VALUES (photo_title, photo_image_url, photo_is_active, photo_link, now(), now())
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_sliding_photo(
  photo_id uuid,
  photo_title text,
  photo_image_url text,
  photo_is_active boolean,
  photo_link text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE sliding_photos 
  SET 
    title = photo_title,
    image_url = photo_image_url,
    is_active = photo_is_active,
    link = photo_link,
    updated_at = now()
  WHERE id = photo_id;
  
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_sliding_photo(photo_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM sliding_photos WHERE id = photo_id;
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.toggle_sliding_photo_active(
  photo_id uuid,
  new_active_state boolean
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE sliding_photos 
  SET 
    is_active = new_active_state,
    updated_at = now()
  WHERE id = photo_id;
  
  RETURN FOUND;
END;
$$;