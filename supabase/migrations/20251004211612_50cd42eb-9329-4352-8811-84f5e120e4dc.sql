-- Create device_evaluation_requests table for Purchase Page
CREATE TABLE public.device_evaluation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  storage TEXT NOT NULL,
  condition TEXT NOT NULL,
  accessories TEXT[] DEFAULT '{}',
  description TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_location TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.device_evaluation_requests ENABLE ROW LEVEL SECURITY;

-- Allow public to insert requests
CREATE POLICY "Anyone can submit device evaluation requests"
ON public.device_evaluation_requests
FOR INSERT
WITH CHECK (true);

-- Allow reading all requests (for admin)
CREATE POLICY "Anyone can view device evaluation requests"
ON public.device_evaluation_requests
FOR SELECT
USING (true);

-- Allow updating requests (for admin to change status)
CREATE POLICY "Anyone can update device evaluation requests"
ON public.device_evaluation_requests
FOR UPDATE
USING (true);

-- Allow deleting requests (for admin)
CREATE POLICY "Anyone can delete device evaluation requests"
ON public.device_evaluation_requests
FOR DELETE
USING (true);