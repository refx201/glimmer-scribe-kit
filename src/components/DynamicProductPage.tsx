import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from '../lib/cart-context';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../lib/auth-context';
import { EnhancedAuthModal } from './EnhancedAuthModal';
import { ProductColorSelector } from './ProductColorSelector';
import { toast } from 'sonner';
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
  Sparkles,
  Flame,
  TrendingUp,
  Gift,
  Clock,
  MapPin,
  Phone
} from 'lucide-react';
import type { PageType } from '../App';
import { ProductImageGallery } from './product/ProductImageGallery';

// Sample reviews data - will be used when no reviews from database
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
    images: []
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
  }
];

// Sample related products
const RELATED_PRODUCTS = [
  {
    id: 'sample-1',
    name: 'منتج مقترح 1',
    price: 1999,
    originalPrice: 2299,
    discount: 13,
    image: '/placeholder.svg',
    badge: 'عرض خاص',
    badgeColor: 'bg-red-600',
    rating: 4.8,
    reviewsCount: 89,
    stockCount: 5,
    category: 'هواتف ذكية',
    brand: 'متنوع'
  },
  {
    id: 'sample-2',
    name: 'منتج مقترح 2',
    price: 999,
    originalPrice: 1199,
    discount: 17,
    image: '/placeholder.svg',
    badge: 'مميز',
    badgeColor: 'bg-purple-600',
    rating: 4.9,
    reviewsCount: 203,
    stockCount: 15,
    category: 'إكسسوارات',
    brand: 'متنوع'
  }
];

interface DynamicProductPageProps {
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
  onNavigate?: (page: PageType, productId?: string) => void;
}) {
  const { addItem } = useCart();
  
  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-white overflow-hidden cursor-pointer"
      onClick={() => onNavigate?.('product', product.id)}
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
              onNavigate?.('product', product.id);
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
          <StarRating rating={product.rating} size="small" />
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
              productId: product.id,
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              discount: product.discount,
              image: product.image,
              brandId: (product as any).brandId || (product as any).brand_id, // Include brand ID for promo codes
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

// Product Reviews Component with Real Authentication
function ProductReviews({ productId }: { productId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }

    // Listen for review submission events
    const handleReviewSubmitted = (event: CustomEvent) => {
      if (event.detail?.productId === productId) {
        fetchReviews();
      }
    };

    window.addEventListener('reviewSubmitted', handleReviewSubmitted as EventListener);
    return () => {
      window.removeEventListener('reviewSubmitted', handleReviewSubmitted as EventListener);
    };
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // First try to fetch real reviews from database
      const { data: realReviews, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        // If database fetch fails, fall back to sample reviews
        const sampleReviews = SAMPLE_REVIEWS.map((review, index) => ({
          ...review,
          id: `sample-${index}`,
          product_id: productId,
          user_id: `user-${index}`,
          created_at: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
          profiles: { full_name: review.customerName }
        }));
        setReviews(sampleReviews);
      } else {
        // Process real reviews and combine with sample reviews if needed
        const processedReviews = (realReviews || []).map(review => ({
          ...review,
          profiles: { 
            full_name: review.comment?.split(':')[0] || 'مستخدم مجهول' 
          },
          // Extract actual comment after the name
          comment: review.comment?.includes(':') 
            ? review.comment.split(':').slice(1).join(':').trim()
            : review.comment
        }));
        
        // If no real reviews, show sample reviews
        if (processedReviews.length === 0) {
          const sampleReviews = SAMPLE_REVIEWS.map((review, index) => ({
            ...review,
            id: `sample-${index}`,
            product_id: productId,
            user_id: `user-${index}`,
            created_at: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
            profiles: { full_name: review.customerName }
          }));
          setReviews(sampleReviews);
        } else {
          setReviews(processedReviews);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      // Fall back to sample reviews on any error
      const sampleReviews = SAMPLE_REVIEWS.map((review, index) => ({
        ...review,
        id: `sample-${index}`,
        product_id: productId,
        user_id: `user-${index}`,
        created_at: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
        profiles: { full_name: review.customerName }
      }));
      setReviews(sampleReviews);
    } finally {
      setLoading(false);
    }
  };

  const handleWriteReview = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowWriteReview(true);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .upsert({
          product_id: productId,
          user_id: user.id,
          rating: newReview.rating,
          comment: newReview.comment
        });

      if (error) {
        console.error('Error submitting review:', error);
        toast.error('حدثت مشكلة في إرسال التقييم');
      } else {
        toast.success('تم إرسال التقييم بنجاح!');
        setShowWriteReview(false);
        setNewReview({ rating: 5, comment: '' });
        fetchReviews();
        
        // Dispatch custom event for review submission
        window.dispatchEvent(new CustomEvent('reviewSubmitted', {
          detail: { productId }
        }));
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('حدثت مشكلة في إرسال التقييم');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingStats = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length;
    return { stars: star, count, percentage: reviews.length > 0 ? (count / reviews.length) * 100 : 0 };
  });

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Reviews Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            📝 تقييمات العملاء
          </h2>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleWriteReview}
          >
            {user ? 'اكتب تقييم' : 'سجل الدخول للتقييم'}
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل التقييمات...</p>
          </div>
        ) : (
          <>
            {/* Overall Rating Summary */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div className="text-5xl font-bold text-yellow-500 mb-2">
                      {averageRating.toFixed(1)}
                    </div>
                    <StarRating rating={averageRating} size="large" />
                    <p className="text-gray-600 mt-2">
                      على أساس {reviews.length} تقييم
                    </p>
                  </div>

                  {/* Rating Breakdown */}
                  <div className="space-y-3">
                    {ratingStats.map((stat) => (
                      <div key={stat.stars} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 min-w-[60px]">
                          <span className="text-sm font-medium">{stat.stars}</span>
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${stat.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 min-w-[40px]">
                          {stat.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews List */}
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <Card key={review.id} className="border border-gray-200">
                    <CardContent className="p-6">
                      {/* Review Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900">
                                {review.profiles?.full_name || 'مستخدم'}
                              </h4>
                              <Badge className="bg-green-100 text-green-700 text-xs">
                                عميل موثق
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <StarRating rating={review.rating} size="small" />
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(review.created_at).toLocaleDateString('ar-EG')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Review Content */}
                      <div className="mb-4">
                        <p className="text-gray-700 leading-relaxed">
                          {review.comment || 'تقييم بدون تعليق'}
                        </p>
                      </div>

                      {/* Review Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
                            <ThumbsUp className="h-4 w-4" />
                            <span className="text-sm">
                              مفيد ({review.helpful_count || 0})
                            </span>
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  لا توجد تقييمات بعد
                </h3>
                <p className="text-gray-600 mb-4">
                  كن أول من يقيم هذا المنتج
                </p>
              </div>
            )}
          </>
        )}

        {/* Write Review Modal */}
        {showWriteReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>اكتب تقييمك</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={submitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التقييم
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className={`p-1 ${
                            star <= newReview.rating 
                              ? 'text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        >
                          <Star className="h-6 w-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تعليقك (اختياري)
                    </label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="شاركنا رأيك في المنتج..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      disabled={submitting}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {submitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setShowWriteReview(false)}
                    >
                      إلغاء
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Auth Modal */}
        <EnhancedAuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    </section>
  );
}

// Related Products Section Component - Now Dynamic
function RelatedProductsSection({ onNavigate, productId }: { 
  onNavigate: (page: PageType, productId?: string) => void;
  productId?: string;
}) {
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ["product-related", productId],
    queryFn: async () => {
      if (!productId) return [];
      
      const { data: relations, error } = await supabase
        .from('related_products')
        .select(`
          related_product_id,
          related_products:products!related_products_related_product_id_fkey(
            id,
            name,
            image,
            sale_price,
            original_price,
            discount,
            brand_id,
            is_featured,
            is_hot_sale
          )
        `)
        .eq('product_id', productId);

      if (error) {
        console.error('Error fetching related products:', error);
        // Return sample products as fallback
        return RELATED_PRODUCTS;
      }

      return relations.map(rp => {
        const relatedProduct = rp.related_products as any;
        return {
          ...relatedProduct,
          price: relatedProduct?.sale_price,
          originalPrice: relatedProduct?.original_price,
          brandId: relatedProduct?.brand_id, // Include brand_id for promo codes
          badge: relatedProduct?.is_hot_sale ? 'عرض ساخن' : 
                 relatedProduct?.is_featured ? 'مميز' : 'جديد',
          badgeColor: relatedProduct?.is_hot_sale ? 'bg-red-600' :
                     relatedProduct?.is_featured ? 'bg-purple-600' : 'bg-blue-600',
          rating: 4.5 + Math.random() * 0.5,
          reviewsCount: Math.floor(Math.random() * 200) + 50,
          stockCount: Math.floor(Math.random() * 15) + 5,
          category: 'هواتف ذكية',
          brand: 'متنوع'
        };
      });
    },
    enabled: !!productId
  });

  // If no related products found, show fallback products
  const productsToShow = relatedProducts.length > 0 ? relatedProducts : RELATED_PRODUCTS;

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {productsToShow.slice(0, 4).map((product) => (
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

export function DynamicProductPage({ productId, onNavigate }: DynamicProductPageProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specifications');
  const { addItem, openCart } = useCart();

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
          brand:brands(*)
        `)
        .eq('id', productId)
        .maybeSingle();
      
      console.log('Fetched product data:', data);
      console.log('Product colors:', data?.colors);

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
        
        // Set default color if colors exist
        if (data.colors && Array.isArray(data.colors) && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`مرحباً، أريد معرفة تفاصيل أكثر عن ${product?.name || 'المنتج'}`);
    window.open(`https://wa.me/972598366822?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل تفاصيل المنتج...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-6">😔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">المنتج غير متوفر</h1>
          <p className="text-gray-600 mb-6">
            {error || 'عذراً، المنتج المطلوب غير متوفر حالياً أو قد يكون تم حذفه'}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => onNavigate('home')} className="bg-blue-600 hover:bg-blue-700">
              العودة للرئيسية
            </Button>
            <Button 
              onClick={() => onNavigate('offers')} 
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              تصفح المنتجات
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // Create product images array (main image + additional photos)
  const productImages = [
    product.image || '/placeholder.svg',
    ...(product.additional_photos || [])
  ].filter(Boolean);

  // Default specifications if none exist
  const defaultSpecs = {
    'العلامة التجارية': product.brand?.name || 'غير محدد',
    'النوع': product.type || 'منتج إلكتروني',
    'حالة المنتج': 'جديد',
    'الضمان': 'سنة كاملة'
  };

  const specifications = (product.specifications && typeof product.specifications === 'object') 
    ? { ...defaultSpecs, ...product.specifications }
    : defaultSpecs;

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
            <span className="text-gray-600">هواتف ذكية</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <ProductImageGallery 
              mainImage={product.image || '/placeholder.svg'}
              additionalPhotos={product.additional_photos || []}
              productName={product.name}
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.is_featured && (
                  <Badge className="bg-blue-600 text-white text-xs">مميز</Badge>
                )}
                {product.is_hot_sale && (
                  <Badge className="bg-red-600 text-white text-xs">عرض ساخن</Badge>
                )}
                {product.type && (
                  <Badge className="bg-gray-600 text-white text-xs">{product.type}</Badge>
                )}
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={4.5} showNumber />
                <span className="text-sm text-gray-500">
                  (لا توجد تقييمات بعد)
                </span>
                <Badge className="bg-green-100 text-green-700">
                  متوفر
                </Badge>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-red-600">
                  {(product.sale_price || 0).toLocaleString()} ₪
                </span>
                {product.original_price && product.original_price > product.sale_price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      {product.original_price.toLocaleString()} ₪
                    </span>
                    <Badge className="bg-red-600 text-white">
                      وفر {product.discount || 0}%
                    </Badge>
                  </>
                )}
              </div>
              
              {product.original_price && product.original_price > product.sale_price && (
                <p className="text-sm text-green-600 font-medium">
                  وفر {(product.original_price - product.sale_price).toLocaleString()} ₪
                </p>
              )}
            </div>

            {/* Colors Selection */}
            {(() => {
              console.log('Render check - product.colors:', product.colors);
              console.log('Is array?:', Array.isArray(product.colors));
              console.log('Length:', product.colors?.length);
              return null;
            })()}
            {product.colors && Array.isArray(product.colors) && product.colors.length > 0 && (
              <div>
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
                  (متوفر)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={() => {
                  addItem({
                    productId: product.id,
                    name: product.name,
                    price: product.sale_price || 0,
                    originalPrice: product.original_price || 0,
                    discount: product.discount || 0,
                    image: product.image || '/placeholder.svg',
                    brandId: product.brand_id, // Include brand ID for promo codes
                    color: selectedColor,
                    maxStock: 10,
                    quantity: quantity
                  });
                  openCart();
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-lg"
              >
                <ShoppingCart className="h-5 w-5 ml-2" />
                أضف للسلة - {((product.sale_price || 0) * quantity).toLocaleString()} ₪
              </Button>
              
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  onClick={() => {
                    const message = `🛒 *طلب شراء سريع*\n\n📱 المنتج: ${product.name}\n${selectedColor ? `🎨 اللون: ${selectedColor.name}\n` : ''}📦 الكمية: ${quantity}\n💰 السعر: ${((product.sale_price || 0) * quantity).toLocaleString()} ₪\n\n✅ أرغب في إتمام الطلب`;
                    window.open(`https://wa.me/972598366822?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold"
                >
                  <Zap className="h-4 w-4 ml-1" />
                  اشتري الآن
                </Button>
                <Button 
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                  onClick={handleWhatsAppClick}
                >
                  <Phone className="h-4 w-4 ml-1" />
                  واتساب
                </Button>
                <Button 
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  <Heart className="h-4 w-4 ml-1" />
                  أضف للمفضلة
                </Button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">ضمان سنة كاملة</p>
              </div>
              <div className="text-center">
                <Truck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">توصيل مجاني</p>
              </div>
              <div className="text-center">
                <Package className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">إرجاع 14 يوم</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <Card className="mb-12">
          <CardHeader>
            <div className="flex gap-6 border-b border-gray-200">
              {[
                { id: 'specifications', label: 'المواصفات', icon: Camera },
                { id: 'warranty', label: 'الضمان', icon: Shield }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 pb-4 px-2 border-b-2 transition-colors font-medium
                      ${activeTab === tab.id 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            
            {activeTab === 'specifications' && (
              <div className="space-y-6">
                {Object.entries(specifications).map(([key, value]) => {
                    // Handle different value types safely
                    let displayValue = '';
                    let displayKey = key;
                    
                    if (typeof value === 'string') {
                      displayValue = value;
                    } else if (typeof value === 'number') {
                      displayValue = value.toString();
                    } else if (Array.isArray(value)) {
                      displayValue = value.join(', ');
                    } else if (value && typeof value === 'object') {
                    // Handle nested JSON specs like camera, RAM, etc.
                    const specLabels: { [key: string]: string } = {
                      'os': 'نظام التشغيل',
                      'ram': 'الذاكرة العشوائية',
                      'battery': 'البطارية',
                      'display': 'الشاشة',
                      'storage': 'مساحة التخزين',
                      'processor': 'المعالج',
                      'backCamera': 'الكاميرا الخلفية',
                      'frontCamera': 'الكاميرا الأمامية',
                      'network': 'الشبكة',
                      'connectivity': 'الاتصال',
                      'dimensions': 'الأبعاد',
                      'weight': 'الوزن',
                      'colors': 'الألوان المتاحة'
                    };
                    
                    // Create a professional specs card for technical details
                    return (
                      <div key={key} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Monitor className="h-5 w-5 text-blue-600" />
                          المواصفات التقنية
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(value).map(([specKey, specValue]) => (
                            <div key={`${key}-${specKey}`} className="bg-white rounded-lg p-4 border border-gray-100 hover:border-blue-200 transition-colors">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-700 text-sm">
                                  {specLabels[specKey] || specKey}
                                </span>
                                <span className="text-gray-900 font-bold text-sm bg-blue-50 px-3 py-1 rounded-full">
                                  {String(specValue)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  } else {
                    displayValue = value ? String(value) : 'غير محدد';
                  }
                  
                  // Arabic labels for main categories
                  const categoryLabels: { [key: string]: string } = {
                    'الوصف': 'الوصف',
                    'العلامة التجارية': 'العلامة التجارية',
                    'النوع': 'النوع',
                    'حالة المنتج': 'حالة المنتج',
                    'الضمان': 'الضمان'
                  };
                  
                  displayKey = categoryLabels[key] || key;
                  
                  return (
                    <div key={key} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-200 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">{displayKey}</span>
                        <span className="text-gray-900 font-medium bg-gray-50 px-4 py-2 rounded-lg max-w-[300px] break-words text-right">
                          {displayValue}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {activeTab === 'warranty' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">ضمان المصنع</h4>
                    <p className="text-gray-600">سنة كاملة من تاريخ الشراء ضد عيوب التصنيع</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">خدمة ما بعد البيع</h4>
                    <p className="text-gray-600">دعم فني متخصص وصيانة معتمدة</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">استبدال فوري</h4>
                    <p className="text-gray-600">في حالة وجود عيب في المنتج خلال 14 يوم</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reviews Section */}
      <ProductReviews productId={product.id} />

      {/* Related Products */}
      <RelatedProductsSection onNavigate={onNavigate} productId={product.id} />
    </main>
  );
}