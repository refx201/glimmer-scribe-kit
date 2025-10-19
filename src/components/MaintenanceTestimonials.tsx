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

interface MaintenanceTestimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar_url?: string;
}

export function MaintenanceTestimonials() {
  const [currentPage, setCurrentPage] = useState(0);
  const [testimonials, setTestimonials] = useState<MaintenanceTestimonial[]>([]);
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
      .channel('maintenance-testimonials-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'maintenance_testimonials'
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
        .from('maintenance_testimonials')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching maintenance testimonials:', error);
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
      <section className="py-12 md:py-16 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
    <section className="py-12 md:py-16 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            آراء عملائنا 👍
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            تقييمات حقيقية من عملاء استخدموا خدمات الصيانة لدينا
          </p>
        </div>

        {/* Testimonials Grid with Navigation */}
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {displayedTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-xl transition-all duration-300 border-border/50 bg-card">
                <CardContent className="p-4">
                  {/* Avatar and Name First */}
                  <div className="flex items-center gap-3 mb-3">
                    {testimonial.avatar_url ? (
                      <img
                        src={testimonial.avatar_url}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                    )}
                    <div className="text-right flex-1">
                      <div className="text-base font-bold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex justify-start gap-1 mb-3">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Comment */}
                  <blockquote className="text-sm text-muted-foreground leading-relaxed text-right line-clamp-3">
                    {testimonial.comment}
                  </blockquote>
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
                        ? 'w-8 bg-primary'
                        : 'w-2 bg-primary/30 hover:bg-primary/50'
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