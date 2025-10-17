import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, User, ThumbsUp, Calendar, Verified } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
  helpful_count: number;
  reviewer_name?: string;
  profiles?: {
    full_name: string;
  } | null;
}

interface ReviewsDisplayProps {
  productId: string;
  onRefresh?: () => void;
}

export function ReviewsDisplay({ productId, onRefresh }: ReviewsDisplayProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating_high' | 'rating_low'>('newest');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // First fetch reviews
      let query = supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId);

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'rating_high':
          query = query.order('rating', { ascending: false });
          break;
        case 'rating_low':
          query = query.order('rating', { ascending: true });
          break;
      }

      const { data: reviewsData, error: reviewsError } = await query;
      
      if (reviewsError) throw reviewsError;
      
      if (!reviewsData || reviewsData.length === 0) {
        setReviews([]);
        return;
      }

      // Fetch user profiles for the reviews
      const userIds = reviewsData.map(review => review.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Combine reviews with profile data
      const reviewsWithProfiles = reviewsData.map(review => ({
        ...review,
        profiles: profilesData?.find(profile => profile.id === review.user_id) || null
      }));

      setReviews(reviewsWithProfiles);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId, sortBy]);

  // Listen for review submissions to refresh
  useEffect(() => {
    const handleReviewSubmitted = () => {
      fetchReviews();
    };

    window.addEventListener('reviewSubmitted', handleReviewSubmitted);
    return () => {
      window.removeEventListener('reviewSubmitted', handleReviewSubmitted);
    };
  }, []);

  // Trigger refresh from parent if needed
  useEffect(() => {
    if (onRefresh) {
      fetchReviews();
    }
  }, [onRefresh]);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      const rating = review.rating;
      if (rating >= 1 && rating <= 5) {
        distribution[rating as keyof typeof distribution]++;
      }
    });
    return distribution;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const averageRating = calculateAverageRating();
  const ratingDistribution = getRatingDistribution();

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      {reviews.length > 0 && (
        <Card className="bg-gray-50">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Overall Rating */}
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < Math.floor(averageRating)
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm">
                  بناءً على {reviews.length} تقييم
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = ratingDistribution[rating as keyof typeof ratingDistribution];
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  
                  return (
                    <div key={rating} className="flex items-center gap-2 text-sm">
                      <span className="w-12">{rating} نجوم</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-gray-600">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sort Options */}
      {reviews.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">ترتيب حسب:</span>
          <div className="flex gap-1">
            {[
              { key: 'newest', label: 'الأحدث' },
              { key: 'oldest', label: 'الأقدم' },
              { key: 'rating_high', label: 'الأعلى تقييماً' },
              { key: 'rating_low', label: 'الأقل تقييماً' }
            ].map(option => (
              <Button
                key={option.key}
                variant={sortBy === option.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy(option.key as any)}
                className="text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <Card key={review.id} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {review.reviewer_name || `عميل محقق ${review.user_id.slice(0, 4)}`}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          <Verified className="h-3 w-3 ml-1" />
                          عميل موثق
                        </Badge>
                      </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                {review.comment}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-1 h-auto text-xs hover:text-blue-600"
                >
                  <ThumbsUp className="h-3 w-3 ml-1" />
                  مفيد ({review.helpful_count || 0})
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show More Button */}
      {reviews.length > 3 && (
        <div className="text-center">
          <Button 
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="px-8"
          >
            {showAll 
              ? 'عرض أقل' 
              : `عرض جميع التقييمات (${reviews.length})`
            }
          </Button>
        </div>
      )}

      {/* No Reviews State */}
      {reviews.length === 0 && !loading && (
        <Card className="border-2 border-dashed border-gray-200">
          <CardContent className="p-8 text-center">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد تقييمات بعد
            </h3>
            <p className="text-gray-600">
              كن أول من يقيم هذا المنتج ويشارك تجربته
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}