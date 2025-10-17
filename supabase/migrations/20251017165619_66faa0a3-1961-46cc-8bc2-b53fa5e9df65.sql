-- Create suppliers table
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  logo_url TEXT,
  logo_color TEXT NOT NULL DEFAULT 'bg-blue-500',
  brands JSONB DEFAULT '[]'::jsonb,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.suppliers
  FOR SELECT USING (is_active = true);

CREATE POLICY "Enable all operations for authenticated users" ON public.suppliers
  FOR ALL USING (true) WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert existing suppliers from the website
INSERT INTO public.suppliers (name, name_en, category, description, logo_url, logo_color, brands, display_order) VALUES
('سوبرلينك', 'SUPERLINK', 'الموردين المتخصصين', 'كوكيل رسمي لشركة SUPERLINK و TECNO، نوفر لكم حلول متكاملة على منتجاتك لضمان الحصول على أفضل الأسعار والجودة', NULL, 'bg-teal-500', '["SUPERLINK", "TECNO"]', 1),
('سيلافينيو', 'CELLAVENUE', 'الموردين المتخصصين', 'للحصول على أفضل أسعار CELLAVENUE وكل Honorو باقي العلامات التجارية الأخرى، نضمن لكم أفضل الأسعار والخدمة', NULL, 'bg-blue-500', '["CELLAVENUE", "Honor"]', 2),
('آيسل بكس', 'ICELLPEX', 'مورد متعدد العلامات', 'كمورد شامل 4 علامات تجارية مختلفة بما في ذلك ICELLPEX نشتري من Infinix و iPhone و Samsung و Xiaomi', NULL, 'bg-orange-500', '["Xiaomi", "Samsung", "iPhone", "Infinix"]', 3),
('سولوتيك', 'SOLOTECH', 'شريك استراتيجي', 'كشريك استراتيجي جوهري 4 علامات تجارية راندة بأفضل أسعار السعة SOLOTECH نشتري من Iqoo و OUKITEL و REALME و OPPO', NULL, 'bg-purple-500', '["OPPO", "REALME", "OUKITEL", "Iqoo"]', 4);