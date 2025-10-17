import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Package } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useCart } from '../lib/cart-context';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface PackageData {
  id: string;
  name: string;
  description?: string;
  image?: string;
  original_price: number;
  sale_price: number;
  discount: number;
  brand_id?: string;
  is_hot_sale: boolean;
  created_at: string;
}

export function CustomOrderForm() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('packages' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('فشل تحميل الباقات');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, pkg: PackageData) => {
    e.stopPropagation(); // Prevent card click navigation
    addItem({
      productId: pkg.id,
      name: pkg.name,
      price: pkg.sale_price,
      originalPrice: pkg.original_price,
      discount: pkg.discount,
      image: pkg.image || '',
      brandId: pkg.brand_id, // Include brand ID for promo codes
      maxStock: 999,
    });
    toast.success('تم إضافة الباقة إلى السلة');
  };

  return (
    <section className="py-12 bg-gradient-to-br from-purple-50 via-blue-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Package className="h-10 w-10 text-purple-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            📦 الباقات المميزة
          </h2>
          <p className="text-xl text-gray-600">
            باقات مخصصة بأسعار مميزة - اطلب باقتك الآن
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-20 w-20 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">لا توجد باقات متاحة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {packages.map((pkg) => (
              <Card 
                key={pkg.id}
                onClick={() => navigate(`/package/${pkg.id}`)}
                className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/40 bg-card cursor-pointer"
              >
                <CardContent className="p-0">
                  {/* Package Image */}
                  {pkg.image && (
                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        {pkg.is_hot_sale && (
                          <Badge className="bg-destructive text-destructive-foreground shadow-lg">
                            🔥 عرض ساخن
                          </Badge>
                        )}
                        {pkg.discount > 0 && (
                          <Badge className="bg-primary text-primary-foreground shadow-lg">
                            خصم {pkg.discount}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Package Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
                        {pkg.name}
                      </h3>
                      
                      {pkg.description && (
                        <p className="text-muted-foreground text-sm line-clamp-3">
                          {pkg.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-baseline gap-3">
                      <div className="text-3xl font-bold text-primary">
                        ₪{pkg.sale_price.toFixed(2)}
                      </div>
                      {pkg.discount > 0 && (
                        <div className="text-lg text-muted-foreground line-through">
                          ₪{pkg.original_price.toFixed(2)}
                        </div>
                      )}
                    </div>
                    
                    {/* Add to Cart Button */}
                    <Button
                      onClick={(e) => handleAddToCart(e, pkg)}
                      className="w-full font-bold py-6 group-hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <ShoppingCart className="h-5 w-5 ml-2" />
                      أضف إلى السلة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
