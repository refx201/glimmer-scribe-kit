import { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Star, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TradeInTestimonial {
  id: string;
  name: string;
  location: string;
  avatar_url?: string;
  comment: string;
  rating: number;
  device_traded?: string;
  device_received?: string;
}

export function TradeInTestimonials() {
  const [testimonials, setTestimonials] = useState<TradeInTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('trade_in_testimonials')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTestimonials(data || []);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-procell-accent mx-auto"></div>
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-white to-procell-light/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <RefreshCw className="h-6 w-6 text-procell-accent" />
            <h2 className="text-3xl font-bold text-procell-dark">
              ماذا يقول عملاؤنا؟
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            تجارب حقيقية من عملاء استبدلوا أجهزتهم القديمة بأحدث الموديلات
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-procell-accent/20"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  {testimonial.avatar_url ? (
                    <img
                      src={testimonial.avatar_url}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-procell-accent/10 flex items-center justify-center">
                      <span className="text-procell-accent font-bold text-lg">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-procell-dark">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    {renderStars(testimonial.rating)}
                  </div>
                </div>

                <p className="text-muted-foreground mb-4 leading-relaxed">
                  "{testimonial.comment}"
                </p>

                {(testimonial.device_traded || testimonial.device_received) && (
                  <div className="pt-4 border-t border-procell-accent/10 space-y-2">
                    {testimonial.device_traded && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">استبدل:</span>
                        <span className="font-medium text-procell-dark">
                          {testimonial.device_traded}
                        </span>
                      </div>
                    )}
                    {testimonial.device_received && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">حصل على:</span>
                        <span className="font-medium text-procell-accent">
                          {testimonial.device_received}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
