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

  const testimonialsPerPage = 1; // Show one testimonial at a time
  const totalPages = testimonials.length;
  const currentTestimonial = testimonials[currentPage] || testimonials[0];

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

  if (!currentTestimonial) return null;

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              آراء عملائنا الكرام
            </h2>
          </div>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            شهادات حقيقية من عملاء راضين عن خدماتنا وجودة منتجاتنا
          </p>
        </div>

        {/* Single Testimonial Card */}
        <div className="max-w-3xl mx-auto mb-8">
          <Card className="border-border/50 bg-card shadow-lg">
            <CardContent className="p-8 md:p-12">
              {/* Quote Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-yellow-400/20 flex items-center justify-center">
                  <span className="text-5xl text-yellow-400 font-serif leading-none">"</span>
                </div>
              </div>

              {/* Comment */}
              <blockquote className="text-lg md:text-xl text-foreground leading-relaxed text-center mb-8 font-medium">
                "{currentTestimonial.comment}"
              </blockquote>

              {/* User Info Section */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6 border-t border-border/50">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {currentTestimonial.avatar_url ? (
                    <img
                      src={currentTestimonial.avatar_url}
                      alt={currentTestimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                  )}
                </div>

                {/* User Details */}
                <div className="text-center md:text-right flex-1">
                  <div className="text-lg font-bold text-foreground mb-1">
                    {currentTestimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {currentTestimonial.location}
                  </div>
                  <div className="flex justify-center md:justify-start gap-1">
                    {renderStars(currentTestimonial.rating)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={prevPage}
              className="rounded-full w-12 h-12 border-2"
              aria-label="السابق"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`h-3 rounded-full transition-all ${
                    index === currentPage
                      ? 'w-8 bg-primary'
                      : 'w-3 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`الصفحة ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={nextPage}
              className="rounded-full w-12 h-12 border-2"
              aria-label="التالي"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
