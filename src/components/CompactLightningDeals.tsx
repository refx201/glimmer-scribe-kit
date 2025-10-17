import { memo, useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Flame, Bolt, Zap } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { supabase } from '@/lib/supabase';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from './ui/carousel';

interface CompactLightningDealsProps {
  onNavigate?: (page: 'product', productId?: string) => void;
}

const CompactLightningDeals = memo(({ onNavigate }: CompactLightningDealsProps) => {
  const [hotSaleProducts, setHotSaleProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchHotSaleProducts();
  }, []);

  const fetchHotSaleProducts = async () => {
    try {
      // Fetch ALL hot sale products (no limit)
      const { data: pinnedData, error: pinnedError } = await supabase
        .from('products')
        .select('id, name, sale_price, original_price, image, discount, is_hot_sale, featured_order')
        .eq('is_hot_sale', true)
        .not('featured_order', 'is', null)
        .order('featured_order', { ascending: true });

      if (pinnedError) throw pinnedError;

      // Fetch all non-pinned hot sale products (removed limit)
      const { data: regularData, error: regularError } = await supabase
        .from('products')
        .select('id, name, sale_price, original_price, image, discount, is_hot_sale, featured_order')
        .eq('is_hot_sale', true)
        .is('featured_order', null);

      if (regularError) throw regularError;

      // Combine: pinned first, then regular
      setHotSaleProducts([...(pinnedData || []), ...(regularData || [])]);
    } catch (error) {
      console.error('Error:', error);
      setHotSaleProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (!api) return;

    const startAutoScroll = () => {
      intervalRef.current = setInterval(() => {
        api.scrollNext();
      }, 4000); // Auto-scroll every 4 seconds
    };

    startAutoScroll();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [api]);

  return (
    <section className="py-8 bg-gradient-to-r from-red-50 to-orange-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-3">
            <Flame className="h-4 w-4 ml-1" />
            عروض البرق
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🔥 عروض حصرية بخصومات مميزة
          </h2>
          <p className="text-gray-600">
            خصومات تصل لـ 20% - كمية محدودة
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">جاري تحميل العروض...</p>
          </div>
        ) : hotSaleProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">لا توجد عروض برق متاحة حالياً</p>
          </div>
        ) : (
          <div className="relative px-12">
            <Carousel
              setApi={setApi}
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {hotSaleProducts.map((product) => (
                <CarouselItem key={product.id} className="md:basis-1/3">
                    <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white text-center py-3">
                        <CardTitle className="text-sm font-semibold flex items-center justify-center">
                          <Bolt className="h-4 w-4 ml-1" />
                          عرض البرق
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="p-3 flex-1 flex flex-col">
                        <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-gray-50">
                          <ImageWithFallback
                            src={product.image || '/placeholder.svg'}
                            alt={product.name || ''}
                            className="w-full h-full object-contain p-2"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        
                        <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 leading-tight">
                          {product.name || 'منتج'}
                        </h3>
                        
                        <div className="mb-3 flex-1">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <span className="text-lg font-bold text-red-600">
                              {(product.sale_price || 0).toLocaleString()} ₪
                            </span>
                            {product.original_price && product.original_price > product.sale_price && (
                              <span className="text-sm text-gray-400 line-through">
                                {product.original_price.toLocaleString()} ₪
                              </span>
                            )}
                          </div>
                          {product.discount > 0 && (
                            <div className="text-center">
                              <div className="text-red-600 font-semibold text-xs mb-2">
                                خصم {product.discount}%
                              </div>
                              <Progress 
                                value={75} 
                                className="h-2"
                              />
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          onClick={() => onNavigate?.('product', product.id)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 mt-auto"
                        >
                          <Zap className="h-3 w-3 ml-1" />
                          اطلب الآن
                        </Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
});

CompactLightningDeals.displayName = 'CompactLightningDeals';

export { CompactLightningDeals };