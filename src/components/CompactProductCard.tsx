import { memo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Star, ShoppingCart, Eye, Heart, Percent } from 'lucide-react';
import { ImageLoader } from './ImageLoader';
import { getOptimizedImageUrl, getProductImageFallback } from '../lib/image-utils';
import { useCart } from '../lib/cart-context';

export type PageType = 'home' | 'offers' | 'partners' | 'contact' | 'maintenance' | 'trade-in' | 'purchase' | 'about' | 'faq' | 'product' | 'terms' | 'privacy' | 'refund';

interface Product {
  id: string;
  name: string;
  sale_price: number;
  original_price: number;
  discount: number;
  image: string | null;
  brand_id?: string;
  is_hot_sale?: boolean;
  badge?: string;
  badgeColor?: string;
  rating?: number;
  reviewsCount?: number;
  stockCount?: number;
}

interface CompactProductCardProps {
  product: Product;
  onNavigate?: (page: PageType, productId?: string) => void;
}

const CompactProductCard = memo(({ product, onNavigate }: CompactProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.sale_price,
      originalPrice: product.original_price,
      discount: product.discount,
      image: product.image || '',
      brandId: product.brand_id, // Include brand ID for promo codes
      maxStock: product.stockCount || 10,
      quantity: 1
    });
  };

  const handleNavigateToProduct = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onNavigate?.('product', product.id);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add to favorites logic here
  };

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-white overflow-hidden cursor-pointer h-full flex flex-col"
      onClick={handleNavigateToProduct}
    >
      {/* Product Badge */}
      {(product.badge || product.is_hot_sale) && (
        <div className="absolute top-2 right-2 z-20">
          <Badge className={`${product.badgeColor || (product.is_hot_sale ? 'bg-red-600' : 'bg-blue-600')} text-white text-xs`}>
            {product.badge || (product.is_hot_sale ? 'عرض ساخن' : 'مميز')}
          </Badge>
        </div>
      )}
      
      {/* Discount Badge */}
      {product.discount > 0 && (
        <div className="absolute top-2 left-2 z-20">
          <Badge className="bg-red-600 text-white text-xs">
            <Percent className="h-2 w-2 ml-1" />
            {product.discount}%
          </Badge>
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-[4/5] mb-3 rounded-lg overflow-hidden bg-gray-50">
        <ImageLoader
          src={getOptimizedImageUrl(product.image || '', 400, 500)}
          alt={product.name}
          className="w-full h-full object-contain p-3"
          fallbackSrc={getProductImageFallback('هواتف ذكية')}
        />
        
        {/* Quick Actions */}
        <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            size="sm" 
            onClick={handleNavigateToProduct}
            className="w-6 h-6 bg-white/90 text-gray-600 hover:bg-white p-0"
            title="عرض التفاصيل"
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            onClick={handleToggleFavorite}
            className="w-6 h-6 bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 p-0"
            title="أضف للمفضلة"
          >
            <Heart className="h-3 w-3" />
          </Button>
        </div>
        
        {/* Stock Indicator */}
        {product.stockCount && product.stockCount <= 10 && (
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-orange-500 text-white text-xs">
              باقي {product.stockCount}
            </Badge>
          </div>
        )}
      </div>

      {/* Product Info */}
      <CardContent className="p-4 flex-1 flex flex-col">
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating!) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviewsCount || 0})</span>
          </div>
        )}
        
        {/* Product Title */}
        <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 leading-tight">
          {product.name}
        </h3>
        
        {/* Price Section */}
        <div className="mb-3 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-red-600">
              {product.sale_price.toLocaleString()} ₪
            </span>
            {product.original_price > product.sale_price && (
              <span className="text-sm text-gray-400 line-through">
                {product.original_price.toLocaleString()} ₪
              </span>
            )}
          </div>
          {product.original_price > product.sale_price && (
            <div className="text-xs font-medium text-green-600">
              وفر {(product.original_price - product.sale_price).toLocaleString()} ₪
            </div>
          )}
        </div>
        
        {/* Action Button */}
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 mt-auto"
        >
          <ShoppingCart className="h-3 w-3 ml-1" />
          أضف للسلة
        </Button>
      </CardContent>
    </Card>
  );
});

CompactProductCard.displayName = 'CompactProductCard';

export { CompactProductCard };