import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  Star, 
  Users,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar_url?: string;
}

export function CustomerTestimonials() {
  const [currentPage, setCurrentPage] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const testimonialsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);
  const displayedTestimonials = testimonials.slice(
    currentPage * testimonialsPerPage,
    (currentPage + 1) * testimonialsPerPage
  );

  useEffect(() => {
    fetchTestimonials();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('testimonials-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'testimonials'
      }, () => {
        fetchTestimonials();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('خطأ في تحميل التقييمات');
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
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
    return null;
  }

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

        {/* Testimonials Grid with Navigation */}
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {displayedTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-lg transition-shadow border-procell-primary/10">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-center">
                    {renderStars(testimonial.rating)}
                  </div>
                  <blockquote className="text-sm text-procell-dark text-center min-h-[60px]">
                    "{testimonial.comment}"
                  </blockquote>
                  <div className="flex items-center justify-center space-x-3 space-x-reverse">
                    {testimonial.avatar_url ? (
                      <img
                        src={testimonial.avatar_url}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-procell-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-procell-primary" />
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-sm font-medium text-procell-dark">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Buttons - Only show if more than 3 testimonials */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                className="gap-2"
              >
                <ChevronRight className="h-4 w-4" />
                السابق
              </Button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentPage
                        ? 'w-8 bg-procell-primary'
                        : 'w-2 bg-procell-primary/30 hover:bg-procell-primary/50'
                    }`}
                    aria-label={`الصفحة ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                className="gap-2"
              >
                التالي
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
