-- Simple auto-confirmation trigger for new users
-- This will automatically confirm all new users without needing configuration changes

-- Create or replace function to auto-confirm users on signup
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Auto confirm email and phone for new users
  NEW.email_confirmed_at = COALESCE(NEW.email_confirmed_at, now());
  NEW.phone_confirmed_at = COALESCE(NEW.phone_confirmed_at, now());
  NEW.confirmed_at = COALESCE(NEW.confirmed_at, now());
  
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS auto_confirm_user_trigger ON auth.users;

-- Create trigger to auto-confirm all new users
CREATE TRIGGER auto_confirm_user_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_user();

-- Update existing unconfirmed users to be confirmed
UPDATE auth.users 
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  phone_confirmed_at = COALESCE(phone_confirmed_at, now()),
  confirmed_at = COALESCE(confirmed_at, now())
WHERE email_confirmed_at IS NULL OR confirmed_at IS NULL;