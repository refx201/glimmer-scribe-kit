-- Update profiles table to ensure we have display names
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Create a function to get testimonials with user profiles
CREATE OR REPLACE FUNCTION public.get_customer_testimonials(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  rating INTEGER,
  comment TEXT,
  created_at TIMESTAMPTZ,
  user_name TEXT,
  user_avatar TEXT,
  user_location TEXT,
  product_name TEXT,
  helpful_count INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.rating,
    r.comment,
    r.created_at,
    COALESCE(p.display_name, p.full_name, 'مستخدم مجهول') as user_name,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' as user_avatar,
    'فلسطين' as user_location,
    pr.name as product_name,
    r.helpful_count
  FROM reviews r
  LEFT JOIN profiles p ON r.user_id = p.id
  LEFT JOIN products pr ON r.product_id = pr.id
  WHERE r.rating >= 4
  ORDER BY r.created_at DESC, r.helpful_count DESC
  LIMIT limit_count;
END;
$$;

-- Insert some sample testimonials if the reviews table is empty
DO $$
DECLARE
  review_count INTEGER;
  sample_user_id UUID;
  sample_product_id UUID;
BEGIN
  -- Check if we have any reviews
  SELECT COUNT(*) INTO review_count FROM reviews;
  
  IF review_count = 0 THEN
    -- Get a sample user (or create one)
    SELECT id INTO sample_user_id FROM profiles LIMIT 1;
    
    -- Get a sample product
    SELECT id INTO sample_product_id FROM products LIMIT 1;
    
    IF sample_user_id IS NOT NULL AND sample_product_id IS NOT NULL THEN
      -- Insert sample reviews
      INSERT INTO reviews (user_id, product_id, rating, comment, helpful_count, created_at) VALUES
      (sample_user_id, sample_product_id, 5, 'أفضل تجربة شراء هواتف مررت بها. الخدمة سريعة والفريق محترف جداً. وصلني الجهاز خلال 24 ساعة والجودة ممتازة. أنصح الجميع بـ ProCell!', 23, NOW() - INTERVAL '2 weeks'),
      (sample_user_id, sample_product_id, 5, 'جودة الأجهزة ممتازة والأسعار منافسة جداً. تعامل محترم وخدمة ما بعد البيع رائعة. حصلت على ضمان شامل وشرح مفصل للميزات.', 31, NOW() - INTERVAL '5 days'),
      (sample_user_id, sample_product_id, 5, 'طلبت من التطبيق ووصلني الجهاز في نفس اليوم! تجربة سهلة ومضمونة. الباقة المجمعة وفرت علي مبلغ كبير. شكراً لفريق ProCell الرائع.', 18, NOW() - INTERVAL '3 days');
    END IF;
  END IF;
END;
$$;