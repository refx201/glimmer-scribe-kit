-- Create payment_method_images table
CREATE TABLE public.payment_method_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.payment_method_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.payment_method_images
  FOR SELECT USING (is_active = true);

-- Allow authenticated users full access
CREATE POLICY "Allow authenticated full access" ON public.payment_method_images
  FOR ALL USING (true) WITH CHECK (true);

-- Create stat_boxes table
CREATE TABLE public.stat_boxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL,
  label TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT DEFAULT 'text-green-600',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS  
ALTER TABLE public.stat_boxes ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.stat_boxes
  FOR SELECT USING (is_active = true);

-- Allow authenticated users full access
CREATE POLICY "Allow authenticated full access" ON public.stat_boxes
  FOR ALL USING (true) WITH CHECK (true);

-- Create product_filter_categories table
CREATE TABLE public.product_filter_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('device', 'accessory')),
  icon TEXT DEFAULT 'Smartphone',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.product_filter_categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.product_filter_categories
  FOR SELECT USING (is_active = true);

-- Allow authenticated users full access
CREATE POLICY "Allow authenticated full access" ON public.product_filter_categories
  FOR ALL USING (true) WITH CHECK (true);

-- Insert default device categories
INSERT INTO public.product_filter_categories (name, type, icon, display_order) VALUES
  ('الهواتف الذكية', 'device', 'Smartphone', 1),
  ('التابلت', 'device', 'Tablet', 2);

-- Insert default accessory categories
INSERT INTO public.product_filter_categories (name, type, icon, display_order) VALUES
  ('سماعات', 'accessory', 'Headphones', 1),
  ('شواحن', 'accessory', 'Battery', 2),
  ('ساعات ذكية', 'accessory', 'Watch', 3);

-- Insert default stat boxes
INSERT INTO public.stat_boxes (number, label, icon, color, display_order) VALUES
  ('500+', 'شراكة نشطة', 'Users', 'text-green-600', 1),
  ('15%', 'عمولة تصويق', 'Percent', 'text-orange-500', 2),
  ('2,500+', 'متوسط الربح', 'TrendingUp', 'text-green-600', 3),
  ('24/7', 'دعم مستمر', 'HeadphonesIcon', 'text-blue-600', 4);

-- Insert default payment methods
INSERT INTO public.payment_method_images (name, image_url, display_order) VALUES
  ('فيزا', '', 1),
  ('ماستركارد', '', 2),
  ('PALPAY', '../assets/40bde209c2063617cd7dc0e28a131725d888ae78.png', 3),
  ('تحويل بنكي', '', 4),
  ('دفع عند الاستلام', '', 5);

-- Create update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_method_images_updated_at BEFORE UPDATE ON public.payment_method_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stat_boxes_updated_at BEFORE UPDATE ON public.stat_boxes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_filter_categories_updated_at BEFORE UPDATE ON public.product_filter_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();