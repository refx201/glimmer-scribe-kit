-- Create trade_in_requests table
CREATE TABLE IF NOT EXISTS public.trade_in_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  condition TEXT NOT NULL,
  storage TEXT,
  accessories TEXT,
  estimated_price INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.trade_in_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "trade_in_requests_public_insert" 
ON public.trade_in_requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "trade_in_requests_public_select" 
ON public.trade_in_requests 
FOR SELECT 
USING (true);

CREATE POLICY "trade_in_requests_public_update" 
ON public.trade_in_requests 
FOR UPDATE 
USING (true);

CREATE POLICY "trade_in_requests_public_delete" 
ON public.trade_in_requests 
FOR DELETE 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_trade_in_requests_updated_at
BEFORE UPDATE ON public.trade_in_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();