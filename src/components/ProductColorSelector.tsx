import { memo } from 'react';
import { useProductColors } from '../hooks/useProductColors';
import { CheckCircle } from 'lucide-react';

interface ProductColorSelectorProps {
  productColors: any[];
  selectedColor?: any;
  onColorSelect: (color: any) => void;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

export const ProductColorSelector = memo(({ 
  productColors, 
  selectedColor, 
  onColorSelect, 
  size = 'md',
  showLabels = false,
  className = ''
}: ProductColorSelectorProps) => {
  const { colors, loading } = useProductColors(productColors);

  if (loading) {
    return (
      <div className={`flex gap-2 ${className}`}>
        {[1, 2, 3].map(i => (
          <div 
            key={i}
            className={`
              rounded-full border-2 border-gray-200 animate-pulse bg-gray-200
              ${size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12'}
            `}
          />
        ))}
      </div>
    );
  }

  if (!colors.length) return null;

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {colors.map((color, index) => (
        <div key={index} className={showLabels ? 'flex flex-col items-center gap-1' : ''}>
          <button
            onClick={() => onColorSelect(color)}
            disabled={!color.available}
            className={`
              relative ${sizeClasses[size]} rounded-full border-3 transition-all duration-300 hover:scale-110 hover:shadow-lg
              ${selectedColor?.name === color.name || selectedColor?.hex === color.hex
                ? 'border-blue-500 shadow-lg scale-110' 
                : 'border-gray-300 hover:border-gray-400'
              }
              ${!color.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            style={{ 
              backgroundColor: color.hex,
              transform: selectedColor?.name === color.name || selectedColor?.hex === color.hex ? 'scale(1.1)' : 'scale(1)'
            }}
            title={color.display_name}
          >
            {(selectedColor?.name === color.name || selectedColor?.hex === color.hex) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <CheckCircle className={`${iconSizes[size]} text-white drop-shadow-lg`} />
              </div>
            )}
            
            {!color.available && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-0.5 bg-red-500 rotate-45" />
              </div>
            )}
          </button>
          
          {showLabels && (
            <span className={`
              text-xs font-medium transition-colors duration-200 text-center max-w-[60px] truncate
              ${selectedColor?.name === color.name || selectedColor?.hex === color.hex ? 'text-blue-600' : 'text-gray-600'}
            `}>
              {color.display_name}
            </span>
          )}
        </div>
      ))}
    </div>
  );
});

ProductColorSelector.displayName = 'ProductColorSelector';