// Performance optimization utilities for procell

// Debounce function for search and input optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Throttle function for scroll and resize events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  return (...args: Parameters<T>) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

// Lazy loading observer for images and components
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '50px',
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
}

// Preload critical resources
export function preloadResource(href: string, as: string, type?: string): void {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  
  document.head.appendChild(link);
}

// Prefetch next page resources
export function prefetchPage(page: string): void {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = `#${page}`;
  
  document.head.appendChild(link);
}

// Local storage optimization with expiry
export function setItemWithExpiry(key: string, value: any, ttl: number): void {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getItemWithExpiry(key: string): any {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;
  
  try {
    const item = JSON.parse(itemStr);
    const now = new Date();
    
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

// Memory usage monitoring
export function getMemoryUsage(): any {
  if (typeof window !== 'undefined' && 'performance' in window && 'memory' in performance) {
    return (performance as any).memory;
  }
  return null;
}

// Performance timing metrics
export function getPageLoadMetrics(): any {
  if (typeof window === 'undefined' || !performance.timing) return null;
  
  const timing = performance.timing;
  return {
    domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
    fullPageLoad: timing.loadEventEnd - timing.navigationStart,
    domInteractive: timing.domInteractive - timing.navigationStart,
    firstByte: timing.responseStart - timing.navigationStart,
  };
}

// Component performance measurement
export function measureComponentRender(componentName: string, renderFunction: () => void): void {
  if (typeof window === 'undefined' || !performance.mark) return;
  
  const startMark = `${componentName}-start`;
  const endMark = `${componentName}-end`;
  const measureName = `${componentName}-render`;
  
  performance.mark(startMark);
  renderFunction();
  performance.mark(endMark);
  performance.measure(measureName, startMark, endMark);
}

// Bundle size tracking
export function trackBundleSize(): void {
  if (typeof window === 'undefined') return;
  
  window.addEventListener('load', () => {
    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;
    
    scripts.forEach(script => {
      if (script.getAttribute('src')?.includes('.js')) {
        // This is an approximation - in a real app you'd have actual bundle sizes
        console.log('Script loaded:', script.getAttribute('src'));
      }
    });
  });
}