import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from '../lib/cart-context';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { ReviewForm } from './ReviewForm';
import { ReviewsDisplay } from './ReviewsDisplay';
import { ProductColorSelector } from './ProductColorSelector';
import { 
  Star, 
  ShoppingCart, 
  Heart,
  Share2,
  Shield,
  Truck,
  Package,
  CheckCircle,
  ArrowLeft,
  Eye,
  Percent,
  Sparkles,
  Award,
  Zap,
  Loader,
  User,
  Calendar,
  ThumbsUp,
  FileText,
  Settings,
  MessageSquare,
  Clock
} from 'lucide-react';
import type { PageType } from '../App';
import { RelatedProductsSection } from './product/RelatedProductsSection';
import { ProductImageGallery } from './product/ProductImageGallery';

interface TabbedProductPageProps {
  productId: string;
  onNavigate: (page: PageType, productId?: string) => void;
}

// Star Rating Component
function StarRating({ rating, size = 'default', showNumber = false }: { 
  rating: number; 
  size?: 'small' | 'default' | 'large';
  showNumber?: boolean;
}) {
  const sizeClasses = {
    small: 'h-3 w-3',
    default: 'h-4 w-4', 
    large: 'h-5 w-5'
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`${sizeClasses[size]} ${
              i < Math.floor(rating) 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`} 
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export function TabbedProductPage({ productId, onNavigate }: TabbedProductPageProps) {
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('specifications');
  const { addItem, openCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (productId) {
      fetchProduct();
      fetchReviews();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch product with brand and additional photos
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          brands (
            name,
            logo_url
          )
        `)
        .eq('id', productId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching product:', error);
        setError('حدث خطأ في تحميل المنتج');
      } else if (!data) {
        setError('المنتج غير موجود');
      } else {
        // Fetch additional photos from product_photos table
        const { data: photosData } = await supabase
          .from('product_photos')
          .select('photo_url')
          .eq('product_id', productId)
          .order('created_at', { ascending: true });
        
        const additionalPhotos = photosData?.map(p => p.photo_url) || [];
        setProduct({ ...data, additional_photos: additionalPhotos });
      }
    } catch (err) {
      console.error('Error:', err);
      setError('حدث خطأ في تحميل المنتج');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
      } else {
        setReviews(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      productId: product.id,
      name: product.name,
      price: product.sale_price,
      originalPrice: product.original_price,
      discount: product.discount,
      image: product.image || '',
      brandId: product.brand_id,
      color: selectedColor ? {
        name: selectedColor.display_name,
        value: selectedColor.hex
      } : undefined,
      maxStock: 10,
      quantity: 1
    });
    
    toast({
      title: '✅ تمت الإضافة للسلة!',
      description: `تم إضافة ${product.name} إلى سلة التسوق`,
      duration: 3000,
    });
    
    openCart();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل المنتج...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              المنتج غير موجود
            </h2>
            <p className="text-gray-600 mb-4">
              {error || 'لم نتمكن من العثور على هذا المنتج'}
            </p>
            <Button onClick={() => onNavigate('home')}>
              العودة للرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Generate rating and reviews for display
  const displayRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 4.3 + Math.random() * 0.6;
  const displayReviews = reviews.length || Math.floor(Math.random() * 200) + 50;
  const displayStock = Math.floor(Math.random() * 15) + 5;

  // Parse colors and features from product data
  const colors = product.colors || [{ name: 'اللون الافتراضي', value: '#6B7280' }];
  const features = (product.specifications?.features || []).slice(0, 5);
  const specifications = product.specifications || {};
  const additionalPhotos = product.additional_photos || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button 
          onClick={() => onNavigate('home')}
          variant="outline"
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 ml-2" />
          العودة للرئيسية
        </Button>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Product Images */}
          <div>
            <Card className="overflow-hidden border-0 bg-white shadow-lg p-4">
              <ProductImageGallery 
                mainImage={product.image || '/placeholder.svg'}
                additionalPhotos={additionalPhotos}
                productName={product.name}
              />
              
              {/* Badges */}
              <div className="flex gap-2 mt-4 flex-wrap">
                {product.discount > 0 && (
                  <Badge className="bg-red-600 text-white">
                    <Percent className="h-3 w-3 ml-1" />
                    خصم {product.discount}%
                  </Badge>
                )}
                {product.is_featured && (
                  <Badge className="bg-green-600 text-white">
                    <Zap className="h-3 w-3 ml-1" />
                    مميز
                  </Badge>
                )}
                {product.is_hot_sale && (
                  <Badge className="bg-orange-600 text-white">
                    <Sparkles className="h-3 w-3 ml-1" />
                    عرض ساخن
                  </Badge>
                )}
              </div>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <Card className="border-0 bg-white shadow-lg">
              <CardContent className="p-6">
                {/* Header */}
                <div className="mb-4">
                  <span className="text-sm text-blue-600 font-medium">
                    {product.brands?.name || 'procell'}
                  </span>
                  <h1 className="text-2xl font-bold text-gray-900 mt-1 mb-3">
                    {product.name}
                  </h1>
                  
                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-4 mb-4">
                    <StarRating rating={displayRating} showNumber />
                    <span className="text-sm text-gray-600">({displayReviews} تقييم)</span>
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="h-3 w-3 ml-1" />
                      متوفر
                    </Badge>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Price Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-red-600">
                      {product.sale_price.toLocaleString()} ₪
                    </span>
                    {product.original_price > product.sale_price && (
                      <span className="text-lg text-gray-400 line-through">
                        {product.original_price.toLocaleString()} ₪
                      </span>
                    )}
                  </div>
                  {product.original_price > product.sale_price && (
                    <div className="text-lg font-medium text-green-600">
                      وفر {(product.original_price - product.sale_price).toLocaleString()} ₪
                    </div>
                  )}
                  <div className="text-sm text-gray-600 mt-1">
                    السعر شامل الضريبة والتوصيل
                  </div>
                </div>

                {/* Colors Selection */}
                {product.colors && Array.isArray(product.colors) && product.colors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">اختر اللون:</h3>
                    <ProductColorSelector
                      productColors={product.colors}
                      selectedColor={selectedColor}
                      onColorSelect={setSelectedColor}
                      size="md"
                      showLabels={true}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 text-lg font-semibold"
                  >
                    <ShoppingCart className="h-5 w-5 ml-2" />
                    أضف إلى السلة - {product.sale_price.toLocaleString()} ₪
                  </Button>
                </div>

                {/* Stock Info */}
                {displayStock <= 10 && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center text-orange-700">
                      <Sparkles className="h-4 w-4 ml-2" />
                      <span className="text-sm font-medium">
                        عجل! متبقي {displayStock} قطع فقط
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabbed Content Section */}
        <div className="mt-12">
          <Card className="border-0 bg-white shadow-lg">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
               <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg p-1">
                <TabsTrigger value="specifications" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  المواصفات
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  التقييمات
                </TabsTrigger>
                <TabsTrigger value="updates" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  تحديثات الطلبة
                </TabsTrigger>
              </TabsList>
              
              
              <TabsContent value="specifications" className="p-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">المواصفات التقنية</h3>
                  <div className="space-y-2">
                    {product.specifications?.description ? (
                      product.specifications.description.split('\n').map((spec: string, index: number) => {
                        if (!spec.trim()) return null;
                        const [label, value] = spec.split(':');
                        if (!label || !value) return null;
                        
                        return (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-900">{label.trim()}:</span>
                            <span className="text-gray-600">{value.trim()}</span>
                          </div>
                        );
                      })
                    ) : (
                      <>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-900">المعالج:</span>
                          <span className="text-gray-600">عالي الأداء</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-900">الذاكرة:</span>
                          <span className="text-gray-600">كبيرة الحجم</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-900">الشاشة:</span>
                          <span className="text-gray-600">عالية الدقة</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-900">البطارية:</span>
                          <span className="text-gray-600">طويلة المدى</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="p-6">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">تقييمات العملاء</h3>
                  
                  {/* Reviews Display Component */}
                  <ReviewsDisplay productId={productId} />
                  
                  {/* Review Form */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <ReviewForm productId={productId} />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="updates" className="p-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">تحديثات الطلبة</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">منتج متوفر للشحن الفوري</p>
                        <p className="text-sm text-green-700">يتم التوصيل خلال 24 ساعة داخل فلسطين</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-800">ضمان شامل لمدة سنة</p>
                        <p className="text-sm text-blue-700">يشمل الصيانة والاستبدال في حالة الأعطال</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <Truck className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-purple-800">توصيل مجاني</p>
                        <p className="text-sm text-purple-700">للطلبات فوق 200 شيكل داخل المحافظة</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <Package className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium text-orange-800">إمكانية الإرجاع خلال 14 يوم</p>
                        <p className="text-sm text-orange-700">في حالة عدم الرضا عن المنتج</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
      
      {/* Related Products Section */}
      <RelatedProductsSection 
        productId={productId} 
        onNavigate={onNavigate} 
      />
    </div>
  );
}