import { memo } from 'react';
import { useProductColors } from '../hooks/useProductColors';

interface ProductColorPreviewProps {
  colors: any[];
  maxColors?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export const ProductColorPreview = memo(({ 
  colors: productColors, 
  maxColors = 4,
  size = 'sm',
  className = ''
}: ProductColorPreviewProps) => {
  const { colors, loading } = useProductColors(productColors);

  if (loading) {
    return (
      <div className={`flex gap-1 ${className}`}>
        {[1, 2, 3].map(i => (
          <div 
            key={i}
            className={`rounded-full border border-gray-200 animate-pulse bg-gray-200 ${size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'}`}
          />
        ))}
      </div>
    );
  }

  if (!colors.length) return null;

  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
  const visibleColors = colors.slice(0, maxColors);
  const remainingCount = colors.length - maxColors;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {visibleColors.map((color, index) => (
        <div
          key={index}
          className={`${sizeClass} rounded-full border border-gray-300 shadow-sm`}
          style={{ backgroundColor: color.hex }}
          title={color.display_name}
        />
      ))}
      {remainingCount > 0 && (
        <span className="text-xs text-gray-500 ml-1">+{remainingCount}</span>
      )}
    </div>
  );
});

ProductColorPreview.displayName = 'ProductColorPreview';