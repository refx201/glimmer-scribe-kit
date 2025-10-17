import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Smartphone, 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  Heart, 
  Zap,
  Award,
  Shield,
  TrendingUp,
  Eye,
  Gift,
  Loader2
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useOffersData } from '@/hooks/use-offers-data';
import { useProducts } from '@/hooks/use-products';

export function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');

  const { products, packages, brands, loading, error } = useOffersData();

  const categories = [
    { value: 'all', label: 'جميع الفئات' },
    { value: 'device', label: 'هواتف ذكية' },
    { value: 'accessory', label: 'إكسسوارات' },
    { value: 'package', label: 'الباقات' }
  ];

  // Combine products and packages
  const allProducts = [...products, ...packages.map(pkg => ({ ...pkg, category: 'package' }))];

  // Filter products based on search and filters
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'package' && product.isBundle) ||
                           (selectedCategory === 'device' && product.category === 'هواتف ذكية') ||
                           (selectedCategory === 'accessory' && product.category === 'إكسسوارات');
    const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
    
    return matchesSearch && matchesCategory && matchesBrand;
  });

  return (
    <section id="phones" className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-300 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Badge className="bg-white/20 text-white px-3 py-1 border border-white/30">
              منتجاتنا
            </Badge>
            <Smartphone className="h-5 w-5 text-white animate-bounce" />
          </div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            <span className="block text-cyan-300 mb-2">أحدث الهواتف</span>
            <span className="block">بأفضل الأسعار</span>
          </h2>
          
          <p className="text-base md:text-lg text-blue-100 max-w-2xl mx-auto">
            اكتشف مجموعتنا الواسعة من أحدث الهواتف الذكية من جميع العلامات التجارية الرائدة
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-procell-primary/10 p-4 md:p-6 mb-8">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="ابحث عن منتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 border-procell-primary/20 focus:border-procell-primary"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="border-procell-primary/20 focus:border-procell-primary">
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Brand Filter */}
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="border-procell-primary/20 focus:border-procell-primary">
                <SelectValue placeholder="اختر العلامة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع العلامات</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.name}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-procell-primary/10">
            <span className="text-sm text-muted-foreground">
              تم العثور على {filteredProducts.length} منتج
            </span>
            <Button variant="outline" size="sm" className="border-procell-primary text-procell-primary hover:bg-procell-primary hover:text-white">
              <Filter className="h-4 w-4 ml-1" />
              مرشحات متقدمة
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-procell-primary" />
            <span className="mr-2 text-muted-foreground">جاري تحميل المنتجات...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <p className="text-red-500 mb-4">حدث خطأ في تحميل المنتجات: {error}</p>
              <Button onClick={() => window.location.reload()} className="bg-procell-primary hover:bg-procell-primary/90">
                إعادة المحاولة
              </Button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="relative">
                {/* Product Image */}
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  {product.isBundle && (
                    <Badge className="bg-procell-secondary text-white text-xs">
                      باقة
                    </Badge>
                  )}
                  {product.isLimitedTime && (
                    <Badge className="bg-procell-accent text-white text-xs">
                      عرض محدود
                    </Badge>
                  )}
                  {product.discount > 0 && (
                    <Badge className="bg-red-500 text-white text-xs">
                      خصم {product.discount}%
                    </Badge>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>

                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute bottom-3 right-3">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                      وفر {(product.originalPrice - product.price).toLocaleString()} ₪
                    </div>
                  </div>
                )}
              </div>

              <CardContent className="p-4 md:p-6">
                {/* Brand */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-procell-secondary font-medium">{product.brand}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">{product.rating} ({product.reviews})</span>
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-base md:text-lg font-semibold text-procell-dark mb-2 group-hover:text-procell-primary transition-colors">
                  {product.name}
                </h3>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.features.map((feature, index) => (
                    <span key={index} className="text-xs bg-procell-primary/10 text-procell-primary px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg md:text-xl font-bold text-procell-primary">
                        {product.price?.toLocaleString()} ₪
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {product.originalPrice?.toLocaleString()} ₪
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">شامل الضريبة والتوصيل</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex-1 bg-gradient-to-r from-procell-primary to-procell-secondary hover:from-procell-primary/90 hover:to-procell-secondary/90 text-white transform hover:scale-105 transition-all">
                    <ShoppingCart className="h-4 w-4 ml-1" />
                    أضف للسلة
                  </Button>
                  <Button variant="outline" size="sm" className="border-procell-accent text-procell-accent hover:bg-procell-accent hover:text-white">
                    <Zap className="h-4 w-4" />
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center space-x-4 mt-3 pt-3 border-t border-procell-primary/10">
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3 text-procell-accent" />
                    <span>ضمان سنة</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Gift className="h-3 w-3 text-procell-secondary" />
                    <span>توصيل مجاني</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              className="border-procell-primary text-procell-primary hover:bg-procell-primary hover:text-white transform hover:scale-105 transition-all"
            >
              <TrendingUp className="h-4 w-4 ml-2" />
              عرض المزيد من المنتجات
            </Button>
          </div>
        )}

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Smartphone className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-procell-dark mb-2">لم نجد منتجات مطابقة</h3>
              <p className="text-muted-foreground mb-6">
                جرب تغيير معايير البحث أو تصفح جميع المنتجات
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedBrand('all');
                }}
                className="bg-procell-primary hover:bg-procell-primary/90"
              >
                إعادة تعيين المرشحات
              </Button>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-procell-primary/10 to-procell-secondary/10 border-procell-primary/20">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-procell-dark mb-4">
                لم تجد ما تبحث عنه؟
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6">
                تواصل معنا وسنساعدك في العثور على الهاتف المثالي حسب احتياجاتك وميزانيتك
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-procell-primary hover:bg-procell-primary/90">
                  <Award className="h-4 w-4 ml-2" />
                  استشارة مجانية
                </Button>
                <Button variant="outline" className="border-procell-secondary text-procell-secondary hover:bg-procell-secondary hover:text-white">
                  <Heart className="h-4 w-4 ml-2" />
                  قائمة الأمنيات
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}