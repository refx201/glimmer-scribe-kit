-- Create maintenance_services table
CREATE TABLE IF NOT EXISTS public.maintenance_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  price TEXT NOT NULL,
  time TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  rating NUMERIC(2,1) DEFAULT 4.5,
  reviews INTEGER DEFAULT 0,
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.maintenance_services ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" 
ON public.maintenance_services 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Enable all operations for authenticated users" 
ON public.maintenance_services 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_maintenance_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_maintenance_services_updated_at
BEFORE UPDATE ON public.maintenance_services
FOR EACH ROW
EXECUTE FUNCTION public.update_maintenance_services_updated_at();