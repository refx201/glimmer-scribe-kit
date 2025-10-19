-- Create maintenance_testimonials table
CREATE TABLE IF NOT EXISTS public.maintenance_testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  avatar_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.maintenance_testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies for maintenance_testimonials
CREATE POLICY "Enable all operations for authenticated users"
  ON public.maintenance_testimonials
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable read access for all users"
  ON public.maintenance_testimonials
  FOR SELECT
  USING (is_active = true);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_maintenance_testimonials_active ON public.maintenance_testimonials(is_active, display_order, created_at);