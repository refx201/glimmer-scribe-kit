-- Add description column to sliding_photos table
ALTER TABLE sliding_photos ADD COLUMN IF NOT EXISTS description text;

-- Update the insert_sliding_photo function to include description
CREATE OR REPLACE FUNCTION public.insert_sliding_photo(
  photo_title text,
  photo_image_url text,
  photo_is_active boolean,
  photo_link text DEFAULT NULL,
  photo_description text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO sliding_photos (title, image_url, is_active, link, description, created_at, updated_at)
  VALUES (photo_title, photo_image_url, photo_is_active, photo_link, photo_description, now(), now())
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$function$;

-- Update the update_sliding_photo function to include description
CREATE OR REPLACE FUNCTION public.update_sliding_photo(
  photo_id uuid,
  photo_title text,
  photo_image_url text,
  photo_is_active boolean,
  photo_link text DEFAULT NULL,
  photo_description text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE sliding_photos 
  SET 
    title = photo_title,
    image_url = photo_image_url,
    is_active = photo_is_active,
    link = photo_link,
    description = photo_description,
    updated_at = now()
  WHERE id = photo_id;
  
  RETURN FOUND;
END;
$function$;