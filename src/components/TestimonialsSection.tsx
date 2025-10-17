import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Star, Quote, MapPin, Smartphone, Store } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: 'أحمد محمد',
      role: 'مالك متجر الأمل للهواتف',
      location: 'نابلس',
      rating: 5,
      text: 'منذ انضمامي لشبكة ProCell، زادت مبيعاتي بنسبة 40% وحصلت على دعم ممتاز من الفريق. الأسعار التنافسية والخدمة المميزة جعلت عملائي أكثر رضا والحمدلله الأرباح ممتازة.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      type: 'partner'
    },
    {
      id: 2,
      name: 'سارة أبو علي',
      role: 'معلمة',
      location: 'رام الله',
      rating: 5,
      text: 'خدمة استبدال الهاتف كانت سريعة وسهلة جداً. حصلت على سعر عادل لهاتفي القديم واشتريت جهاز جديد بسعر ممتاز. الصراحة فاقت توقعاتي، خدمة احترافية ونصحوني بأفضل خيار.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1ab?w=150&h=150&fit=crop&crop=face',
      type: 'customer'
    },
    {
      id: 3,
      name: 'عمر حسن',
      role: 'شريك نجاح',
      location: 'جنين',
      rating: 5,
      text: 'برنامج شركاء النجاح غير حياتي المهنية. أحقق دخلاً إضافياً ممتازاً من التسويق بالعمولة، والدعم من الفريق مستمر ومفيد. مش بس دخل إضافي، صار مصدر دخل أساسي الحمدلله.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      type: 'affiliate'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'partner':
        return <Store className="h-4 w-4" />;
      case 'affiliate':
        return <Star className="h-4 w-4" />;
      default:
        return <Quote className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'partner':
        return { text: 'شريك تجاري', color: 'bg-procell-primary' };
      case 'affiliate':
        return { text: 'شريك نجاح', color: 'bg-procell-secondary' };
      default:
        return { text: 'عميل مميز', color: 'bg-procell-accent' };
    }
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-procell-light/30 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12 md:mb-16">
          <Badge className="w-fit mx-auto bg-procell-accent text-white px-4 py-2">
            🌟 آراء عملائنا
          </Badge>
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-procell-dark">
            ماذا يقول <span className="text-procell-secondary">عملاؤنا وشركاؤنا</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            شهادات حقيقية من عملائنا وشركائنا الذين يثقون في خدماتنا يومياً
          </p>
        </div>

        {/* Testimonials Grid - 3 columns */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => {
            const badge = getTypeBadge(testimonial.type);
            return (
              <Card 
                key={testimonial.id} 
                className={`group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white/95 backdrop-blur-sm relative overflow-hidden ${
                  index === 1 ? 'md:scale-105 md:shadow-lg' : ''
                }`}
              >
                {/* Quote decoration */}
                <div className="absolute top-4 right-4 text-procell-primary/10 group-hover:text-procell-primary/20 transition-colors">
                  <Quote className="h-8 w-8" />
                </div>
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-procell-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardContent className="p-6 space-y-4 relative z-10">
                  {/* Rating & Badge */}
                  <div className="flex justify-between items-start">
                    <div className="flex text-procell-secondary">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                    <Badge className={`${badge.color} text-white text-xs shadow-md group-hover:scale-110 transition-transform`}>
                      {badge.text}
                    </Badge>
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-sm md:text-base text-procell-dark leading-relaxed font-medium">
                    "{testimonial.text}"
                  </blockquote>

                  {/* User Info */}
                  <div className="flex items-center space-x-4 pt-4 border-t border-procell-primary/10">
                    <div className="relative">
                      <ImageWithFallback
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-procell-primary/20 group-hover:border-procell-secondary/40 transition-colors"
                      />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-procell-accent rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-procell-dark truncate group-hover:text-procell-secondary transition-colors">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {testimonial.role}
                      </div>
                      <div className="flex items-center text-xs text-procell-primary mt-1">
                        <MapPin className="h-3 w-3 ml-1" />
                        {testimonial.location}
                      </div>
                    </div>
                    <div className="text-procell-primary group-hover:text-procell-secondary transition-colors group-hover:scale-110 transform">
                      {getTypeIcon(testimonial.type)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Call to Action */}
        <div className="text-center mt-12 md:mt-16">
          <div className="bg-gradient-to-r from-procell-primary/5 via-procell-secondary/5 to-procell-accent/5 rounded-2xl p-6 md:p-8 max-w-3xl mx-auto border border-procell-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl md:text-2xl text-procell-dark mb-4 font-semibold">
              🎯 انضم إلى عائلة راضية من العملاء
            </h3>
            <p className="text-muted-foreground mb-6 text-lg">
              اكتشف لماذا يختار الآلاف خدماتنا كل شهر ويحققون النجاح معنا
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Badge variant="outline" className="border-procell-primary text-procell-primary px-6 py-3 hover:bg-procell-primary hover:text-white transition-all cursor-pointer">
                <Star className="h-4 w-4 ml-2 fill-current" />
                تقييم 4.9/5 نجوم
              </Badge>
              <Badge variant="outline" className="border-procell-secondary text-procell-secondary px-6 py-3 hover:bg-procell-secondary hover:text-white transition-all cursor-pointer">
                <Smartphone className="h-4 w-4 ml-2" />
                +10,000 عميل راضي
              </Badge>
              <Badge variant="outline" className="border-procell-accent text-procell-accent px-6 py-3 hover:bg-procell-accent hover:text-white transition-all cursor-pointer">
                <Store className="h-4 w-4 ml-2" />
                +500 شريك معتمد
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}