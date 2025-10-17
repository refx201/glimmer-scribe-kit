// Cache management for procell

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class CacheManager {
  private cache: Map<string, CacheItem<any>> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes default

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl
    };
    
    this.cache.set(key, item);
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) return false;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean expired items
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats(): { size: number; expired: number; keys: string[] } {
    const now = Date.now();
    let expired = 0;
    const keys: string[] = [];
    
    for (const [key, item] of this.cache.entries()) {
      keys.push(key);
      if (now > item.expiry) {
        expired++;
      }
    }
    
    return {
      size: this.cache.size,
      expired,
      keys
    };
  }
}

// Global cache instance
export const cacheManager = new CacheManager();

// Automatic cleanup every 5 minutes
setInterval(() => {
  cacheManager.cleanup();
}, 5 * 60 * 1000);

// Local Storage Cache with expiry
export class LocalStorageCache {
  private prefix: string;

  constructor(prefix: string = 'procell_') {
    this.prefix = prefix;
  }

  set<T>(key: string, data: T, ttl: number = 24 * 60 * 60 * 1000): void {
    try {
      const item = {
        data,
        expiry: Date.now() + ttl
      };
      localStorage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to set localStorage item:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const itemStr = localStorage.getItem(this.prefix + key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      
      if (Date.now() > item.expiry) {
        this.delete(key);
        return null;
      }
      
      return item.data;
    } catch (error) {
      console.warn('Failed to get localStorage item:', error);
      this.delete(key);
      return null;
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Clean expired items
  cleanup(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        this.get(key.replace(this.prefix, '')); // This will auto-delete if expired
      }
    });
  }
}

// Global localStorage cache instance
export const localCache = new LocalStorageCache();

// API Response Cache
export async function cachedApiCall<T>(
  key: string,
  apiCall: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minutes default
): Promise<T> {
  // Check memory cache first
  const cached = cacheManager.get<T>(key);
  if (cached) {
    return cached;
  }

  // Check localStorage cache
  const localCached = localCache.get<T>(key);
  if (localCached) {
    // Update memory cache
    cacheManager.set(key, localCached, ttl);
    return localCached;
  }

  // Make API call
  try {
    const data = await apiCall();
    
    // Cache the result
    cacheManager.set(key, data, ttl);
    localCache.set(key, data, ttl);
    
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Image cache for better performance
export class ImageCache {
  private cache: Map<string, HTMLImageElement> = new Map();

  preload(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.cache.has(src)) {
        resolve();
        return;
      }

      const img = new Image();
      img.onload = () => {
        this.cache.set(src, img);
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  preloadMultiple(sources: string[]): Promise<void[]> {
    return Promise.all(sources.map(src => this.preload(src)));
  }

  has(src: string): boolean {
    return this.cache.has(src);
  }

  get(src: string): HTMLImageElement | undefined {
    return this.cache.get(src);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const imageCache = new ImageCache();