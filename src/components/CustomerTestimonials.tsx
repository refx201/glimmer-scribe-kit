import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../lib/auth-context';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  Star, 
  Quote, 
  CheckCircle, 
  MapPin, 
  Calendar,
  ThumbsUp,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  Loader2
} from 'lucide-react';

interface Testimonial {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
  user_avatar: string;
  user_location: string;
  product_name: string;
  helpful_count: number;
}

export function CustomerTestimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();

  useEffect(() => {
    fetchTestimonials();
    
    // Set up real-time subscription for new testimonials
    const channel = supabase
      .channel('testimonials-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews'
        },
        () => {
          // Refresh testimonials when reviews change
          fetchTestimonials();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_customer_testimonials', { limit_count: 10 });
      
      if (error) {
        console.error('Error fetching testimonials:', error);
        toast.error('خطأ في تحميل التقييمات');
        return;
      }

      if (data && data.length > 0) {
        setTestimonials(data);
      } else {
        // Fallback testimonials if no data in database
        setTestimonials([
          {
            id: '1',
            rating: 5,
            comment: 'أفضل تجربة شراء هواتف مررت بها. الخدمة سريعة والفريق محترف جداً. وصلني الجهاز خلال 24 ساعة والجودة ممتازة.',
            created_at: new Date().toISOString(),
            user_name: userProfile?.name || 'أحمد محمود',
            user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
            user_location: 'رام الله',
            product_name: 'iPhone 15 Pro',
            helpful_count: 23
          }
        ]);
      }
    } catch (error) {
      console.error('Error in fetchTestimonials:', error);
      toast.error('خطأ في تحميل التقييمات');
    } finally {
      setLoading(false);
    }
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'منذ يوم واحد';
    if (diffDays < 7) return `منذ ${diffDays} أيام`;
    if (diffDays < 14) return 'منذ أسبوع';
    if (diffDays < 30) return `منذ ${Math.floor(diffDays / 7)} أسابيع`;
    return `منذ ${Math.floor(diffDays / 30)} شهر`;
  };

  if (loading) {
    return (
      <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-yellow-50/50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-procell-primary" />
              <p className="text-muted-foreground">جاري تحميل التقييمات...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-yellow-50/50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-procell-dark mb-3 sm:mb-4">
              ⭐ <span className="text-yellow-600">آراء عملائنا الكرام</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              لا توجد تقييمات حالياً. كن أول من يترك تقييمه!
            </p>
          </div>
        </div>
      </section>
    );
  }

  const current = testimonials[currentTestimonial];

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-yellow-50/50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-procell-dark mb-3 sm:mb-4">
            ⭐ <span className="text-yellow-600">آراء عملائنا الكرام</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            شهادات حقيقية من عملاء راضين عن خدماتنا وجودة منتجاتنا
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
            <CardContent className="p-6 sm:p-8 md:p-10">
              {/* Quote Icon */}
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Quote className="h-6 w-6 text-yellow-600" />
                </div>
              </div>

              {/* Review Text */}
              <blockquote className="text-center mb-6 sm:mb-8">
                <p className="text-base sm:text-lg md:text-xl text-procell-dark leading-relaxed font-medium">
                  "{current.comment}"
                </p>
              </blockquote>

              {/* Customer Info */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <ImageWithFallback
                      src={current.user_avatar}
                      alt={current.user_name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-procell-primary rounded-full p-1">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <h4 className="font-semibold text-procell-dark text-base sm:text-lg">
                      {current.user_name}
                    </h4>
                    <div className="flex items-center justify-center sm:justify-start space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{current.user_location}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start space-x-1 mt-1">
                      {renderStars(current.rating)}
                    </div>
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  {current.product_name && (
                    <Badge className="bg-procell-secondary/10 text-procell-secondary text-xs sm:text-sm mb-2">
                      {current.product_name}
                    </Badge>
                  )}
                  <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs sm:text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(current.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Interaction Stats */}
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="h-4 w-4 text-procell-accent" />
                  <span>{current.helpful_count} مفيد</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>{current.user_name}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center space-x-4 mt-6">
              <Button
                onClick={prevTestimonial}
                variant="outline"
                size="sm"
                className="border-procell-primary/20 hover:bg-procell-primary hover:text-white transition-all duration-300"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonial 
                        ? 'bg-procell-primary w-6' 
                        : 'bg-gray-300 hover:bg-procell-primary/50'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                onClick={nextTestimonial}
                variant="outline"
                size="sm"
                className="border-procell-primary/20 hover:bg-procell-primary hover:text-white transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Overall Rating Summary */}
        <div className="text-center bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-yellow-200/50 shadow-lg max-w-2xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-yellow-600">4.9</div>
              <div className="flex justify-center space-x-1 mb-1">
                {renderStars(5)}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">متوسط التقييم</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-procell-primary">98%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">رضا العملاء</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-procell-accent">{testimonials.length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">مراجعة</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-procell-secondary">95%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">يوصون بنا</div>
            </div>
          </div>
          
          <Button className="mt-6 bg-gradient-to-r from-procell-primary to-procell-primary-light hover:from-procell-primary/90 hover:to-procell-primary-light/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <MessageCircle className="h-4 w-4 ml-2" />
            اترك مراجعتك
          </Button>
        </div>
      </div>
    </section>
  );
}