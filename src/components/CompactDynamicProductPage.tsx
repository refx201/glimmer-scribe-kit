import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from '../lib/cart-context';
import { supabase } from '@/lib/supabase';
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
  Loader
} from 'lucide-react';
import type { PageType } from '../App';
import { RelatedProductsSection } from './product/RelatedProductsSection';

interface CompactDynamicProductPageProps {
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

export function CompactDynamicProductPage({ productId, onNavigate }: CompactDynamicProductPageProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const { addItem } = useCart();

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          brands (
            name,
            logo
          )
        `)
        .eq('id', productId)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        setError('حدث خطأ في تحميل المنتج');
      } else {
        setProduct(data);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('حدث خطأ في تحميل المنتج');
    } finally {
      setLoading(false);
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
  const displayRating = 4.3 + Math.random() * 0.6;
  const displayReviews = Math.floor(Math.random() * 200) + 50;
  const displayStock = Math.floor(Math.random() * 15) + 5;

  // Parse features and images from product data
  const features = (product.specifications?.features || []).slice(0, 5);
  const productImages = product.image ? [product.image] : ['/placeholder.svg'];

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
          <div className="space-y-4">
            {/* Main Image */}
            <Card className="overflow-hidden border-0 bg-white shadow-lg">
              <div className="relative aspect-square">
                <ImageWithFallback
                  src={productImages[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
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

                {/* Quick Actions */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`h-10 w-10 p-0 ${isFavorite ? 'bg-red-100 text-red-600' : 'bg-white/90'}`}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary" 
                    className="h-10 w-10 p-0 bg-white/90"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex gap-2">
                {productImages.map((image, index) => (
                  <Card 
                    key={index}
                    className={`cursor-pointer transition-all border-2 ${
                      selectedImageIndex === index 
                        ? 'border-blue-600 shadow-md' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <div className="aspect-square w-20">
                      <ImageWithFallback
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}
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

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
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

                {/* Technical Specifications */}
                {product.specifications?.description && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">المواصفات التقنية:</h3>
                    <div className="space-y-2">
                      {product.specifications.description.split('\n').map((spec: string, index: number) => {
                        if (!spec.trim()) return null;
                        const [label, value] = spec.split(':');
                        if (!label || !value) return null;
                        
                        return (
                          <div key={index} className="flex text-sm">
                            <span className="font-medium text-gray-900 ml-2">{label.trim()}:</span>
                            <span className="text-gray-600">{value.trim()}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <Separator className="my-4" />

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 text-lg font-semibold"
                  >
                    <ShoppingCart className="h-5 w-5 ml-2" />
                    أضف إلى السلة - {product.sale_price.toLocaleString()} ₪
                  </Button>
                  
                  <Button
                    onClick={() => {
                      const colorInfo = selectedColor ? `\n🎨 اللون: ${selectedColor.display_name}` : '';
                      const message = `🛒 *طلب شراء سريع*\n\n📱 المنتج: ${product.name}${colorInfo}\n📦 الكمية: 1\n💰 السعر: ${product.sale_price.toLocaleString()} ₪\n\n✅ أرغب في إتمام الطلب`;
                      window.open(`https://wa.me/972598366822?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                    variant="outline"
                    className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3"
                  >
                    اشتري الآن
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

            {/* Trust Indicators */}
            <Card className="border-0 bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">ضمان شامل</div>
                    <div className="text-xs text-gray-600">سنة كاملة</div>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Truck className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">توصيل سريع</div>
                    <div className="text-xs text-gray-600">خلال 24 ساعة</div>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Package className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">إرجاع مجاني</div>
                    <div className="text-xs text-gray-600">14 يوم</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">آراء العملاء</h2>
              <p className="text-gray-600">شاهد تجارب عملائنا مع هذا المنتج</p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <ReviewForm productId={productId} />
              </div>
              <div>
                <ReviewsDisplay productId={productId} />
              </div>
            </div>
          </div>
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