import { useState, useEffect, useRef } from 'react';
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
  Users,
  Zap,
  Star,
  Gift,
  MessageCircle,
} from 'lucide-react';
import { PageType } from '../App';

interface HeroCarouselProps {
  onNavigate: (page: PageType) => void;
}

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaAction: () => void;
  badge?: string;
  badgeColor?: string;
  overlayColor: string;
  textPosition: 'left' | 'right' | 'center';
}

export function HeroCarousel({ onNavigate }: HeroCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const slides: Slide[] = [
    {
      id: 1,
      title: '🔥 عروض حصرية على الهواتف الذكية',
      subtitle: 'خصومات تصل لـ 30%',
      description: 'اكتشف أحدث الهواتف الذكية بأفضل الأسعار في فلسطين مع ضمان شامل وتوصيل مجاني',
      image: 'https://images.unsplash.com/photo-1511227682637-ddb98c43c42c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTUxOTQ2NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      ctaText: 'تسوق الآن',
      ctaAction: () => onNavigate('offers'),
      badge: 'عروض محدودة',
      badgeColor: 'bg-gradient-to-r from-red-500 to-red-600',
      overlayColor: 'from-procell-primary/80 via-procell-primary/60 to-transparent',
      textPosition: 'left'
    },
    {
      id: 2,
      title: '🎁 باقات الإكسسوارات المتكاملة',
      subtitle: 'وفر أكثر مع الباقات',
      description: 'احصل على باقات شاملة من أفضل الإكسسوارات بأسعار لا تقاوم - كل ما تحتاجه لهاتفك',
      image: 'https://images.unsplash.com/photo-1647334864689-e140efbfd51f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG9uZSUyMGFjY2Vzc29yaWVzJTIwbGlmZXN0eWxlfGVufDF8fHx8MTc1NTE5OTk2M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      ctaText: 'اطلب باقتك',
      ctaAction: () => onNavigate('offers'),
      badge: 'توفير 40%',
      badgeColor: 'bg-gradient-to-r from-green-500 to-green-600',
      overlayColor: 'from-procell-secondary/80 via-procell-secondary/60 to-transparent',
      textPosition: 'right'
    },
    {
      id: 3,
      title: '🔧 خدمات الصيانة الاحترافية',
      subtitle: 'خبراء الإصلاح',
      description: 'ثق بخبرائنا لإصلاح هاتفك بأعلى معايير الجودة وأسرع وقت ممكن مع ضمان شامل',
      image: 'https://images.unsplash.com/photo-1552098904-72d422955307?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG9uZSUyMHJlcGFpciUyMHNlcnZpY2V8ZW58MXx8fHwxNzU1MTk5OTY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      ctaText: 'احجز موعد',
      ctaAction: () => onNavigate('maintenance'),
      badge: 'ضمان شامل',
      badgeColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
      overlayColor: 'from-procell-accent/80 via-procell-accent/60 to-transparent',
      textPosition: 'center'
    },
    {
      id: 4,
      title: '💰 برنامج شركاء النجاح',
      subtitle: 'اربح معنا حتى 15%',
      description: 'انضم لأكثر من 500 شريك ناجح واحصل على دخل إضافي ممتاز من التسويق بالعمولة',
      image: 'https://images.unsplash.com/photo-1650978810653-112cb6018092?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBhcnRuZXJzaGlwJTIwc3VjY2Vzc3xlbnwxfHx8fDE3NTUxNTU2ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      ctaText: 'انضم الآن',
      ctaAction: () => onNavigate('partners'),
      badge: 'دخل إضافي',
      badgeColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      overlayColor: 'from-yellow-600/80 via-yellow-600/60 to-transparent',
      textPosition: 'left'
    },
    {
      id: 5,
      title: '📱 هواتف بريميوم حصرية',
      subtitle: 'الأحدث والأفضل',
      description: 'استكشف مجموعتنا الحصرية من أحدث الهواتف الذكية مع أفضل المواصفات وأحدث التقنيات',
      image: 'https://images.unsplash.com/photo-1646872920793-4434b18747cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwbW9iaWxlJTIwcGhvbmV8ZW58MXx8fHwxNzU1MTk5OTcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      ctaText: 'استكشف المجموعة',
      ctaAction: () => onNavigate('offers'),
      badge: 'حصري',
      badgeColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
      overlayColor: 'from-purple-600/80 via-purple-600/60 to-transparent',
      textPosition: 'right'
    }
  ];

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
    }, 6000); // Increased to 6 seconds for better UX
  };



  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Page visibility API - pause when tab is not active
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Intersection Observer - pause when not in viewport
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
      setIsPlaying(false); // Stop auto-play on touch interaction
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

  return (
    <section className="relative w-full" ref={carouselRef}>
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
              <Card className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[85vh] overflow-hidden border-0 rounded-none">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <ImageLoader
                    src={getOptimizedImageUrl(slide.image, 1920, 1080)}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlayColor}`} />
                  
                  {/* Pattern Overlay for texture */}
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  />
                </div>

                {/* Content */}
                <div className="relative h-full flex items-center">
                  <div className="container mx-auto px-4 md:px-6 lg:px-8">
                    <div className={`max-w-4xl ${
                      slide.textPosition === 'center' ? 'mx-auto text-center' :
                      slide.textPosition === 'right' ? 'ml-auto text-right' :
                      'text-left'
                    }`}>
                      {/* Badge */}
                      {slide.badge && (
                        <div className="mb-4 animate-bounce">
                          <Badge className={`${slide.badgeColor} text-white px-4 py-2 text-sm font-medium shadow-lg`}>
                            <Star className="h-3 w-3 ml-1" />
                            {slide.badge}
                          </Badge>
                        </div>
                      )}

                      {/* Main Content */}
                      <div className="space-y-4 md:space-y-6 animate-fade-in">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight carousel-text-shadow">
                          {slide.title}
                        </h1>
                        
                        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white/90 carousel-text-shadow">
                          {slide.subtitle}
                        </h2>
                        
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-xl lg:max-w-2xl leading-relaxed carousel-text-shadow">
                          {slide.description}
                        </p>

                        {/* CTA Button */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-4">
                          <Button
                            onClick={slide.ctaAction}
                            size="lg"
                            className="w-full sm:w-auto bg-white text-procell-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold group"
                          >
                            {slide.ctaText}
                            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                          
                          {/* Secondary Action */}
                          <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-2 border-blue-500 text-white font-semibold shadow-lg hover:shadow-xl backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base transition-all duration-300 hover:scale-105"
                            onClick={() => onNavigate('contact')}
                          >
                            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                            تواصل معنا
                          </Button>
                        </div>

                        {/* Features Pills */}
                        <div className="flex flex-wrap gap-2 sm:gap-3 pt-4 sm:pt-6">
                          <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-white text-xs sm:text-sm">
                            <Zap className="h-3 w-3 sm:h-4 sm:w-4 ml-1.5 sm:ml-2" />
                            توصيل سريع
                          </div>
                          <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-white text-xs sm:text-sm">
                            <Gift className="h-3 w-3 sm:h-4 sm:w-4 ml-1.5 sm:ml-2" />
                            ضمان شامل
                          </div>
                          <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-white text-xs sm:text-sm">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 ml-1.5 sm:ml-2" />
                            دعم 24/7
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="left-4 md:left-8 bg-white border-2 border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl" />
        <CarouselNext className="right-4 md:right-8 bg-white border-2 border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl" />
      </Carousel>



      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <div 
          className="h-full bg-white transition-all duration-300 ease-out"
          style={{ width: `${((current - 1) / (count - 1)) * 100}%` }}
        />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
        <div className="flex flex-col items-center text-white/80">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
          <span className="text-xs mt-2">مرر للأسفل</span>
        </div>
      </div>
    </section>
  );
}