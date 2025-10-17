import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  ShoppingCart, 
  Star, 
  CheckCircle,
  Clock,
  Zap,
  TrendingUp,
  Award,
  CreditCard,
  Phone
} from 'lucide-react';

interface QuickSalesProps {
  onNavigate: (page: string) => void;
}

export function QuickSales({ onNavigate }: QuickSalesProps) {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  // Flash sales data with prominent CTAs
  const flashSales = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      originalPrice: 4799,
      salePrice: 3899,
      discount: 19,
      timeLeft: '23:45:12',
      image: 'https://images.unsplash.com/photo-1592286049617-3feb4da2681e?w=400&h=400&fit=crop&crop=center',
      rating: 4.9,
      reviews: 124,
      features: ['256GB', 'أحدث إصدار', 'ضمان سنتين'],
      badge: 'عرض البرق',
      badgeColor: 'bg-red-500',
      soldCount: 89,
      stockLeft: 11,
      installment: 325
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra',
      originalPrice: 3899,
      salePrice: 3199,
      discount: 18,
      timeLeft: '11:22:45',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&crop=center',
      rating: 4.8,
      reviews: 89,
      features: ['512GB', 'S Pen مجاناً', 'شاشة 120Hz'],
      badge: 'الأكثر مبيعاً',
      badgeColor: 'bg-green-500',
      soldCount: 156,
      stockLeft: 7,
      installment: 267
    },
    {
      id: 3,
      name: 'iPhone 14 Pro',
      originalPrice: 3599,
      salePrice: 2999,
      discount: 17,
      timeLeft: '05:18:33',
      image: 'https://images.unsplash.com/photo-1663481043767-6ca6de1b4c4d?w=400&h=400&fit=crop&crop=center',
      rating: 4.9,
      reviews: 234,
      features: ['128GB', 'Dynamic Island', 'كاميرا Pro'],
      badge: 'عرض محدود',
      badgeColor: 'bg-orange-500',
      soldCount: 203,
      stockLeft: 15,
      installment: 250
    }
  ];

  const handleQuickBuy = (product: any) => {
    // توليد رسالة واتساب مخصصة للمنتج
    const message = encodeURIComponent(`🛒 أريد شراء ${product.name} بسعر ${product.salePrice} شيكل فقط!\n\n📱 المنتج: ${product.name}\n💰 السعر: ${product.salePrice} شيكل بدلاً من ${product.originalPrice} شيكل\n⚡ خصم ${product.discount}%\n💳 تقسيط: ${product.installment} شيكل/شهر\n\nأريد تأكيد الطلب والحصول على تفاصيل التوصيل 🚚`);
    window.open(`https://wa.me/972598366822?text=${message}`, '_blank');
  };

  const handleQuickCall = (product: any) => {
    window.location.href = 'tel:+972598366822';
  };

  return (
    <section className="py-6 sm:py-8 md:py-12 bg-gradient-to-br from-red-50 via-white to-orange-50 border-t-4 border-red-500">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header with urgency */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <div className="p-2 bg-red-500 rounded-full animate-pulse">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="p-2 bg-red-500 rounded-full animate-pulse delay-75">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="p-2 bg-red-500 rounded-full animate-pulse delay-150">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-red-600 mb-2 sm:mb-3 animate-pulse">
            ⚡ <span className="text-procell-primary">عروض البرق - لفترة محدودة!</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-red-700 max-w-2xl mx-auto font-medium">
            خصومات حصرية تصل لـ 20% - العرض ينتهي خلال ساعات! 🔥
          </p>
          <div className="flex items-center justify-center space-x-4 mt-3">
            <Badge className="bg-red-100 text-red-700 text-xs sm:text-sm animate-bounce">
              ⏰ باقي أقل من 24 ساعة
            </Badge>
            <Badge className="bg-green-100 text-green-700 text-xs sm:text-sm">
              🚚 توصيل فوري مجاني
            </Badge>
          </div>
        </div>

        {/* Flash sales grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {flashSales.map((product) => (
            <Card 
              key={product.id} 
              className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-red-200/50 bg-white"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Urgency timer */}
              <div className="absolute top-2 left-2 right-2 z-10 flex justify-between items-start">
                <Badge className={`${product.badgeColor} text-white text-xs sm:text-sm animate-pulse shadow-lg`}>
                  {product.badge}
                </Badge>
                <div className="bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-mono">
                  ⏰ {product.timeLeft}
                </div>
              </div>

              {/* Stock indicator */}
              <div className="absolute top-12 left-2 z-10">
                <Badge className="bg-orange-500 text-white text-xs animate-pulse">
                  باقي {product.stockLeft} قطع
                </Badge>
              </div>

              {/* Image with hover effect */}
              <div className="relative aspect-square overflow-hidden">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Quick action buttons overlay */}
                <div className={`absolute bottom-2 left-2 right-2 flex space-x-2 transform transition-all duration-300 ${
                  hoveredProduct === product.id ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                }`}>
                  <Button
                    onClick={() => handleQuickBuy(product)}
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-lg text-xs font-semibold"
                  >
                    واتساب سريع
                  </Button>
                  <Button
                    onClick={() => handleQuickCall(product)}
                    size="sm"
                    variant="outline"
                    className="bg-white/90 hover:bg-white text-procell-primary border-white shadow-lg text-xs"
                  >
                    <Phone className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4 sm:p-5">
                {/* Product info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-procell-dark group-hover:text-procell-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    
                    {/* Rating and reviews */}
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium text-yellow-600">{product.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">({product.reviews} تقييم)</span>
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        تم بيع {product.soldCount}
                      </Badge>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {product.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-procell-secondary/30 text-procell-secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl sm:text-2xl font-bold text-red-600">
                          {product.salePrice.toLocaleString()} ₪
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          {product.originalPrice.toLocaleString()} ₪
                        </span>
                      </div>
                      <Badge className="bg-red-100 text-red-700 text-sm font-bold">
                        خصم {product.discount}%
                      </Badge>
                    </div>
                    
                    {/* Installment info */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <CreditCard className="h-3 w-3" />
                        <span>تقسيط من {product.installment} ₪/شهر</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-green-600">وفّر {(product.originalPrice - product.salePrice).toLocaleString()} ₪</span>
                      </div>
                    </div>
                  </div>

                  {/* Trust indicators */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>ضمان سنتين</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="h-3 w-3 text-procell-secondary" />
                      <span>أصلي 100%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-orange-500" />
                      <span>توصيل سريع</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button
                      onClick={() => handleQuickBuy(product)}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base py-2.5 font-bold"
                    >
                      <ShoppingCart className="h-4 w-4 ml-1.5" />
                      اشترِ الآن
                    </Button>
                    <Button
                      onClick={() => onNavigate('offers')}
                      variant="outline"
                      className="w-full border-2 border-procell-primary text-procell-primary hover:bg-procell-primary hover:text-white transition-all duration-300 text-sm sm:text-base py-2.5 font-medium"
                    >
                      التفاصيل
                    </Button>
                  </div>

                  {/* Installment CTA */}
                  <Button
                    onClick={() => handleQuickBuy(product)}
                    className="w-full bg-gradient-to-r from-procell-secondary to-procell-secondary-light hover:from-procell-secondary/90 hover:to-procell-secondary-light/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-sm font-medium py-2"
                  >
                    <CreditCard className="h-4 w-4 ml-1.5" />
                    اطلب بالتقسيط - {product.installment} ₪/شهر
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Urgency CTA section */}
        <div className="text-center bg-gradient-to-r from-red-500 via-red-600 to-red-700 p-6 sm:p-8 rounded-2xl shadow-2xl">
          <div className="max-w-3xl mx-auto text-white">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 animate-pulse">
              🔥 العرض ينتهي قريباً - لا تفوت الفرصة!
            </h3>
            <p className="text-sm sm:text-base mb-4 opacity-90">
              خصومات حصرية لن تتكرر + توصيل مجاني + ضمان شامل + إمكانية التقسيط
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Button
                onClick={() => {
                  const message = encodeURIComponent('🔥 أريد الاستفادة من عروض البرق الحصرية! أرسل لي تفاصيل جميع العروض المتاحة الآن 🛒');
                  window.open(`https://wa.me/972598366822?text=${message}`, '_blank');
                }}
                size="lg"
                className="w-full sm:w-auto bg-white text-red-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-6 sm:px-8 py-3 sm:py-4 font-bold text-sm sm:text-base"
              >
                <Zap className="h-5 w-5 ml-2" />
                اطلب عبر واتساب الآن
              </Button>
              <Button
                onClick={() => window.location.href = 'tel:+972598366822'}
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-red-600 transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 font-bold text-sm sm:text-base"
              >
                <Phone className="h-5 w-5 ml-2" />
                اتصل الآن - مجاناً
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}