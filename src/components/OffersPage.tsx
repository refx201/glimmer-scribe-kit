import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Skeleton } from './ui/skeleton';
import * as LucideIcons from 'lucide-react';

import { 
  Smartphone, 
  Search, 
  Star, 
  ShoppingCart, 
  Heart, 
  Zap,
  Shield,
  Eye,
  Gift,
  Clock,
  Percent,
  Tag,
  ArrowRight,
  Timer,
  Headphones,
  Watch,
  Battery,
  Tablet,
  SlidersHorizontal,
  X,
  RotateCcw,
  Grid3X3,
  List,
  ArrowUpDown,
  DollarSign,
  Minus,
  AlertCircle
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from '../lib/cart-context';
import { useOffersData } from '../hooks/use-offers-data';
import { CompactFilterBar } from './CompactFilterBar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface OffersPageProps {
  onNavigate?: (page: 'product', productId?: string) => void;
}

export function OffersPage({ onNavigate }: OffersPageProps = {}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('flash-deals');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Enhanced price filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [minPriceInput, setMinPriceInput] = useState('0');
  const [maxPriceInput, setMaxPriceInput] = useState('5000');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const { addItem } = useCart();
  
  // Fetch data from Supabase
  const { 
    flashDeals, 
    dailyDeals, 
    bundleDeals, 
    devicesData, 
    accessoriesData, 
    brands,
    loading, 
    error 
  } = useOffersData();

  // Fetch filter categories from database
  const { data: filterCategories = [] } = useQuery({
    queryKey: ['filter-categories-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_filter_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      if (error) throw error;
      return data || [];
    },
  });

  const deviceCategories = filterCategories.filter(c => c.type === 'device');
  const accessoryCategories = filterCategories.filter(c => c.type === 'accessory');

  // Helper to get icon component
  const getIconComponent = (iconName: string, size: string = 'h-4 w-4') => {
    const IconComponent = (LucideIcons as any)[iconName] || Smartphone;
    return <IconComponent className={`${size} ml-1`} />;
  };

  // Filter options - use brands from database
  const brandOptions = brands.map(brand => brand.name);

  // Enhanced price handling functions
  const handleSliderChange = (values: number[]) => {
    setPriceRange(values as [number, number]);
    setMinPriceInput(values[0].toString());
    setMaxPriceInput(values[1].toString());
  };

  const handleMinPriceChange = (value: string) => {
    setMinPriceInput(value);
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= priceRange[1]) {
      setPriceRange([numValue, priceRange[1]]);
    }
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPriceInput(value);
    const numValue = parseInt(value) || 5000;
    if (numValue >= priceRange[0] && numValue <= 5000) {
      setPriceRange([priceRange[0], numValue]);
    }
  };

  const validateAndSetPriceRange = () => {
    const minValue = Math.max(0, parseInt(minPriceInput) || 0);
    const maxValue = Math.min(5000, parseInt(maxPriceInput) || 5000);
    
    if (minValue <= maxValue) {
      setPriceRange([minValue, maxValue]);
      setMinPriceInput(minValue.toString());
      setMaxPriceInput(maxValue.toString());
    } else {
      // Reset to previous valid values
      setMinPriceInput(priceRange[0].toString());
      setMaxPriceInput(priceRange[1].toString());
    }
  };

  // Quick price preset buttons
  const pricePresets = [
    { label: 'تحت 500 ₪', min: 0, max: 500 },
    { label: '500-1000 ₪', min: 500, max: 1000 },
    { label: '1000-2000 ₪', min: 1000, max: 2000 },
    { label: '2000-3000 ₪', min: 2000, max: 3000 },
    { label: 'فوق 3000 ₪', min: 3000, max: 5000 }
  ];

  const applyPricePreset = (min: number, max: number) => {
    setPriceRange([min, max]);
    setMinPriceInput(min.toString());
    setMaxPriceInput(max.toString());
  };

  // Simplified filter function - only price, brands, category, and search
  const filterProducts = (products: any[]) => {
    return products.filter(product => {
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      // Filter category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.filter_category_id)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Search term filter
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      return true;
    });
  };

  // Sort products
  const sortProducts = (products: any[]) => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'discount':
        return sorted.sort((a, b) => b.discount - a.discount);
      case 'newest':
        return sorted.sort((a, b) => b.id - a.id);
      default:
        return sorted;
    }
  };

  // Reset filters function
  const resetFilters = () => {
    setPriceRange([0, 5000]);
    setMinPriceInput('0');
    setMaxPriceInput('5000');
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedCategory('all');
    setSearchTerm('');
  };

  // Enhanced filter sidebar component
  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="text-sm font-medium text-gray-900 mb-2 block">البحث</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="ابحث عن منتج..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Enhanced Price Range */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
        <label className="text-sm font-medium text-gray-900 mb-4 block flex items-center">
          <DollarSign className="h-4 w-4 ml-1 text-blue-600" />
          نطاق السعر
        </label>
        
        {/* Price Input Fields */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs text-gray-600 mb-1 block">الحد الأدنى</label>
            <div className="relative">
              <Input
                type="number"
                value={minPriceInput}
                onChange={(e) => handleMinPriceChange(e.target.value)}
                onBlur={validateAndSetPriceRange}
                placeholder="0"
                min="0"
                max="5000"
                className="text-center border-blue-200 focus:border-blue-400 bg-white"
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">₪</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">الحد الأقصى</label>
            <div className="relative">
              <Input
                type="number"
                value={maxPriceInput}
                onChange={(e) => handleMaxPriceChange(e.target.value)}
                onBlur={validateAndSetPriceRange}
                placeholder="5000"
                min="0"
                max="5000"
                className="text-center border-blue-200 focus:border-blue-400 bg-white"
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">₪</span>
            </div>
          </div>
        </div>

        {/* Enhanced Slider */}
        <div className="px-1 mb-4">
          <Slider
            value={priceRange}
            onValueChange={handleSliderChange}
            max={5000}
            min={0}
            step={50}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span className="bg-blue-100 px-2 py-1 rounded text-blue-700 font-medium">
              {priceRange[0].toLocaleString()} ₪
            </span>
            <Minus className="h-3 w-3 text-gray-400 self-center" />
            <span className="bg-purple-100 px-2 py-1 rounded text-purple-700 font-medium">
              {priceRange[1].toLocaleString()} ₪
            </span>
          </div>
        </div>

        {/* Quick Price Presets */}
        <div className="space-y-2">
          <label className="text-xs text-gray-600 block">نطاقات سريعة:</label>
          <div className="grid grid-cols-1 gap-1">
            {pricePresets.map((preset, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => applyPricePreset(preset.min, preset.max)}
                className={`text-xs h-8 justify-start transition-all ${
                  priceRange[0] === preset.min && priceRange[1] === preset.max
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'hover:bg-blue-50 border-gray-200'
                }`}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Price Range Summary */}
        <div className="mt-3 p-2 bg-white/70 rounded-lg border border-blue-200">
          <div className="text-xs text-center text-gray-600">
            نطاق مُحدد: <span className="font-semibold text-blue-600">
              {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} ₪
            </span>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div>
        <label className="text-sm font-medium text-gray-900 mb-3 block">العلامة التجارية</label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {brandOptions.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={brand}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedBrands([...selectedBrands, brand]);
                  } else {
                    setSelectedBrands(selectedBrands.filter(b => b !== brand));
                  }
                }}
              />
              <label htmlFor={brand} className="text-sm text-gray-700 cursor-pointer flex-1">
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Filters */}
      <div className="pt-4 border-t">
        <Button
          variant="outline"
          onClick={resetFilters}
          className="w-full text-red-600 border-red-200 hover:bg-red-50"
        >
          <RotateCcw className="h-4 w-4 ml-2" />
          إعادة تعيين الفلاتر
        </Button>
      </div>
    </div>
  );

  const renderProductCard = (product: any, isFlash = false, isBundle = false) => (
    <Card 
      className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 bg-white overflow-hidden cursor-pointer h-full flex flex-col rounded-2xl"
      onClick={() => onNavigate?.('product', product.id.toString())}
    >
      {/* Product Image */}
      <div className="relative bg-gray-50 p-4 md:p-10 flex items-center justify-center" style={{ minHeight: '320px' }}>
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-auto h-auto object-contain max-h-72 md:max-h-96 max-w-full md:max-w-[85%]"
        />
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 right-3 z-20">
            <Badge className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{product.discount}%
            </Badge>
          </div>
        )}

        {/* Flash/Bundle Badges */}
        {isFlash && (
          <div className="absolute top-3 left-3 z-20">
            <Badge className="bg-red-500 text-white text-xs animate-pulse">
              عرض سريع
            </Badge>
          </div>
        )}
        {isBundle && (
          <div className="absolute top-3 left-3 z-20">
            <Badge className="bg-procell-accent text-white text-xs">
              باقة مميزة
            </Badge>
          </div>
        )}
      </div>

      {/* Product Info */}
      <CardContent className="p-4 flex-1 flex flex-col bg-white">
        {/* Product Title */}
        <h3 className="font-semibold text-base text-gray-900 mb-3 line-clamp-2 min-h-[48px]">
          {product.name}
        </h3>
        
        {/* Price Section */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-2xl font-bold text-blue-600">
              {product.price.toLocaleString()} ₪
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                {product.originalPrice.toLocaleString()} ₪
              </span>
            )}
          </div>
          {product.originalPrice > product.price && (
            <div className="text-xs text-gray-600">
              متوفر بـ 4 دفعات
            </div>
          )}
        </div>

        {/* Stock Progress Bar */}
        {product.stock && product.stock <= 20 && (
          <div className="mb-3">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((product.stock / 20) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Action Button */}
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            addItem({
              productId: product.id,
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice || product.price,
              discount: product.discount || 0,
              image: product.image,
              brandId: product.brandId,
              maxStock: product.stock || 10,
              quantity: 1
            });
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 mt-auto rounded-lg"
        >
          <ShoppingCart className="h-4 w-4 ml-2" />
          أضف الآن
        </Button>
      </CardContent>
    </Card>
  );

  // Get current products based on active tab
  const getCurrentProducts = () => {
    switch (activeTab) {
      case 'devices':
        return filterProducts(devicesData);
      case 'accessories':
        return filterProducts(accessoriesData);
      case 'flash-deals':
        return filterProducts(flashDeals);
      case 'daily-deals':
        return filterProducts(dailyDeals);
      case 'bundles':
        return filterProducts(bundleDeals);
      default:
        return [];
    }
  };

  const currentProducts = sortProducts(getCurrentProducts());
  const hasActiveFilters = selectedBrands.length > 0 || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 5000 || searchTerm;

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-procell-light/20 to-white">
        {/* Hero Section Skeleton */}
        <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-r from-procell-primary via-procell-primary to-procell-secondary text-white relative overflow-hidden pt-20 md:pt-24">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <Skeleton className="h-8 w-48 mx-auto mb-6 bg-white/20" />
              <Skeleton className="h-12 w-full max-w-2xl mx-auto mb-4 bg-white/20" />
              <Skeleton className="h-6 w-full max-w-xl mx-auto mb-8 bg-white/20" />
              <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto">
                <Skeleton className="h-24 w-full bg-white/20" />
                <Skeleton className="h-24 w-full bg-white/20" />
                <Skeleton className="h-24 w-full bg-white/20" />
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Category Buttons Skeleton */}
          <div className="mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-24 md:h-32 w-full" />
              ))}
            </div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-procell-light/20 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">خطأ في تحميل البيانات</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            <RotateCcw className="h-4 w-4 ml-2" />
            إعادة المحاولة
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-procell-light/20 to-white">
      {/* Hero Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-r from-procell-primary via-procell-primary to-procell-secondary text-white relative overflow-hidden pt-20 md:pt-24">
        {/* Enhanced background with better contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-procell-primary/98 to-procell-secondary/98"></div>
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-procell-accent rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Badge className="bg-procell-accent text-white px-4 py-2 text-sm font-semibold shadow-lg">
                العروض الحصرية
              </Badge>
              <Percent className="h-6 w-6 text-procell-accent animate-spin" />
            </div>
            
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 text-white drop-shadow-lg">
              <span className="block mb-3">🔥 أفضل العروض والخصومات</span>
              <span className="block text-procell-accent-light bg-gradient-to-r from-procell-accent-light to-white bg-clip-text text-transparent">على الهواتف الذكية</span>
            </h1>
            
            <p className="text-base md:text-lg lg:text-xl text-white/95 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              اكتشف عروضنا الحصرية وخصوماتنا الاستثنائية على أحدث الهواتف الذكية والإكسسوارات
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-procell-accent-light drop-shadow-lg">50%</div>
                <div className="text-sm md:text-base text-white font-medium">خصم حتى</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">100+</div>
                <div className="text-sm md:text-base text-white font-medium">عرض يومي</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-procell-accent-light drop-shadow-lg">24h</div>
                <div className="text-sm md:text-base text-white font-medium">عروض سريعة</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Category Buttons */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900">تصفح حسب الفئة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            <Button
              onClick={() => setActiveTab('flash-deals')}
              variant={activeTab === 'flash-deals' ? 'default' : 'outline'}
              className={`h-24 md:h-32 flex-col text-center relative overflow-hidden group transition-all duration-300 ${
                activeTab === 'flash-deals' 
                ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-xl border-red-500' 
                : 'bg-white hover:bg-red-50 border-red-200 hover:border-red-300'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Zap className={`h-8 w-8 mb-2 relative z-10 ${activeTab === 'flash-deals' ? 'text-white' : 'text-red-500'}`} />
              <span className={`font-semibold text-sm md:text-base relative z-10 ${activeTab === 'flash-deals' ? 'text-white' : 'text-red-600'}`}>
                HOT SALE
              </span>
              <span className={`text-xs relative z-10 ${activeTab === 'flash-deals' ? 'text-red-100' : 'text-red-400'}`}>
                عروض سريعة
              </span>
            </Button>

            <Button
              onClick={() => setActiveTab('bundles')}
              variant={activeTab === 'bundles' ? 'default' : 'outline'}
              className={`h-24 md:h-32 flex-col text-center relative overflow-hidden group transition-all duration-300 ${
                activeTab === 'bundles' 
                ? 'bg-gradient-to-br from-procell-accent to-green-600 text-white shadow-xl border-procell-accent' 
                : 'bg-white hover:bg-green-50 border-green-200 hover:border-green-300'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-procell-accent/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Gift className={`h-8 w-8 mb-2 relative z-10 ${activeTab === 'bundles' ? 'text-white' : 'text-procell-accent'}`} />
              <span className={`font-semibold text-sm md:text-base relative z-10 ${activeTab === 'bundles' ? 'text-white' : 'text-procell-accent'}`}>
                PACKAGES
              </span>
              <span className={`text-xs relative z-10 ${activeTab === 'bundles' ? 'text-green-100' : 'text-green-500'}`}>
                باقات مميزة
              </span>
            </Button>

            <Button
              onClick={() => setActiveTab('devices')}
              variant={activeTab === 'devices' ? 'default' : 'outline'}
              className={`h-24 md:h-32 flex-col text-center relative overflow-hidden group transition-all duration-300 ${
                activeTab === 'devices' 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl border-blue-500' 
                : 'bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Smartphone className={`h-8 w-8 mb-2 relative z-10 ${activeTab === 'devices' ? 'text-white' : 'text-blue-500'}`} />
              <span className={`font-semibold text-sm md:text-base relative z-10 ${activeTab === 'devices' ? 'text-white' : 'text-blue-600'}`}>
                DEVICES
              </span>
              <span className={`text-xs relative z-10 ${activeTab === 'devices' ? 'text-blue-100' : 'text-blue-400'}`}>
                الأجهزة
              </span>
            </Button>

            <Button
              onClick={() => setActiveTab('accessories')}
              variant={activeTab === 'accessories' ? 'default' : 'outline'}
              className={`h-24 md:h-32 flex-col text-center relative overflow-hidden group transition-all duration-300 ${
                activeTab === 'accessories' 
                ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl border-purple-500' 
                : 'bg-white hover:bg-purple-50 border-purple-200 hover:border-purple-300'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Headphones className={`h-8 w-8 mb-2 relative z-10 ${activeTab === 'accessories' ? 'text-white' : 'text-purple-500'}`} />
              <span className={`font-semibold text-sm md:text-base relative z-10 ${activeTab === 'accessories' ? 'text-white' : 'text-purple-600'}`}>
                ACCESSORY
              </span>
              <span className={`text-xs relative z-10 ${activeTab === 'accessories' ? 'text-purple-100' : 'text-purple-400'}`}>
                الإكسسوارات
              </span>
            </Button>
          </div>
        </div>

        {/* Hidden tabs for functionality */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="hidden">
            <TabsTrigger value="flash-deals">عروض سريعة</TabsTrigger>
            <TabsTrigger value="daily-deals">عروض اليوم</TabsTrigger>
            <TabsTrigger value="bundles">باقات مميزة</TabsTrigger>
            <TabsTrigger value="devices">الأجهزة</TabsTrigger>
            <TabsTrigger value="accessories">الإكسسوارات</TabsTrigger>
          </TabsList>

          {/* Filter Bar - Only show for devices and accessories */}
          {(activeTab === 'devices' || activeTab === 'accessories') && (
            <div className="mt-6 mb-8">
              <CompactFilterBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedBrands={selectedBrands}
                setSelectedBrands={setSelectedBrands}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                brands={brands}
                productType={activeTab === 'devices' ? 'device' : 'accessory'}
                onReset={resetFilters}
              />
              
              {/* Sort and View Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{currentProducts.length}</span> منتج
                  {hasActiveFilters && <span className="text-blue-600"> (مفلتر)</span>}
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <ArrowUpDown className="h-4 w-4 ml-2" />
                      <SelectValue placeholder="ترتيب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">الأكثر تميزاً</SelectItem>
                      <SelectItem value="price-low">السعر: الأقل أولاً</SelectItem>
                      <SelectItem value="price-high">السعر: الأعلى أولاً</SelectItem>
                      <SelectItem value="rating">التقييم الأعلى</SelectItem>
                      <SelectItem value="discount">أكبر خصم</SelectItem>
                      <SelectItem value="newest">الأحدث</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Mode */}
                  <div className="flex border rounded-lg">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Category Filter for Devices and Accessories */}
              <div className="flex flex-wrap justify-center gap-3 mt-4 mb-6">
                <Button 
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('all')}
                  className="rounded-full"
                >
                  <Eye className="h-4 w-4 ml-1" />
                  جميع {activeTab === 'devices' ? 'الأجهزة' : 'الإكسسوارات'}
                </Button>
                
                {activeTab === 'devices' ? (
                  <>
                    {deviceCategories.map((category) => (
                      <Button 
                        key={category.id}
                        variant={selectedCategory === category.name ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory(category.name)}
                        className="rounded-full"
                      >
                        {getIconComponent(category.icon)}
                        {category.name}
                      </Button>
                    ))}
                  </>
                ) : (
                  <>
                    {accessoryCategories.map((category) => (
                      <Button 
                        key={category.id}
                        variant={selectedCategory === category.name ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory(category.name)}
                        className="rounded-full"
                      >
                        {getIconComponent(category.icon)}
                        {category.name}
                      </Button>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Main Content Layout */}
          <div className="w-full">
            {/* Products Grid/List */}
            <div>
              {/* Flash Deals */}
              <TabsContent value="flash-deals" className="mt-0">
                <div className="text-center mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-procell-dark mb-2 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-red-500 ml-2 animate-pulse" />
                    ⚡ عروض البرق - فترة محدودة جداً
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground">
                    عروض خاطفة لا تتكرر! كمية محدودة ووقت محدود
                  </p>
                </div>
                
                <div className={`grid gap-6 md:gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {currentProducts.map((product, index) => (
                    <div key={`flash-${product.id}-${index}`}>
                      {renderProductCard(product, true)}
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Daily Deals */}
              <TabsContent value="daily-deals" className="mt-0">
                <div className="text-center mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-procell-dark mb-2 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-procell-primary ml-2" />
                    📅 عروض اليوم الخاصة
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground">
                    خصومات يومية مميزة تتجدد كل 24 ساعة
                  </p>
                </div>
                
                <div className={`grid gap-6 md:gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {currentProducts.map((product, index) => (
                    <div key={`daily-${product.id}-${index}`}>
                      {renderProductCard(product)}
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Bundle Deals */}
              <TabsContent value="bundles" className="mt-0">
                <div className="text-center mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-procell-dark mb-2 flex items-center justify-center">
                    <Gift className="h-6 w-6 text-procell-accent ml-2" />
                    🎁 باقات مميزة - وفر أكثر
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground">
                    باقات شاملة بأسعار مخفضة جداً
                  </p>
                </div>
                
                <div className={`grid gap-6 md:gap-8 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                  {currentProducts.map((product, index) => (
                    <div key={`bundle-${product.id}-${index}`}>
                      {renderProductCard(product, false, true)}
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Devices Section */}
              <TabsContent value="devices" className="mt-0">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <Smartphone className="h-4 w-4 ml-1" />
                    أحدث الأجهزة
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-procell-dark mb-2 flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-blue-500 ml-2" />
                    📱 الهواتف الذكية والتابلت
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                    أحدث الهواتف الذكية والتابلت من أفضل العلامات التجارية العالمية بأسعار تنافسية
                  </p>
                </div>
                
                <div className={`grid gap-6 md:gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {currentProducts.map((product, index) => (
                    <div key={`device-${product.id}-${index}`}>
                      {renderProductCard(product)}
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Accessories Section */}
              <TabsContent value="accessories" className="mt-0">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <Headphones className="h-4 w-4 ml-1" />
                    إكسسوارات مميزة
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-procell-dark mb-2 flex items-center justify-center">
                    <Headphones className="h-6 w-6 text-purple-500 ml-2" />
                    🎧 الإكسسوارات والملحقات
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                    مجموعة شاملة من الإكسسوارات عالية الجودة لتحسين تجربة استخدام أجهزتك
                  </p>
                </div>
                
                <div className={`grid gap-6 md:gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {currentProducts.map((product, index) => (
                    <div key={`accessory-${product.id}-${index}`}>
                      {renderProductCard(product)}
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* No Results */}
              {currentProducts.length === 0 && (activeTab === 'devices' || activeTab === 'accessories') && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    لم نجد أي منتجات
                  </h3>
                  <p className="text-gray-600 mb-6">
                    جرب تغيير الفلاتر أو البحث بكلمات مختلفة
                  </p>
                  <Button onClick={resetFilters} variant="outline">
                    <RotateCcw className="h-4 w-4 ml-2" />
                    إعادة تعيين الفلاتر
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Tabs>

        {/* Newsletter Signup */}
        <div className="mt-16">
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-procell-primary/10 to-procell-secondary/10 border-procell-primary/20">
            <CardContent className="p-6 md:p-8 text-center">
              <h3 className="text-xl md:text-2xl font-bold text-procell-dark mb-4 flex items-center justify-center">
                <Tag className="h-6 w-6 text-procell-secondary ml-2" />
                🔔 اشترك ليصلك كل جديد
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6">
                كن أول من يعرف بالعروض الحصرية والخصومات الجديدة
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input 
                  placeholder="بريدك الإلكتروني" 
                  className="flex-1 border-procell-primary/20 focus:border-procell-primary direction-ltr"
                />
                <Button className="bg-gradient-to-r from-procell-primary to-procell-secondary hover:from-procell-primary/90 hover:to-procell-secondary/90 text-white">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  اشتراك مجاني
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}