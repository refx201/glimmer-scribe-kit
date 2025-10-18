import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface OfferProduct {
  id: string;
  name: string;
  brand: string;
  brandId?: string; // Add brandId for promo code validation
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  image: string;
  features: string[];
  category?: string;
  stock?: number;
  timeLeft?: string;
  isLimitedTime?: boolean;
  isDaily?: boolean;
  isBundle?: boolean;
  items?: string[];
  savings?: number;
  filter_category_id?: string | null;
}

export interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
}

export function useOffersData() {
  const [products, setProducts] = useState<OfferProduct[]>([]);
  const [packages, setPackages] = useState<OfferProduct[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffersData = async () => {
      try {
        setLoading(true);

        // Fetch featured products first (ordered by featured_order)
        const { data: featuredProducts, error: featuredProductsError } = await supabase
          .from('products')
          .select(`
            id,
            name,
            brand_id,
            filter_category_id,
            sale_price,
            original_price,
            discount,
            image,
            is_featured,
            is_hot_sale,
            type,
            colors,
            specifications,
            featured_order,
            brands (
              name,
              logo_url
            )
          `)
          .eq('is_featured', true)
          .not('featured_order', 'is', null)
          .order('featured_order', { ascending: true });

        if (featuredProductsError) throw featuredProductsError;

        // Fetch non-featured products
        const { data: regularProducts, error: regularProductsError } = await supabase
          .from('products')
          .select(`
            id,
            name,
            brand_id,
            filter_category_id,
            sale_price,
            original_price,
            discount,
            image,
            is_featured,
            is_hot_sale,
            type,
            colors,
            specifications,
            featured_order,
            brands (
              name,
              logo_url
            )
          `)
          .or('is_featured.is.null,is_featured.eq.false')
          .order('created_at', { ascending: false });

        if (regularProductsError) throw regularProductsError;

        // Combine: featured first, then regular
        const productsData = [...(featuredProducts || []), ...(regularProducts || [])];

        // Fetch featured packages first (ordered by featured_order)
        const { data: featuredPackages, error: featuredPackagesError } = await supabase
          .from('packages')
          .select(`
            id,
            name,
            sale_price,
            original_price,
            discount,
            image,
            description,
            is_hot_sale,
            is_featured,
            featured_order,
            package_products (
              product_id,
              products (
                name
              )
            )
          `)
          .eq('is_featured', true)
          .not('featured_order', 'is', null)
          .order('featured_order', { ascending: true });

        if (featuredPackagesError) throw featuredPackagesError;

        // Fetch non-featured packages
        const { data: regularPackages, error: regularPackagesError } = await supabase
          .from('packages')
          .select(`
            id,
            name,
            sale_price,
            original_price,
            discount,
            image,
            description,
            is_hot_sale,
            is_featured,
            featured_order,
            package_products (
              product_id,
              products (
                name
              )
            )
          `)
          .or('is_featured.is.null,is_featured.eq.false')
          .order('created_at', { ascending: false });

        if (regularPackagesError) throw regularPackagesError;

        // Combine: featured first, then regular
        const packagesData = [...(featuredPackages || []), ...(regularPackages || [])];

        // Fetch brands
        const { data: brandsData, error: brandsError } = await supabase
          .from('brands')
          .select('id, name, logo_url')
          .order('display_order', { ascending: true });

        if (brandsError) throw brandsError;

        // Transform products data
        const transformedProducts: OfferProduct[] = (productsData || []).map((product, index) => ({
          id: product.id || `product-${index + 1}`,
          name: product.name,
          brand: (product as any).brands?.name || 'Unknown',
          brandId: (product as any).brand_id, // Include brand_id for promo codes
          price: product.sale_price,
          originalPrice: product.original_price,
          discount: product.discount,
          rating: 4.5 + Math.random() * 0.4, // Generate random rating between 4.5-4.9
          reviews: Math.floor(Math.random() * 300) + 50, // Generate random review count
          image: product.image || `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center`,
          features: [
            ...((product.specifications as any)?.features || []),
            ...(product.colors && Array.isArray(product.colors) ? [`${product.colors.length} ألوان متاحة`] : [])
          ].slice(0, 3),
          category: product.type === 'device' ? 'هواتف ذكية' : 'إكسسوارات',
          stock: Math.floor(Math.random() * 50) + 5,
          isLimitedTime: product.is_hot_sale,
          timeLeft: product.is_hot_sale ? `${Math.floor(Math.random() * 5) + 1}h ${Math.floor(Math.random() * 59)}m` : undefined,
          filter_category_id: (product as any).filter_category_id || null
        }));

        // Transform packages data
        const transformedPackages: OfferProduct[] = (packagesData || []).map((pkg, index) => ({
          id: pkg.id || `package-${index + 1000}`,
          name: pkg.name,
          brand: 'باقة',
          price: pkg.sale_price,
          originalPrice: pkg.original_price,
          discount: pkg.discount,
          rating: 4.6 + Math.random() * 0.3,
          reviews: Math.floor(Math.random() * 150) + 30,
          image: pkg.image || `https://images.unsplash.com/photo-1592286049617-3feb4da2681e?w=400&h=400&fit=crop&crop=center`,
          features: ['باقة متكاملة', 'توفير مضمون', 'جودة عالية'],
          isBundle: true,
          items: pkg.package_products?.map(pp => (pp.products as any)?.name).filter(Boolean) || [],
          savings: pkg.original_price - pkg.sale_price
        }));

        setProducts(transformedProducts);
        setPackages(transformedPackages);
        setBrands(brandsData || []);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch offers data');
        console.error('Error fetching offers data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffersData();
  }, []);

  // Categorize products - preserve order (pinned first, then rest)
  const flashDeals = products.filter(p => p.isLimitedTime);
  const dailyDeals = products.filter(p => p.discount > 10 && !p.isLimitedTime);
  const bundleDeals = packages;
  const devicesData = products.filter(p => p.category === 'هواتف ذكية' || p.category?.includes('تابلت'));
  const accessoriesData = products.filter(p => p.category === 'إكسسوارات' || p.category?.includes('سماعات') || p.category?.includes('شواحن'));

  return { 
    products,
    packages,
    brands,
    flashDeals,
    dailyDeals,
    bundleDeals,
    devicesData,
    accessoriesData,
    loading, 
    error 
  };
}