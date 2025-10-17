-- Create commission levels table
CREATE TABLE IF NOT EXISTS public.commission_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  examples TEXT NOT NULL,
  commission TEXT NOT NULL,
  calculation TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'bg-blue-500',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.commission_levels ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON public.commission_levels
  FOR SELECT USING (is_active = true);

-- Create policies for authenticated users (admins) to manage
CREATE POLICY "Enable all operations for authenticated users" ON public.commission_levels
  FOR ALL USING (true) WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_commission_levels_updated_at
  BEFORE UPDATE ON public.commission_levels
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default commission levels
INSERT INTO public.commission_levels (category, examples, commission, calculation, color, display_order) VALUES
  ('الفئة الاقتصادية', 'Infinix Smart, Realme C Series', '4%', 'من السعر النهائي', 'bg-green-500', 1),
  ('الفئة المتوسطة', 'Redmi Note, Galaxy A, Realme Narzo', '3%', 'من السعر النهائي', 'bg-blue-500', 2),
  ('الفئة العالية (Flagship)', 'iPhone, Samsung S/Note Series', '2%', 'من السعر النهائي', 'bg-purple-500', 3),
  ('الإكسسوارات والبندلات', 'كفرات، شواحن، سماعات، Bundles', '5-10 ₪', 'لكل قطعة أو مجموعة', 'bg-orange-500', 4),
  ('خدمات الصيانة', 'تغيير شاشة، بطارية، صيانة عامة', '10 ₪', 'لكل إحالة تمت خدمتها', 'bg-teal-500', 5),
  ('إحالة تاجر/شريك جديد', 'متجر يبيع أو يطلب أول مرة من خلالك', '15-25 ₪', 'بعد أول طلب فعلي', 'bg-procell-accent', 6);