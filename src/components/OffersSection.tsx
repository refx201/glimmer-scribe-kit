import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Smartphone, 
  Zap, 
  Gift, 
  Clock, 
  Star, 
  ArrowRight, 
  ShoppingCart,
  Percent,
  Timer,
  Flame,
  Loader2
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useOffersData } from '@/hooks/use-offers-data';

export function OffersSection() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { flashDeals, dailyDeals, bundleDeals, loading, error } = useOffersData();

  const categories = [
    { id: 'all', name: 'جميع العروض', icon: <Gift className="h-4 w-4" /> },
    { id: 'flash', name: 'عروض البرق', icon: <Flame className="h-4 w-4" /> },
    { id: 'daily', name: 'العروض اليومية', icon: <Clock className="h-4 w-4" /> },
    { id: 'bundles', name: 'العروض المجمعة', icon: <Star className="h-4 w-4" /> }
  ];

  // Combine all offers
  const allOffers = [
    ...flashDeals.map(deal => ({ ...deal, category: 'flash', badgeType: 'urgent', badge: 'عرض البرق' })),
    ...dailyDeals.map(deal => ({ ...deal, category: 'daily', badgeType: 'popular', badge: 'عرض يومي' })),
    ...bundleDeals.map(deal => ({ ...deal, category: 'bundles', badgeType: 'best-deal', badge: 'باقة مميزة' }))
  ];

  const filteredOffers = selectedCategory === 'all' 
    ? allOffers 
    : allOffers.filter(offer => offer.category === selectedCategory);

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'popular': return 'bg-procell-primary text-white';
      case 'best-deal': return 'bg-procell-accent text-white';
      case 'new': return 'bg-procell-secondary text-white';
      case 'special': return 'bg-purple-500 text-white';
      case 'student': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <section id="offers" className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-procell-light/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-procell-primary" />
            <span className="mr-2 text-muted-foreground">جاري تحميل العروض...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="offers" className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-procell-light/30">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">حدث خطأ في تحميل العروض: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="offers" className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-procell-light/30">
      <div className="container mx-auto px-4">
        {/* Header - Mobile optimized */}
        <div className="text-center space-y-3 md:space-y-4 mb-8 md:mb-12 lg:mb-16">
          <Badge className="w-fit mx-auto bg-procell-secondary text-white px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm">
            <Flame className="h-3 w-3 md:h-4 md:w-4 ml-2" />
            عروض حصرية
          </Badge>
          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-procell-dark font-bold">
            أفضل العروض والخصومات
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            اكتشف أحدث العروض والخصومات الحصرية على الهواتف الذكية والإكسسوارات
          </p>
        </div>

        {/* Category Filter - Mobile friendly */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8 lg:mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-1.5 md:space-x-2 text-xs md:text-sm px-3 md:px-4 py-2 ${
                selectedCategory === category.id 
                  ? 'bg-procell-primary hover:bg-procell-primary/90' 
                  : 'border-procell-primary/20 text-procell-primary hover:bg-procell-primary/10'
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </Button>
          ))}
        </div>

        {/* Offers Grid - Mobile-first responsive */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {filteredOffers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 border-procell-primary/10 group">
              {/* Image */}
              <div className="relative">
                <ImageWithFallback
                  src={offer.image}
                  alt={offer.name}
                  className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badge */}
                <Badge className={`absolute top-2 md:top-3 right-2 md:right-3 ${getBadgeColor(offer.badgeType)} text-xs font-medium`}>
                  {offer.badge}
                </Badge>

                {/* Discount */}
                <div className="absolute top-2 md:top-3 left-2 md:left-3 bg-procell-secondary text-white px-2 py-1 rounded-lg text-xs md:text-sm font-bold">
                  خصم {offer.discount}
                </div>

                {/* Time Left */}
                {offer.timeLeft !== 'دائم' && (
                  <div className="absolute bottom-2 md:bottom-3 right-2 md:right-3 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                    <Timer className="h-3 w-3 ml-1" />
                    {offer.timeLeft}
                  </div>
                )}

                {/* Stock Status */}
                {offer.stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm">
                      نفد المخزون
                    </span>
                  </div>
                )}
              </div>

                <CardHeader className="pb-2 md:pb-3 px-3 md:px-6 pt-3 md:pt-6">
                <div className="space-y-1 md:space-y-2">
                  <CardTitle className="text-sm md:text-base lg:text-lg text-procell-dark group-hover:text-procell-primary transition-colors">
                    {offer.name}
                  </CardTitle>
                  <p className="text-xs md:text-sm text-muted-foreground">{offer.brand}</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 md:space-y-4 px-3 md:px-6 pb-3 md:pb-6">
                {/* Price - Mobile optimized */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5 md:space-x-2">
                      <span className="text-lg md:text-xl font-bold text-procell-primary">{offer.price} ₪</span>
                      <span className="text-xs md:text-sm text-muted-foreground line-through">{offer.originalPrice} ₪</span>
                    </div>
                    <div className="text-xs text-procell-accent font-medium">
                      وفر {(offer.originalPrice - offer.price).toLocaleString()} شيكل
                    </div>
                  </div>
                  <div className="text-xl md:text-2xl">
                    <Percent className="h-5 w-5 md:h-6 md:w-6 text-procell-secondary" />
                  </div>
                </div>

                {/* Features - Mobile responsive */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">المميزات الرئيسية:</p>
                  <div className="flex flex-wrap gap-1">
                    {offer.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-procell-primary/20 text-procell-primary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions - Mobile friendly */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1 bg-procell-primary hover:bg-procell-primary/90 text-xs md:text-sm py-2"
                  >
                    <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 ml-2" />
                    اطلب الآن
                  </Button>
                  <Button variant="outline" size="sm" className="border-procell-primary text-procell-primary hover:bg-procell-primary/10 px-2 md:px-3">
                    <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action - Mobile optimized */}
        <div className="text-center mt-8 md:mt-12 lg:mt-16">
          <div className="bg-gradient-to-r from-procell-primary/5 to-procell-secondary/5 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 max-w-2xl mx-auto border border-procell-primary/10">
            <h3 className="text-lg md:text-xl lg:text-2xl text-procell-dark mb-3 md:mb-4 font-bold">
              لا تفوت العروض الحصرية!
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 leading-relaxed">
              اشترك في النشرة الإخبارية واحصل على إشعارات بأحدث العروض والخصومات
            </p>
            <Button className="bg-procell-secondary hover:bg-procell-secondary/90 text-sm md:text-base px-6 md:px-8 py-2 md:py-3">
              <Clock className="h-4 w-4 ml-2" />
              اشترك في التنبيهات
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}