import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useCart } from '../lib/cart-context';
import { supabase } from '@/lib/supabase';
import { 
  Star, 
  ShoppingCart, 
  Heart,
  Share2,
  Shield,
  Truck,
  Package as PackageIcon,
  CheckCircle,
  ArrowLeft,
  Percent,
  Sparkles,
  Box
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PackageProduct {
  product_id: string;
  selected_color?: string;
  products: {
    id: string;
    name: string;
    image: string;
    sale_price: number;
    original_price: number;
    specifications?: any;
  };
}

interface PackageData {
  id: string;
  name: string;
  description: string;
  image: string;
  original_price: number;
  sale_price: number;
  discount: number;
  brand_id?: string;
  is_hot_sale: boolean;
  package_products: PackageProduct[];
}

const PackageDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    if (id) {
      fetchPackageDetails();
    }
  }, [id]);

  const fetchPackageDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('packages' as any)
        .select(`
          *,
          package_products (
            product_id,
            selected_color,
            products (
              id,
              name,
              image,
              sale_price,
              original_price,
              specifications
            )
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setPackageData(null);
        return;
      }

      setPackageData(data);
      setMainImage(data.image);
    } catch (error) {
      console.error('Error fetching package:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل تفاصيل الباقة',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!packageData) return;

    addItem({
      productId: packageData.id,
      name: packageData.name,
      price: packageData.sale_price,
      originalPrice: packageData.original_price,
      discount: packageData.discount,
      image: packageData.image,
      brandId: packageData.brand_id, // Include brand ID for promo codes
      maxStock: 10,
      quantity: 1,
    });

    toast({
      title: 'تمت الإضافة',
      description: 'تم إضافة الباقة إلى السلة',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <h2 className="text-2xl font-bold mb-4">الباقة غير موجودة</h2>
        <Button onClick={() => navigate('/')}>العودة للرئيسية</Button>
      </div>
    );
  }

  const savings = packageData.original_price - packageData.sale_price;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          العودة
        </Button>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Left Side - Images */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              {packageData.is_hot_sale && (
                <Badge className="absolute top-4 right-4 z-10 bg-red-600 text-white">
                  <Sparkles className="h-3 w-3 ml-1" />
                  عرض ساخن
                </Badge>
              )}
              {packageData.discount > 0 && (
                <Badge className="absolute top-4 left-4 z-10 bg-red-600 text-white">
                  <Percent className="h-3 w-3 ml-1" />
                  {packageData.discount}%
                </Badge>
              )}
              <img
                src={mainImage}
                alt={packageData.name}
                className="w-full aspect-square object-cover"
              />
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="text-center p-3">
                <Shield className="h-6 w-6 mx-auto text-green-600 mb-1" />
                <p className="text-xs font-medium">ضمان أصلي</p>
              </Card>
              <Card className="text-center p-3">
                <Truck className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                <p className="text-xs font-medium">توصيل مجاني</p>
              </Card>
              <Card className="text-center p-3">
                <CheckCircle className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                <p className="text-xs font-medium">جودة مضمونة</p>
              </Card>
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2 bg-purple-600">
                <Box className="h-3 w-3 ml-1" />
                باقة متكاملة
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {packageData.name}
              </h1>
              {packageData.description && (
                <p className="text-gray-600 leading-relaxed">
                  {packageData.description}
                </p>
              )}
            </div>

            <Separator />

            {/* Price Section */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-red-600">
                  ₪{packageData.sale_price.toLocaleString()}
                </span>
                {packageData.original_price > packageData.sale_price && (
                  <span className="text-xl text-gray-400 line-through">
                    ₪{packageData.original_price.toLocaleString()}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <CheckCircle className="h-4 w-4" />
                  <span>وفر ₪{savings.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Package Products */}
            {packageData.package_products && packageData.package_products.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <PackageIcon className="h-5 w-5 text-primary" />
                  المنتجات المشمولة في الباقة
                </h3>
                <div className="space-y-2">
                  {packageData.package_products.map((item, index) => (
                    <Card 
                      key={index} 
                      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/product/${item.products.id}`)}
                    >
                      <div className="flex items-center gap-4">
                        {item.products?.image && (
                          <img
                            src={item.products.image}
                            alt={item.products?.name}
                            className="h-16 w-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-base mb-1">
                            {item.products?.name || 'منتج'}
                          </p>
                          {item.selected_color && (
                            <Badge variant="outline" className="text-xs mb-1">
                              اللون: {item.selected_color}
                            </Badge>
                          )}
                          {item.products?.specifications?.description && (
                            <p className="text-xs text-gray-500 line-clamp-1">
                              {item.products.specifications.description}
                            </p>
                          )}
                        </div>
                        <div className="text-left">
                          {item.products?.sale_price && (
                            <>
                              <p className="text-base font-bold text-primary">
                                ₪{item.products.sale_price}
                              </p>
                              {item.products?.original_price && item.products.original_price > item.products.sale_price && (
                                <p className="text-xs text-gray-400 line-through">
                                  ₪{item.products.original_price}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                  <p className="text-sm text-green-800 font-medium">
                    💰 القيمة الإجمالية للمنتجات: ₪{packageData.package_products.reduce((sum, item) => sum + (item.products?.sale_price || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    ✨ سعر الباقة: ₪{packageData.sale_price.toLocaleString()} - وفر ₪{savings.toLocaleString()}!
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg py-6 shadow-lg"
              >
                <ShoppingCart className="h-5 w-5 ml-2" />
                أضف الباقة للسلة
              </Button>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                >
                  <Heart className="h-4 w-4" />
                  أضف للمفضلة
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  مشاركة
                </Button>
              </div>
            </div>

            {/* Features */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>ضمان سنة كاملة</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>توصيل مجاني لجميع المحافظات</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>إمكانية الإرجاع خلال 7 أيام</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>خدمة عملاء 24/7</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailPage;
