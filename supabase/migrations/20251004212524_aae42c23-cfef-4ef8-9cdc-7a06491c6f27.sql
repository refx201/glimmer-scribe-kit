-- Create service_requests table
CREATE TABLE public.service_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_type TEXT NOT NULL, -- 'additional_services' or 'repair_services'
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  device_info TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Allow public to insert requests
CREATE POLICY "Anyone can submit service requests"
ON public.service_requests
FOR INSERT
WITH CHECK (true);

-- Allow reading all requests
CREATE POLICY "Anyone can view service requests"
ON public.service_requests
FOR SELECT
USING (true);

-- Allow updating requests
CREATE POLICY "Anyone can update service requests"
ON public.service_requests
FOR UPDATE
USING (true);

-- Allow deleting requests
CREATE POLICY "Anyone can delete service requests"
ON public.service_requests
FOR DELETE
USING (true);