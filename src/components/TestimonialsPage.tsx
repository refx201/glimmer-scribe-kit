import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Star, Quote, MapPin, Smartphone, Store, Users, Award, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function TestimonialsPage() {
  const testimonials = [
    {
      id: 1,
      name: 'أحمد محمد',
      role: 'مالك متجر الأمل للهواتف',
      location: 'نابلس',
      rating: 5,
      text: 'منذ انضمامي لشبكة ProCell، زادت مبيعاتي بنسبة 40% وحصلت على دعم ممتاز من الفريق. الأسعار التنافسية والخدمة المميزة جعلت عملائي أكثر رضا.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      type: 'partner',
      date: 'نوفمبر 2024'
    },
    {
      id: 2,
      name: 'سارة أبو علي',
      role: 'عميلة',
      location: 'رام الله',
      rating: 5,
      text: 'خدمة استبدال الهاتف كانت سريعة وسهلة جداً. حصلت على سعر عادل لهاتفي القديم واشتريت جهاز جديد بسعر ممتاز. أنصح بشدة!',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1ab?w=150&h=150&fit=crop&crop=face',
      type: 'customer',
      date: 'أكتوبر 2024'
    },
    {
      id: 3,
      name: 'محمد خالد',
      role: 'فني صيانة معتمد',
      location: 'الخليل',
      rating: 5,
      text: 'العمل مع ProCell فتح لي فرص كثيرة. التدريب المجاني والدعم الفني المستمر ساعدني في تطوير مهاراتي وزيادة دخلي بشكل كبير.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      type: 'technician',
      date: 'سبتمبر 2024'
    },
    {
      id: 4,
      name: 'ليلى صالح',
      role: 'عميلة',
      location: 'بيت لحم',
      rating: 5,
      text: 'صيانة هاتفي تمت في أقل من 24 ساعة وبجودة عالية. الفريق محترف والأسعار معقولة جداً. سأعود بالتأكيد لأي خدمة أحتاجها مستقبلاً.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      type: 'customer',
      date: 'نوفمبر 2024'
    },
    {
      id: 5,
      name: 'عمر حسن',
      role: 'شريك نجاح',
      location: 'جنين',
      rating: 5,
      text: 'برنامج شركاء النجاح غير حياتي المهنية. أحقق دخلاً إضافياً ممتازاً من التسويق بالعمولة، والدعم من الفريق مستمر ومفيد.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      type: 'affiliate',
      date: 'أكتوبر 2024'
    },
    {
      id: 6,
      name: 'فاطمة أحمد',
      role: 'مالكة محل إكسسوارات',
      location: 'طولكرم',
      rating: 5,
      text: 'الشراكة مع ProCell وفرت لي مجموعة متنوعة من الإكسسوارات عالية الجودة. عملائي راضون والأرباح ممتازة.',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      type: 'partner',
      date: 'سبتمبر 2024'
    },
    {
      id: 7,
      name: 'يوسف قاسم',
      role: 'عميل',
      location: 'غزة',
      rating: 5,
      text: 'اشتريت iPhone 15 من ProCell والخدمة كانت استثنائية. السعر منافس والضمان ممتاز. التوصيل كان سريع رغم الظروف.',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face',
      type: 'customer',
      date: 'نوفمبر 2024'
    },
    {
      id: 8,
      name: 'مريم سالم',
      role: 'عميلة',
      location: 'القدس',
      rating: 5,
      text: 'خدمة العملاء رائعة! ساعدوني في اختيار الهاتف المناسب لاحتياجاتي وميزانيتي. الموظفون خبراء ومتعاونون جداً.',
      avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face',
      type: 'customer',
      date: 'أكتوبر 2024'
    },
    {
      id: 9,
      name: 'خالد عبدالله',
      role: 'مالك متجر التقنيات الحديثة',
      location: 'سلفيت',
      rating: 5,
      text: 'أفضل شريك تجاري تعاملت معه. الدعم التسويقي والتدريب على المنتجات الجديدة ساعدني كثيراً في زيادة المبيعات.',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
      type: 'partner',
      date: 'سبتمبر 2024'
    }
  ];

  const stats = [
    { number: '4.9/5', label: 'تقييم العملاء', icon: <Star className="h-5 w-5" /> },
    { number: '+10,000', label: 'عميل راضي', icon: <Users className="h-5 w-5" /> },
    { number: '+500', label: 'شريك معتمد', icon: <Store className="h-5 w-5" /> },
    { number: '98%', label: 'معدل الرضا', icon: <Award className="h-5 w-5" /> }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'partner':
        return <Store className="h-4 w-4" />;
      case 'technician':
        return <Smartphone className="h-4 w-4" />;
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
      case 'technician':
        return { text: 'فني معتمد', color: 'bg-procell-accent' };
      case 'affiliate':
        return { text: 'شريك نجاح', color: 'bg-procell-secondary' };
      default:
        return { text: 'عميل', color: 'bg-procell-neutral' };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-procell-light/30 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 mb-12">
            <Badge className="w-fit mx-auto bg-procell-accent text-white px-4 py-2">
              <Users className="h-4 w-4 ml-2" />
              آراء عملائنا
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl text-procell-dark">
              ماذا يقول عملاؤنا وشركاؤنا
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              شهادات حقيقية من آلاف العملاء والشركاء الذين يثقون في خدماتنا يومياً عبر فلسطين
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-procell-primary/20 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <div className="text-procell-primary mx-auto w-fit">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-procell-primary">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial) => {
              const badge = getTypeBadge(testimonial.type);
              return (
                <Card key={testimonial.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-procell-primary/10 relative overflow-hidden">
                  {/* Quote decoration */}
                  <div className="absolute top-4 right-4 text-procell-primary/10">
                    <Quote className="h-8 w-8" />
                  </div>
                  
                  <CardContent className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex text-procell-secondary">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <Badge className={`${badge.color} text-white text-xs`}>
                        {badge.text}
                      </Badge>
                    </div>

                    {/* Testimonial Text */}
                    <blockquote className="text-sm md:text-base text-procell-dark leading-relaxed">
                      "{testimonial.text}"
                    </blockquote>

                    {/* User Info */}
                    <div className="flex items-center space-x-4 pt-4 border-t border-procell-primary/10">
                      <ImageWithFallback
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-procell-primary/20"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-procell-dark truncate">
                          {testimonial.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {testimonial.role}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center text-xs text-procell-primary">
                            <MapPin className="h-3 w-3 ml-1" />
                            {testimonial.location}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {testimonial.date}
                          </div>
                        </div>
                      </div>
                      <div className="text-procell-primary">
                        {getTypeIcon(testimonial.type)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Call to Action Section */}
          <div className="mt-16 md:mt-20">
            <div className="bg-gradient-to-r from-procell-primary/5 to-procell-secondary/5 rounded-3xl p-8 md:p-12 text-center border border-procell-primary/10">
              <h3 className="text-2xl md:text-3xl text-procell-dark mb-6">
                انضم إلى عائلة راضية من العملاء
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                اكتشف لماذا يختار آلاف العملاء والشركاء خدماتنا كل شهر عبر فلسطين
              </p>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Badge variant="outline" className="border-procell-primary text-procell-primary px-4 py-3 justify-center">
                  <Star className="h-4 w-4 ml-2" />
                  تقييم 4.9/5
                </Badge>
                <Badge variant="outline" className="border-procell-secondary text-procell-secondary px-4 py-3 justify-center">
                  <CheckCircle className="h-4 w-4 ml-2" />
                  ضمان الجودة
                </Badge>
                <Badge variant="outline" className="border-procell-accent text-procell-accent px-4 py-3 justify-center">
                  <Store className="h-4 w-4 ml-2" />
                  +500 شريك
                </Badge>
                <Badge variant="outline" className="border-procell-neutral text-procell-neutral px-4 py-3 justify-center">
                  <Users className="h-4 w-4 ml-2" />
                  دعم 24/7
                </Badge>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-procell-primary hover:bg-procell-primary/90 text-white px-8 py-3 rounded-lg transition-colors">
                  ابدأ التسوق الآن
                </button>
                <button className="border-2 border-procell-secondary text-procell-secondary hover:bg-procell-secondary hover:text-white px-8 py-3 rounded-lg transition-colors">
                  انضم كشريك
                </button>
              </div>
            </div>
          </div>

          {/* Leave Review Section */}
          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto border-procell-accent/20">
              <CardContent className="p-8">
                <h4 className="text-xl text-procell-dark mb-4">شارك تجربتك معنا</h4>
                <p className="text-muted-foreground mb-6">
                  هل تعاملت معنا؟ نحب أن نسمع رأيك وتقييمك لخدماتنا
                </p>
                <button className="bg-procell-accent hover:bg-procell-accent/90 text-white px-6 py-2 rounded-lg transition-colors">
                  اترك تقييماً
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}