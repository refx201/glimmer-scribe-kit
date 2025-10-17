import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from '../lib/cart-context';
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
  MessageCircle,
  ThumbsUp,
  Calendar,
  User,
  Verified,
  Eye,
  ArrowLeft,
  Zap,
  Award,
  Camera,
  Monitor,
  Battery,
  Wifi,
  ArrowRight,
  Percent,
  Sparkles
} from 'lucide-react';
import type { PageType } from '../App';
import { ProductImageGallery } from './product/ProductImageGallery';

// Sample data - in a real app this would come from props or API
const SAMPLE_REVIEWS = [
  {
    id: 1,
    rating: 5,
    customerName: 'أحمد محمد',
    customerType: 'عميل موثق',
    date: '2024-01-15',
    comment: 'منتج ممتاز! الجودة عالية جداً والأداء سريع. خدمة التوصيل كانت في الوقت المحدد والتعامل راقي.',
    verified: true,
    helpfulCount: 12,
    images: ['https://images.unsplash.com/photo-1592286049617-3feb4da2681e?w=100&h=100&fit=crop']
  },
  {
    id: 2,
    rating: 4,
    customerName: 'فاطمة العلي',
    customerType: 'عميل موثق',
    date: '2024-01-12',
    comment: 'جهاز رائع بمواصفات ممتازة. الكاميرا جودتها عالية والبطارية تدوم طويل. أنصح بالشراء.',
    verified: true,
    helpfulCount: 8,
    images: []
  },
  {
    id: 3,
    rating: 5,
    customerName: 'محمد خالد',
    customerType: 'عميل موثق',
    date: '2024-01-10',
    comment: 'أفضل استثمار! السعر ممتاز مقارنة بالمحلات التانية وخدمة العملاء محترمة. شكراً ProCell 👍',
    verified: true,
    helpfulCount: 15,
    images: []
  },
  {
    id: 4,
    rating: 4,
    customerName: 'سارة أحمد',
    customerType: 'عميل موثق',
    date: '2024-01-08',
    comment: 'جهاز حديث ومتطور. التطبيقات تشتغل بسلاسة والتصميم أنيق. التوصيل كان سريع.',
    verified: true,
    helpfulCount: 6,
    images: []
  },
  {
    id: 5,
    rating: 5,
    customerName: 'عمر يوسف',
    customerType: 'عميل موثق',
    date: '2024-01-05',
    comment: 'ما شاء الله! الجهاز يستاهل كل قرش. الشاشة واضحة والألوان زاهية. خدمة ما بعد البيع ممتازة.',
    verified: true,
    helpfulCount: 10,
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop']
  }
];

const DETAILED_PRODUCT = {
  id: 1,
  name: 'iPhone 15 Pro Max - 256GB',
  brand: 'Apple',
  model: 'A3108',
  price: 3999,
  originalPrice: 4499,
  discount: 11,
  rating: 4.9,
  reviewsCount: 127,
  stockCount: 8,
  availability: 'متوفر',
  sku: 'IPH15PM256',
  warranty: 'سنة كاملة',
  condition: 'جديد',
  colors: [
    { name: 'تيتانيوم طبيعي', value: '#8D8D93', available: true },
    { name: 'تيتانيوم أبيض', value: '#F2F2F7', available: true },
    { name: 'تيتانيوم أسود', value: '#1D1D1F', available: false },
    { name: 'تيتانيوم أزرق', value: '#395B64', available: true }
  ],
  storage: [
    { size: '256GB', price: 3999, available: true },
    { size: '512GB', price: 4499, available: true },
    { size: '1TB', price: 4999, available: false }
  ],
  images: [
    'https://images.unsplash.com/photo-1592286049617-3feb4da2681e?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&h=600&fit=crop&crop=center'
  ],
  description: 'iPhone 15 Pro Max الجديد بشريحة A17 Pro القوية يقدم أداءً استثنائياً وكاميرا متطورة. مصنوع من التيتانيوم خفيف الوزن وقوي التحمل مع تصميم أنيق ومميز.',
  keyFeatures: [
    'شريحة A17 Pro بتقنية 3 نانومتر',
    'كاميرا ثلاثية 48 ميجابكسل',
    'شاشة Super Retina XDR مقاس 6.7 بوصة',
    'بطارية تدوم طوال اليوم',
    'مقاوم للماء IP68',
    'منفذ USB-C',
    'شريحة 5G فائقة السرعة'
  ],
  specifications: {
    'الشاشة': '6.7 بوصة Super Retina XDR OLED',
    'المعالج': 'Apple A17 Pro (3nm)',
    'الذاكرة': '8GB RAM',
    'التخزين': '256GB/512GB/1TB',
    'الكاميرا الخلفية': '48MP ثلاثية + LiDAR',
    'الكاميرا الأمامية': '12MP TrueDepth',
    'البطارية': '4441 mAh',
    'الشحن': '27W سلكي، 15W لاسلكي',
    'المقاومة': 'IP68',
    'الوزن': '221 جرام',
    'النظام': 'iOS 17',
    'الشبكة': '5G, 4G LTE'
  },
  whatsIncluded: [
    'iPhone 15 Pro Max',
    'كابل USB-C للشحن',
    'دليل الاستخدام',
    'أداة إخراج SIM',
    'ملصق Apple'
  ],
  tags: ['الأكثر مبيعاً', 'جديد', 'مميز', '5G'],
  category: 'هواتف ذكية',
  subcategory: 'iPhone'
};

// Related products data
const RELATED_PRODUCTS = [
  {
    id: 2,
    name: 'iPhone 14 Pro - 128GB',
    price: 2999,
    originalPrice: 3499,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop&crop=center',
    badge: 'عرض خاص',
    badgeColor: 'bg-red-600',
    rating: 4.8,
    reviewsCount: 89,
    stockCount: 5,
    category: 'هواتف ذكية',
    brand: 'Apple'
  },
  {
    id: 3,
    name: 'AirPods Pro - الجيل الثاني',
    price: 999,
    originalPrice: 1199,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=300&h=300&fit=crop&crop=center',
    badge: 'مميز',
    badgeColor: 'bg-purple-600',
    rating: 4.9,
    reviewsCount: 203,
    stockCount: 15,
    category: 'إكسسوارات',
    brand: 'Apple'
  },
  {
    id: 4,
    name: 'Apple Watch Series 9 - 45mm',
    price: 1699,
    originalPrice: 1899,
    discount: 11,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop&crop=center',
    badge: 'جديد',
    badgeColor: 'bg-green-600',
    rating: 4.8,
    reviewsCount: 156,
    stockCount: 12,
    category: 'إكسسوارات',
    brand: 'Apple'
  }
];

interface ProductPageProps {
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
                : i < rating 
                ? 'text-yellow-400 fill-current opacity-50'
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

// Related Product Card Component
function RelatedProductCard({ 
  product, 
  onNavigate 
}: { 
  product: typeof RELATED_PRODUCTS[0];
  onNavigate?: (page: PageType) => void;
}) {
  const { addItem } = useCart();
  
  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-white overflow-hidden cursor-pointer"
      onClick={() => onNavigate?.('product')}
    >
      {/* Product Badge */}
      <div className="absolute top-2 right-2 z-20">
        <Badge className={`${product.badgeColor} text-white text-xs`}>
          {product.badge}
        </Badge>
      </div>
      
      {/* Discount Badge */}
      {product.discount > 0 && (
        <div className="absolute top-2 left-2 z-20">
          <Badge className="bg-red-600 text-white text-xs">
            <Percent className="h-2 w-2 ml-1" />
            {product.discount}%
          </Badge>
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Quick Actions */}
        <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.('product');
            }}
            className="w-6 h-6 bg-white/90 text-gray-600 hover:bg-white p-0"
            title="عرض التفاصيل"
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              // Add to favorites logic here
            }}
            className="w-6 h-6 bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 p-0"
            title="أضف للمفضلة"
          >
            <Heart className="h-3 w-3" />
          </Button>
        </div>
        
        {/* Stock Indicator */}
        {product.stockCount <= 10 && (
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-orange-500 text-white text-xs">
              باقي {product.stockCount}
            </Badge>
          </div>
        )}
      </div>

      {/* Product Info */}
      <CardContent className="p-3">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviewsCount})</span>
        </div>
        
        {/* Product Title */}
        <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 leading-tight">
          {product.name}
        </h3>
        
        {/* Price Section */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-red-600">
              {product.price.toLocaleString()} ₪
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                {product.originalPrice.toLocaleString()} ₪
              </span>
            )}
          </div>
          {product.originalPrice > product.price && (
            <div className="text-xs font-medium text-green-600">
              وفر {(product.originalPrice - product.price).toLocaleString()} ₪
            </div>
          )}
        </div>
        
        {/* Action Button */}
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            addItem({
              productId: String(product.id),
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              discount: product.discount,
              image: product.image,
              maxStock: product.stockCount,
              quantity: 1
            });
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2"
        >
          <ShoppingCart className="h-3 w-3 ml-1" />
          أضف للسلة
        </Button>
      </CardContent>
    </Card>
  );
}

// Related Products Section Component
function RelatedProductsSection({ onNavigate }: { onNavigate: (page: PageType) => void }) {
  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4 ml-1" />
            منتجات قد تعجبك
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            🔥 منتجات ذات صلة
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            منتجات مختارة بعناية من نفس العلامة التجارية أو الفئة لتناسب احتياجاتك
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {RELATED_PRODUCTS.map((product) => (
            <RelatedProductCard 
              key={product.id} 
              product={product} 
              onNavigate={onNavigate}
            />
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <Button 
            onClick={() => onNavigate('offers')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            استكشف المزيد من المنتجات
            <ArrowRight className="h-4 w-4 mr-2" />
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-sm text-gray-900 mb-1">ضمان شامل</h4>
            <p className="text-xs text-gray-600">سنة كاملة</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Truck className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-sm text-gray-900 mb-1">توصيل سريع</h4>
            <p className="text-xs text-gray-600">خلال 24 ساعة</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-sm text-gray-900 mb-1">إرجاع مجاني</h4>
            <p className="text-xs text-gray-600">14 يوم</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Award className="h-6 w-6 text-orange-600" />
            </div>
            <h4 className="font-semibold text-sm text-gray-900 mb-1">جودة مضمونة</h4>
            <p className="text-xs text-gray-600">منتجات أصلية</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Product Reviews Component  
function ProductReviews() {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          📝 تقييمات العملاء
        </h2>

        {/* Reviews Display Component */}
        <ReviewsDisplay productId={String(DETAILED_PRODUCT.id)} />
        
        {/* Review Form */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <ReviewForm productId={String(DETAILED_PRODUCT.id)} />
        </div>
      </div>
    </section>
  );
}

// Main Product Page Component
export function ProductPage({ onNavigate }: ProductPageProps) {
  const [selectedColor, setSelectedColor] = useState(DETAILED_PRODUCT.colors[0]);
  const [selectedStorage, setSelectedStorage] = useState(DETAILED_PRODUCT.storage[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specifications');
  const { addItem, buyNow, openCart } = useCart();

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`مرحباً، أريد معرفة تفاصيل أكثر عن ${DETAILED_PRODUCT.name}`);
    window.open(`https://wa.me/972598366822?text=${message}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="h-4 w-4" />
              العودة للرئيسية
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{DETAILED_PRODUCT.category}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{DETAILED_PRODUCT.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <ProductImageGallery 
              mainImage={DETAILED_PRODUCT.images[0]}
              additionalPhotos={DETAILED_PRODUCT.images.slice(1)}
              productName={DETAILED_PRODUCT.name}
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {DETAILED_PRODUCT.tags.map((tag, index) => (
                  <Badge 
                    key={index}
                    className={`
                      text-xs
                      ${tag === 'الأكثر مبيعاً' ? 'bg-blue-600 text-white' : ''}
                      ${tag === 'جديد' ? 'bg-green-600 text-white' : ''}
                      ${tag === 'مميز' ? 'bg-purple-600 text-white' : ''}
                      ${tag === '5G' ? 'bg-orange-600 text-white' : ''}
                    `}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {DETAILED_PRODUCT.name}
              </h1>
              
              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={DETAILED_PRODUCT.rating} showNumber />
                <span className="text-sm text-gray-500">
                  ({DETAILED_PRODUCT.reviewsCount} تقييم)
                </span>
                <Badge className="bg-green-100 text-green-700">
                  {DETAILED_PRODUCT.availability}
                </Badge>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-red-600">
                  {selectedStorage.price.toLocaleString()} ₪
                </span>
                {DETAILED_PRODUCT.originalPrice > selectedStorage.price && (
                  <span className="text-lg text-gray-400 line-through">
                    {DETAILED_PRODUCT.originalPrice.toLocaleString()} ₪
                  </span>
                )}
                {DETAILED_PRODUCT.discount > 0 && (
                  <Badge className="bg-red-600 text-white">
                    وفر {DETAILED_PRODUCT.discount}%
                  </Badge>
                )}
              </div>
              
              {DETAILED_PRODUCT.originalPrice > selectedStorage.price && (
                <p className="text-sm text-green-600 font-medium">
                  وفر {(DETAILED_PRODUCT.originalPrice - selectedStorage.price).toLocaleString()} ₪
                </p>
              )}
            </div>

            {/* Color Selection */}
            {DETAILED_PRODUCT.colors && DETAILED_PRODUCT.colors.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">اختر اللون:</h3>
                <ProductColorSelector
                  productColors={DETAILED_PRODUCT.colors}
                  selectedColor={selectedColor}
                  onColorSelect={setSelectedColor}
                  size="md"
                  showLabels={true}
                />
              </div>
            )}

            {/* Storage Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">سعة التخزين</h3>
              <div className="grid grid-cols-3 gap-2">
                {DETAILED_PRODUCT.storage.map((storage, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedStorage(storage)}
                    disabled={!storage.available}
                    className={`
                      p-3 border rounded-lg text-center transition-all
                      ${selectedStorage.size === storage.size 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 hover:border-gray-400'
                      }
                      ${!storage.available ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="font-medium">{storage.size}</div>
                    <div className="text-sm text-gray-600">
                      {storage.price.toLocaleString()} ₪
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">الكمية</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
                <span className="text-sm text-gray-500 mr-2">
                  (متوفر {DETAILED_PRODUCT.stockCount} قطع)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={() => {
                  addItem({
                    productId: String(DETAILED_PRODUCT.id),
                    name: DETAILED_PRODUCT.name,
                    price: selectedStorage.price,
                    originalPrice: DETAILED_PRODUCT.originalPrice,
                    discount: DETAILED_PRODUCT.discount,
                    image: DETAILED_PRODUCT.images[0],
                    brandId: undefined, // Sample product - no brand ID
                    color: selectedColor,
                    storage: selectedStorage,
                    maxStock: DETAILED_PRODUCT.stockCount,
                    quantity: quantity
                  });
                  openCart();
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-lg"
              >
                <ShoppingCart className="h-5 w-5 ml-2" />
                أضف للسلة - {(selectedStorage.price * quantity).toLocaleString()} ₪
              </Button>
              
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  onClick={() => {
                    addItem({
                      productId: String(DETAILED_PRODUCT.id),
                      name: DETAILED_PRODUCT.name,
                      price: selectedStorage.price,
                      originalPrice: DETAILED_PRODUCT.originalPrice,
                      discount: DETAILED_PRODUCT.discount,
                      image: DETAILED_PRODUCT.images[0],
                      brandId: undefined, // Sample product - no brand ID
                      color: selectedColor,
                      storage: selectedStorage,
                      maxStock: DETAILED_PRODUCT.stockCount,
                      quantity: quantity
                    });
                    openCart();
                  }}
                  variant="outline" 
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  <Zap className="h-4 w-4 ml-1" />
                  اشتري الآن
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleWhatsAppClick}
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  <MessageCircle className="h-4 w-4 ml-1" />
                  واتساب
                </Button>
                <Button variant="outline" className="border-gray-300">
                  <Heart className="h-4 w-4 ml-1" />
                  المفضلة
                </Button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <Shield className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">ضمان سنة</p>
              </div>
              <div className="text-center">
                <Truck className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">توصيل مجاني</p>
              </div>
              <div className="text-center">
                <Package className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">إرجاع مجاني</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 mb-8">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {[
                { id: 'specifications', label: 'المواصفات', icon: Monitor },
                { id: 'features', label: 'المميزات', icon: Award },
                { id: 'included', label: 'محتويات العلبة', icon: Package }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors
                    ${activeTab === tab.id 
                      ? 'border-blue-500 text-blue-600 bg-blue-50' 
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">المواصفات التقنية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(DETAILED_PRODUCT.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">{key}</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">المميزات الرئيسية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {DETAILED_PRODUCT.keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'included' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">محتويات العلبة</h3>
                <div className="space-y-3">
                  {DETAILED_PRODUCT.whatsIncluded.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Reviews */}
      <ProductReviews />

      {/* Related Products Section */}
      <RelatedProductsSection onNavigate={onNavigate} />
    </main>
  );
}