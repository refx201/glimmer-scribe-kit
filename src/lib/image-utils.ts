// Image utility functions for procell

// Image cache to store loaded images
const imageCache = new Map<string, Promise<string>>();

export const getOptimizedImageUrl = (originalUrl: string, width = 400, height = 400) => {
  if (!originalUrl) return '';
  
  // If it's already an Unsplash URL, optimize it
  if (originalUrl.includes('unsplash.com')) {
    const url = new URL(originalUrl);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('h', height.toString());
    url.searchParams.set('fit', 'crop');
    url.searchParams.set('crop', 'center');
    url.searchParams.set('auto', 'format');
    url.searchParams.set('q', '80'); // Quality optimization
    return url.toString();
  }
  
  // For other images, return as-is (can be extended for other CDNs)
  return originalUrl;
};

// Preload critical images
export const preloadImage = (src: string): Promise<string> => {
  if (imageCache.has(src)) {
    return imageCache.get(src)!;
  }

  const promise = new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });

  imageCache.set(src, promise);
  return promise;
};

// Preload multiple images in parallel
export const preloadImages = (urls: string[]): Promise<string[]> => {
  return Promise.all(urls.map(preloadImage));
};

export const getProductImageFallback = (category?: string) => {
  const fallbacks: Record<string, string> = {
    'هواتف ذكية': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center',
    'سماعات': 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop&crop=center',
    'ساعات ذكية': 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop&crop=center',
    'تابلت': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&crop=center',
    'شواحن': 'https://images.unsplash.com/photo-1609792858446-86356ae75eb5?w=400&h=400&fit=crop&crop=center',
    'حافظات': 'https://images.unsplash.com/photo-1601593346740-925612772716?w=400&h=400&fit=crop&crop=center',
    'حماية': 'https://images.unsplash.com/photo-1631451008959-a0e4651d7ad0?w=400&h=400&fit=crop&crop=center',
    default: 'https://images.unsplash.com/photo-1592286049617-3feb4da2681e?w=400&h=400&fit=crop&crop=center'
  };
  
  return fallbacks[category || 'default'] || fallbacks.default;
};

export const generatePlaceholderImage = (width = 400, height = 400, text = 'ProCell') => {
  return `https://via.placeholder.com/${width}x${height}/3b82f6/ffffff?text=${encodeURIComponent(text)}`;
};

// Brand logo URLs - using professional tech brand images
export const getBrandLogoUrl = (brand: string) => {
  const brandLogos: Record<string, string> = {
    'Apple': 'https://images.unsplash.com/photo-1592286049617-3feb4da2681e?w=100&h=100&fit=crop&crop=center',
    'Samsung': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop&crop=center',
    'Xiaomi': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop&crop=center',
    'OPPO': 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=100&h=100&fit=crop&crop=center',
    'Realme': 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=100&h=100&fit=crop&crop=center',
    'ProCell': 'https://images.unsplash.com/photo-1679181514216-575ce5be9180?w=100&h=100&fit=crop&crop=center'
  };
  
  return brandLogos[brand] || brandLogos.ProCell;
};