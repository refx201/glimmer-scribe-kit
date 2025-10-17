import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, ShoppingCart, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useOffersData } from '@/hooks/use-offers-data';

export function ProductsSection() {
  const { products, packages, devicesData, accessoriesData, loading, error } = useOffersData();
  
  if (loading) {
    return (
      <section id="phones" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mr-2 text-muted-foreground">جاري تحميل المنتجات...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="phones" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">حدث خطأ في تحميل المنتجات: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Get featured products (devices)
  const featuredPhones = devicesData.slice(0, 4);
  
  // Get accessory bundles (packages)
  const accessoryBundles = packages.slice(0, 2);

  return (
    <section id="phones" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Phones Section */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl">أحدث الهواتف الذكية</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              اكتشف مجموعتنا المتميزة من الهواتف الذكية من أفضل العلامات التجارية العالمية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPhones.map((phone) => (
              <Card key={phone.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <ImageWithFallback
                    src={phone.image}
                    alt={phone.name}
                    className="w-full h-64 object-contain bg-gray-50 p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                  {phone.isLimitedTime && (
                    <Badge className="absolute top-3 right-3 bg-primary">
                      عرض محدود
                    </Badge>
                  )}
                  {phone.discount > 0 && (
                    <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                      خصم {phone.discount}%
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-6 space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{phone.brand}</p>
                    <h3 className="text-lg">{phone.name}</h3>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{phone.rating?.toFixed(1) || '4.5'}</span>
                    <span className="text-sm text-muted-foreground">({phone.reviews || 245})</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl text-primary">{phone.price} ₪</span>
                      {phone.originalPrice > phone.price && (
                        <span className="text-sm text-muted-foreground line-through">{phone.originalPrice} ₪</span>
                      )}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-6 pt-0">
                  <Button className="w-full">
                    <ShoppingCart className="h-4 w-4 ml-2" />
                    أضف للسلة
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Accessories Section */}
        <div id="accessories" className="space-y-12 mt-20">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl">باقات الإكسسوارات</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              احصل على أفضل العروض الشهرية للإكسسوارات المتنوعة
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {accessoryBundles.map((bundle) => (
              <Card key={bundle.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <ImageWithFallback
                    src={bundle.image}
                    alt={bundle.name}
                    className="w-full h-48 object-contain bg-gray-50 p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 right-3 bg-primary">
                    باقة متكاملة
                  </Badge>
                  {bundle.discount > 0 && (
                    <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                      خصم {bundle.discount}%
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl">{bundle.name}</h3>
                    <p className="text-muted-foreground">
                      {bundle.items?.length > 0 ? `${bundle.items.length} منتج` : 'باقة متنوعة'}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-3xl text-primary">{bundle.price} ₪</span>
                    {bundle.originalPrice > bundle.price && (
                      <span className="text-lg text-muted-foreground line-through">{bundle.originalPrice} ₪</span>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="p-6 pt-0">
                  <Button className="w-full" size="lg">
                    <ShoppingCart className="h-4 w-4 ml-2" />
                    اطلب الباقة الآن
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}