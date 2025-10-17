import { useEffect, useState, ReactNode } from 'react';
import { PageType } from '../App';

interface PageTransitionProps {
  children: ReactNode;
  currentPage: PageType;
}

export function PageTransition({ children, currentPage }: PageTransitionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedPage, setDisplayedPage] = useState(currentPage);

  useEffect(() => {
    if (currentPage !== displayedPage) {
      setIsTransitioning(true);
      
      // Short delay for smooth transition
      const timer = setTimeout(() => {
        setDisplayedPage(currentPage);
        setIsTransitioning(false);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [currentPage, displayedPage]);

  return (
    <div className={`transition-all duration-300 ease-in-out ${
      isTransitioning 
        ? 'opacity-0 transform translate-y-2' 
        : 'opacity-100 transform translate-y-0'
    }`}>
      {children}
    </div>
  );
}

// Page preloader component
export function PagePreloader() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">procell</h2>
        <p className="text-gray-600">جاري تحميل الصفحة...</p>
      </div>
    </div>
  );
}

// Loading skeleton for components
export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}>
      <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
    </div>
  );
}

// Product card skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

// Section skeleton
export function SectionSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Progress bar for page loading
export function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  );
}