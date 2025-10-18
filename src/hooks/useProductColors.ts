import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ProductColor {
  name: string;
  display_name: string;
  hex: string;
  available?: boolean;
}

export function useProductColors(productColors: any[] = []) {
  const [colors, setColors] = useState<ProductColor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productColors || productColors.length === 0) {
      setColors([]);
      return;
    }

    const fetchColors = async () => {
      try {
        setLoading(true);
        setError(null);

        // Extract hex values from productColors (whether direct hex strings or objects)
        const hexValues = productColors.map(color => {
          if (typeof color === 'string' && color.startsWith('#')) return color;
          if (typeof color === 'string') return color;
          if (color?.hex) return color.hex;
          return null;
        }).filter(Boolean) as string[];

        // Fetch ALL colors from custom_colors table
        const { data: customColors, error: colorsError } = await supabase
          .from('custom_colors')
          .select('name, display_name, hex')
          .returns<{ name: string; display_name: string; hex: string }[]>();

        if (colorsError) {
          console.error('Error fetching colors:', colorsError);
          setError('Failed to fetch colors');
          return;
        }

        // Map each hex value to its corresponding color from the database
        const mappedColors: ProductColor[] = hexValues.map((hexValue, index) => {
          // Try to find color by hex value in custom_colors
          const matchedColor = customColors?.find(c => 
            c.hex.toLowerCase() === hexValue.toLowerCase()
          );

          if (matchedColor) {
            // Found in database - use the database name
            return {
              name: matchedColor.name,
              display_name: matchedColor.display_name,
              hex: matchedColor.hex,
              available: true
            };
          } else {
            // Not found in database - use hex as fallback with generic name
            return {
              name: `color-${index}`,
              display_name: `اللون ${index + 1}`,
              hex: hexValue,
              available: true
            };
          }
        });

        setColors(mappedColors);

      } catch (err) {
        console.error('Error processing colors:', err);
        setError('Failed to process colors');
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, [productColors]);

  return { colors, loading, error };
}