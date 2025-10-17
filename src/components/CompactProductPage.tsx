import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from '../lib/cart-context';
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
  Zap
} from 'lucide-react';
import type { PageType } from '../App';

// Compact product data
const SAMPLE_PRODUCT = {
  id: "sample-product-1",
  name: 'iPhone 15 Pro Max - 256GB',
  brand: 'Apple',
  price: 3999,
  originalPrice: 4499,
  discount: 11,
  rating: 4.9,
  reviewsCount: 127,
  stockCount: 8,
  availability: 'متوفر',
  condition: 'جديد',
  warranty: 'سنة كاملة',
  colors: [
    { name: 'تيتانيوم طبيعي', value: '#8D8D93', available: true },
    { name: 'تيتانيوم أبيض', value: '#F2F2F7', available: true },
    { name: 'تيتانيوم أزرق', value: '#395B64', available: true }
  ],
  images: [
    'https://images.unsplash.com/photo-1592286049617-3feb4da2681e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop'
  ],
  description: 'iPhone 15 Pro Max الجديد بشريحة A17 Pro القوية. مصنوع من التيتانيوم خفيف الوزن مع تصميم أنيق ومميز.',
  keyFeatures: [
    'شريحة A17 Pro بتقنية 3 نانومتر',
    'كاميرا ثلاثية 48 ميجابكسل', 
    'شاشة Super Retina XDR مقاس 6.7 بوصة',
    'بطارية تدوم طوال اليوم',
    'مقاوم للماء IP68'
  ],
  tags: ['الأكثر مبيعاً', 'جديد', 'مميز', '5G'],
  category: 'هواتف ذكية'
};

interface CompactProductPageProps {
  onNavigate: (page: PageType) => void;
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

export function CompactProductPage({ onNavigate }: CompactProductPageProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(SAMPLE_PRODUCT.colors[0]);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addItem, openCart } = useCart();

  const handleAddToCart = () => {
    addItem({
      productId: String(SAMPLE_PRODUCT.id),
      name: SAMPLE_PRODUCT.name,
      price: SAMPLE_PRODUCT.price,
      originalPrice: SAMPLE_PRODUCT.originalPrice,
      discount: SAMPLE_PRODUCT.discount,
      image: SAMPLE_PRODUCT.images[0],
      maxStock: SAMPLE_PRODUCT.stockCount,
      quantity: 1
    });
  };

  const handleBuyNow = () => {
    addItem({
      productId: String(SAMPLE_PRODUCT.id),
      name: SAMPLE_PRODUCT.name,
      price: SAMPLE_PRODUCT.price,
      originalPrice: SAMPLE_PRODUCT.originalPrice,
      discount: SAMPLE_PRODUCT.discount,
      image: SAMPLE_PRODUCT.images[0],
      maxStock: SAMPLE_PRODUCT.stockCount,
      quantity: 1
    });
    openCart();
  };

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
                  src={SAMPLE_PRODUCT.images[selectedImageIndex]}
                  alt={SAMPLE_PRODUCT.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Badge className="bg-red-600 text-white">
                    <Percent className="h-3 w-3 ml-1" />
                    خصم {SAMPLE_PRODUCT.discount}%
                  </Badge>
                  <Badge className="bg-green-600 text-white">
                    <Zap className="h-3 w-3 ml-1" />
                    الأكثر مبيعاً
                  </Badge>
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
            <div className="flex gap-2">
              {SAMPLE_PRODUCT.images.map((image, index) => (
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
                      alt={`${SAMPLE_PRODUCT.name} ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <Card className="border-0 bg-white shadow-lg">
              <CardContent className="p-6">
                {/* Header */}
                <div className="mb-4">
                  <span className="text-sm text-blue-600 font-medium">{SAMPLE_PRODUCT.brand}</span>
                  <h1 className="text-2xl font-bold text-gray-900 mt-1 mb-3">
                    {SAMPLE_PRODUCT.name}
                  </h1>
                  
                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-4 mb-4">
                    <StarRating rating={SAMPLE_PRODUCT.rating} showNumber />
                    <span className="text-sm text-gray-600">({SAMPLE_PRODUCT.reviewsCount} تقييم)</span>
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="h-3 w-3 ml-1" />
                      {SAMPLE_PRODUCT.availability}
                    </Badge>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Price Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-red-600">
                      {SAMPLE_PRODUCT.price.toLocaleString()} ₪
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {SAMPLE_PRODUCT.originalPrice.toLocaleString()} ₪
                    </span>
                  </div>
                  <div className="text-lg font-medium text-green-600">
                    وفر {(SAMPLE_PRODUCT.originalPrice - SAMPLE_PRODUCT.price).toLocaleString()} ₪
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    السعر شامل الضريبة والتوصيل
                  </div>
                </div>

                {/* Color Selection */}
                {SAMPLE_PRODUCT.colors && SAMPLE_PRODUCT.colors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">اختر اللون:</h3>
                    <ProductColorSelector
                      productColors={SAMPLE_PRODUCT.colors}
                      selectedColor={selectedColor}
                      onColorSelect={setSelectedColor}
                      size="md"
                      showLabels={true}
                    />
                  </div>
                )}

                <Separator className="my-4" />

                {/* Key Features */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">المميزات الرئيسية:</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {SAMPLE_PRODUCT.keyFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 ml-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 text-lg font-semibold"
                  >
                    <ShoppingCart className="h-5 w-5 ml-2" />
                    أضف إلى السلة - {SAMPLE_PRODUCT.price.toLocaleString()} ₪
                  </Button>
                  
                  <Button
                    onClick={handleBuyNow}
                    variant="outline"
                    className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3"
                  >
                    اشتري الآن
                  </Button>
                </div>

                {/* Stock Info */}
                {SAMPLE_PRODUCT.stockCount <= 10 && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center text-orange-700">
                      <Sparkles className="h-4 w-4 ml-2" />
                      <span className="text-sm font-medium">
                        عجل! متبقي {SAMPLE_PRODUCT.stockCount} قطع فقط
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
      </div>
    </div>
  );
}