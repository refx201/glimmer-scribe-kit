import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  Star,
  ShoppingCart,
  ArrowRight,
  TrendingUp,
  Users,
  Award,
  CheckCircle
} from 'lucide-react';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaSecondary: string;
  ctaAction: string;
  badge: string;
  theme: 'primary' | 'secondary' | 'accent';
}

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const heroSlides: HeroSlide[] = [
    {
      id: 1,
      title: 'أحدث الهواتف الذكية',
      subtitle: 'بأفضل الأسعار في فلسطين',
      description: 'اكتشف مجموعة واسعة من الهواتف الذكية الأصلية مع ضمان شامل وخدمة توصيل مجانية لجميع أنحاء فلسطين',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=800&fit=crop&crop=center',
      ctaText: 'تسوق الآن',
      ctaSecondary: 'اكتشف العروض',
      ctaAction: 'offers',
      badge: 'جديد',
      theme: 'primary'
    },
    {
      id: 2,
      title: 'انضم لبرنامج الشراكة',
      subtitle: 'واربح حتى 15% عمولة',
      description: 'ابدأ رحلتك في التسويق بالعمولة مع برنامج شركاء النجاح. أكثر من 500 شريك نشط يحققون أرباحاً ممتازة شهرياً',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800&fit=crop&crop=center',
      ctaText: 'ابدأ الآن',
      ctaSecondary: 'تعرف على المزيد',
      ctaAction: 'partners',
      badge: 'مربح',
      theme: 'secondary'
    },
    {
      id: 3,
      title: 'خدمات الصيانة المتقدمة',
      subtitle: 'إصلاح سريع ومضمون',
      description: 'خدمات صيانة احترافية للهواتف الذكية على يد فنيين معتمدين مع ضمان شامل وقطع غيار أصلية',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=800&fit=crop&crop=center',
      ctaText: 'احجز موعد',
      ctaSecondary: 'عرض الخدمات',
      ctaAction: 'contact',
      badge: 'موثوق',
      theme: 'accent'
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, heroSlides.length]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleCTAClick = (action: string) => {
    const event = new CustomEvent('heroNavigation', { detail: action });
    window.dispatchEvent(event);
  };

  const currentSlideData = heroSlides[currentSlide];
  
  const getThemeClasses = (theme: 'primary' | 'secondary' | 'accent') => {
    switch (theme) {
      case 'primary':
        return {
          gradient: 'from-gradient-deep-start via-gradient-blue-mid to-gradient-blue-end',
          badge: 'bg-gradient-blue-end text-white shadow-lg',
          primaryButton: 'bg-white text-gradient-deep-start hover:bg-gray-50 shadow-xl hover:shadow-2xl',
          secondaryButton: 'bg-white/20 border-2 border-white/40 text-white hover:bg-white/30 hover:border-white/60 backdrop-blur-sm'
        };
      case 'secondary':
        return {
          gradient: 'from-gradient-blue-start via-procell-secondary to-gradient-blue-end',
          badge: 'bg-white text-gradient-blue-start shadow-lg',
          primaryButton: 'bg-white text-gradient-blue-start hover:bg-gray-50 shadow-xl hover:shadow-2xl',
          secondaryButton: 'bg-white/20 border-2 border-white/40 text-white hover:bg-white/30 hover:border-white/60 backdrop-blur-sm'
        };
      case 'accent':
        return {
          gradient: 'from-procell-accent via-gradient-blue-mid to-procell-secondary',
          badge: 'bg-white text-procell-accent shadow-lg',
          primaryButton: 'bg-white text-procell-accent hover:bg-gray-50 shadow-xl hover:shadow-2xl',
          secondaryButton: 'bg-white/20 border-2 border-white/40 text-white hover:bg-white/30 hover:border-white/60 backdrop-blur-sm'
        };
    }
  };

  const themeClasses = getThemeClasses(currentSlideData.theme);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16 lg:pt-20">
      {/* Background Image Slider */}
      <div className="absolute inset-0 z-0">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ImageWithFallback
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${themeClasses.gradient}`} />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
            {/* Left Content */}
            <div 
              className="text-white space-y-6 lg:space-y-8 animate-slide-up"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Badge */}
              <div className="flex items-center space-x-3">
                <Badge className={`${themeClasses.badge} px-4 py-2 text-sm font-medium shadow-lg`}>
                  {currentSlideData.badge}
                </Badge>
                <div className="flex items-center space-x-2 text-white/80 text-sm">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                  <span>جديد في ProCell</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="space-y-4 lg:space-y-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  {currentSlideData.title}
                </h1>
                
                <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-white/90">
                  {currentSlideData.subtitle}
                </p>
                
                <p className="text-base md:text-lg lg:text-xl text-white/80 max-w-2xl leading-relaxed">
                  {currentSlideData.description}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 lg:pt-8">
                <Button
                  size="lg"
                  onClick={() => handleCTAClick(currentSlideData.ctaAction)}
                  className={`${themeClasses.primaryButton} transition-all duration-300 hover:scale-105 px-8 py-4 text-base font-semibold min-w-[180px]`}
                >
                  {currentSlideData.ctaText}
                  <ArrowRight className="h-5 w-5 mr-2" />
                </Button>
                
                <Button
                  size="lg"
                  className={`bg-white/20 border-2 border-white/40 text-white hover:bg-white/30 hover:border-white/60 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 min-w-[180px] px-8 py-4 text-base font-semibold`}
                  onClick={() => handleCTAClick('offers')}
                >
                  {currentSlideData.ctaSecondary}
                </Button>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-6 pt-6 lg:pt-12">
                <div className="flex items-center space-x-3 text-white/90">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">ضمان شامل</div>
                    <div className="text-sm text-white/70">لجميع المنتجات</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-white/90">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">أسعار تنافسية</div>
                    <div className="text-sm text-white/70">بأفضل الخصومات</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-white/90">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">دعم 24/7</div>
                    <div className="text-sm text-white/70">خدمة عملاء متميزة</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Stats */}
            <div className="hidden lg:flex flex-col space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
                    <Star className="h-8 w-8 ml-2 text-yellow-400" />
                    4.9
                  </div>
                  <div className="text-white/80 text-sm">تقييم العملاء</div>
                  <div className="text-white/60 text-xs mt-1">+10,000 مراجعة</div>
                </div>
                
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
                    <Users className="h-8 w-8 ml-2 text-blue-400" />
                    500+
                  </div>
                  <div className="text-white/80 text-sm">شريك نشط</div>
                  <div className="text-white/60 text-xs mt-1">في برنامج الشراكة</div>
                </div>
                
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
                    <ShoppingCart className="h-8 w-8 ml-2 text-green-400" />
                    15K+
                  </div>
                  <div className="text-white/80 text-sm">منتج متوفر</div>
                  <div className="text-white/60 text-xs mt-1">هواتف وإكسسوارات</div>
                </div>
                
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
                    <Award className="h-8 w-8 ml-2 text-purple-400" />
                    100%
                  </div>
                  <div className="text-white/80 text-sm">منتجات أصلية</div>
                  <div className="text-white/60 text-xs mt-1">مع الضمان</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-6 bg-black/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20">
          {/* Auto-play control */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
            aria-label={isAutoPlaying ? 'إيقاف التشغيل التلقائي' : 'تشغيل تلقائي'}
          >
            {isAutoPlaying ? (
              <Pause className="h-4 w-4 text-white" />
            ) : (
              <Play className="h-4 w-4 text-white" />
            )}
          </button>

          {/* Slide indicators */}
          <div className="flex space-x-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentSlide
                    ? 'w-8 h-3 bg-white rounded-full'
                    : 'w-3 h-3 bg-white/50 hover:bg-white/70 rounded-full'
                }`}
                aria-label={`انتقل إلى الشريحة ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation arrows */}
          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
              aria-label="الشريحة السابقة"
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
              aria-label="الشريحة التالية"
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile swipe indicator */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10 lg:hidden">
        <div className="flex items-center space-x-2 text-white/70 text-sm bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
          <ChevronLeft className="h-4 w-4 animate-pulse" />
          <span>اسحب للتنقل</span>
          <ChevronRight className="h-4 w-4 animate-pulse" />
        </div>
      </div>
    </section>
  );
}