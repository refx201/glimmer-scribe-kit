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
      className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 bg-white overflow-hidden cursor-pointer h-full flex flex-col rounded-2xl"
      onClick={handleNavigateToProduct}
    >
      {/* Product Image */}
      <div className="relative bg-gray-50 p-12 flex items-center justify-center" style={{ minHeight: '280px' }}>
        <ImageLoader
          src={getOptimizedImageUrl(product.image || '', 300, 400)}
          alt={product.name}
          className="w-auto h-auto object-contain max-h-40 max-w-[80%]"
          fallbackSrc={getProductImageFallback('هواتف ذكية')}
        />
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 right-3 z-20">
            <Badge className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{product.discount}%
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
              {product.sale_price.toLocaleString()} ₪
            </span>
            {product.original_price > product.sale_price && (
              <span className="text-sm text-gray-400 line-through">
                {product.original_price.toLocaleString()} ₪
              </span>
            )}
          </div>
          {product.original_price > product.sale_price && (
            <div className="text-xs text-gray-600">
              متوفر بـ 4 دفعات
            </div>
          )}
        </div>

        {/* Stock Progress Bar */}
        {product.stockCount && product.stockCount <= 20 && (
          <div className="mb-3">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((product.stockCount / 20) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Action Button */}
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 mt-auto rounded-lg"
        >
          <ShoppingCart className="h-4 w-4 ml-2" />
          أضف الآن
        </Button>
      </CardContent>
    </Card>
  );
});

CompactProductCard.displayName = 'CompactProductCard';

export { CompactProductCard };