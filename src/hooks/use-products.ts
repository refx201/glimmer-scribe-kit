import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface DatabaseProduct {
  id: string;
  name: string;
  sale_price: number;
  original_price: number;
  discount: number;
  image: string | null;
  is_featured: boolean;
  is_hot_sale: boolean;
  brand_id: string | null;
  type: string;
  colors: any;
  specifications: any;
}

export function useProducts() {
  const [products, setProducts] = useState<DatabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch featured products first (ordered by featured_order)
        const { data: featuredData, error: featuredError } = await supabase
          .from('products')
          .select(`
            id,
            name,
            sale_price,
            original_price,
            discount,
            image,
            is_featured,
            is_hot_sale,
            brand_id,
            type,
            colors,
            specifications,
            featured_order
          `)
          .eq('is_featured', true)
          .not('featured_order', 'is', null)
          .order('featured_order', { ascending: true });

        if (featuredError) throw featuredError;

        // Fetch non-featured products
        const { data: regularData, error: regularError } = await supabase
          .from('products')
          .select(`
            id,
            name,
            sale_price,
            original_price,
            discount,
            image,
            is_featured,
            is_hot_sale,
            brand_id,
            type,
            colors,
            specifications,
            featured_order
          `)
          .or('is_featured.is.null,is_featured.eq.false')
          .order('type', { ascending: true })
          .order('created_at', { ascending: false });

        if (regularError) throw regularError;

        // Combine: featured first, then regular
        setProducts([...(featuredData || []), ...(regularData || [])]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
}