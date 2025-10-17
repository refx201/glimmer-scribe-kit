import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from './ui/carousel';
import { ImageLoader } from './ImageLoader';
import { getOptimizedImageUrl } from '../lib/image-utils';
import {
  ArrowRight,
  Zap,
  Gift,
  Users,
} from 'lucide-react';

interface DatabaseHeroCarouselProps {
  onNavigate: (path: string) => void;
}

export function DatabaseHeroCarousel({ onNavigate }: DatabaseHeroCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch sliding photos from database
  const { data: slides, isLoading } = useQuery({
    queryKey: ['hero-sliding-photos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sliding_photos')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  // Clear interval helper function
  const clearAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Start auto-play helper function
  const startAutoPlay = () => {
    if (!api || !isPlaying || !isVisible) return;
    
    clearAutoPlay();
    intervalRef.current = setInterval(() => {
      api.scrollNext();
    }, 6000);
  };

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Page visibility API
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Intersection Observer
  useEffect(() => {
    if (!carouselRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    observer.observe(carouselRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-play management
  useEffect(() => {
    if (isPlaying && isVisible) {
      startAutoPlay();
    } else {
      clearAutoPlay();
    }

    return clearAutoPlay;
  }, [api, isPlaying, isVisible]);

  // Mouse interaction handling
  useEffect(() => {
    if (!carouselRef.current) return;

    const carousel = carouselRef.current;
    
    const handleMouseEnter = () => {
      clearAutoPlay();
    };
    
    const handleMouseLeave = () => {
      if (isPlaying && isVisible) {
        startAutoPlay();
      }
    };

    const handleTouchStart = () => {
      clearAutoPlay();
      setIsPlaying(false);
    };

    carousel.addEventListener('mouseenter', handleMouseEnter);
    carousel.addEventListener('mouseleave', handleMouseLeave);
    carousel.addEventListener('touchstart', handleTouchStart);

    return () => {
      carousel.removeEventListener('mouseenter', handleMouseEnter);
      carousel.removeEventListener('mouseleave', handleMouseLeave);
      carousel.removeEventListener('touchstart', handleTouchStart);
    };
  }, [isPlaying, isVisible]);

  const handleSlideClick = (link?: string) => {
    if (!link) return;
    
    // Check if it's an external link
    if (link.startsWith('http://') || link.startsWith('https://')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      // Internal navigation
      const path = link.startsWith('/') ? link.substring(1) : link;
      onNavigate(path);
    }
  };

  if (isLoading) {
    return (
      <section className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[85vh] bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse" />
    );
  }

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full min-h-screen" ref={carouselRef}>
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <Card 
                className="relative h-screen overflow-hidden border-0 rounded-none cursor-pointer group"
                onClick={() => handleSlideClick(slide.link || undefined)}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <ImageLoader
                    src={getOptimizedImageUrl(slide.image_url, 1920, 1080)}
                    alt={slide.title || 'Hero slide'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={current === slides.indexOf(slide) + 1}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent" />
                  
                  {/* Pattern Overlay */}
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
                    <div className="max-w-3xl text-left w-full pr-0 md:pr-8 lg:pr-12">
                      {/* Title and Description */}
                      {slide.title && (
                        <div className="space-y-6 md:space-y-8 animate-fade-in ml-[35px]">
                          {/* Title */}
                          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight carousel-text-shadow">
                            {slide.title}
                          </h1>
                          
                          {/* Description */}
                          {slide.description && (
                            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl carousel-text-shadow">
                              {slide.description}
                            </p>
                          )}

                          {/* CTA Buttons */}
                          {(slide.button1_text || slide.button2_text) && (
                            <div className="flex flex-row items-center gap-3 md:gap-4">
                              {slide.button1_text && slide.button1_link && (
                                <Button
                                  size="lg"
                                  className="bg-primary text-white hover:bg-primary/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-semibold group"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSlideClick(slide.button1_link);
                                  }}
                                >
                                  {slide.button1_text}
                                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 mr-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                              )}
                              {slide.button2_text && slide.button2_link && (
                                <Button
                                  size="lg"
                                  variant="outline"
                                  className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-semibold"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSlideClick(slide.button2_link);
                                  }}
                                >
                                  {slide.button2_text}
                                </Button>
                              )}
                            </div>
                          )}

                          {/* Features Pills */}
                          <div className="flex flex-wrap gap-2 md:gap-3">
                            <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 md:px-5 py-2 md:py-2.5 text-white text-sm md:text-base">
                              <Zap className="h-4 w-4 md:h-5 md:w-5 ml-2" />
                              توصيل سريع
                            </div>
                            <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 md:px-5 py-2 md:py-2.5 text-white text-sm md:text-base">
                              <Gift className="h-4 w-4 md:h-5 md:w-5 ml-2" />
                              ضمان شامل
                            </div>
                            <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 md:px-5 py-2 md:py-2.5 text-white text-sm md:text-base">
                              <Users className="h-4 w-4 md:h-5 md:w-5 ml-2" />
                              دعم 24/7
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white border-2 border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl" />
        <CarouselNext className="right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white border-2 border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl" />
      </Carousel>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <div 
          className="h-full bg-white transition-all duration-300 ease-out"
          style={{ width: `${((current - 1) / (count - 1)) * 100}%` }}
        />
      </div>
    </section>
  );
}