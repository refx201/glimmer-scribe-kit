-- Create partner success stories table
CREATE TABLE IF NOT EXISTS public.partner_success_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_name TEXT NOT NULL,
  partner_role TEXT NOT NULL,
  partner_image TEXT,
  revenue TEXT NOT NULL,
  revenue_label TEXT NOT NULL,
  testimonial TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  date TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.partner_success_stories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" 
ON public.partner_success_stories 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Enable all operations for authenticated users" 
ON public.partner_success_stories 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_partner_success_stories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_partner_success_stories_updated_at
BEFORE UPDATE ON public.partner_success_stories
FOR EACH ROW
EXECUTE FUNCTION public.update_partner_success_stories_updated_at();