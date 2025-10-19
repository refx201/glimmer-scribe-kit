-- Create trade_in_testimonials table
CREATE TABLE IF NOT EXISTS public.trade_in_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  avatar_url TEXT,
  comment TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  device_traded TEXT,
  device_received TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.trade_in_testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public read access for active testimonials
CREATE POLICY "Enable read access for active testimonials"
ON public.trade_in_testimonials
FOR SELECT
USING (is_active = true);

-- Allow authenticated users full access
CREATE POLICY "Enable all operations for authenticated users"
ON public.trade_in_testimonials
FOR ALL
USING (true)
WITH CHECK (true);

-- Create updated_at trigger
CREATE TRIGGER update_trade_in_testimonials_updated_at
  BEFORE UPDATE ON public.trade_in_testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();