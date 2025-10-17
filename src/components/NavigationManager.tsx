import { useEffect } from 'react';
import { PageType } from '../App';

interface NavigationManagerProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export function NavigationManager({ currentPage, onNavigate }: NavigationManagerProps) {
  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const page = event.state?.page || 'home';
      onNavigate(page as PageType);
    };

    window.addEventListener('popstate', handlePopState);
    
    // Push initial state
    if (!window.history.state) {
      window.history.replaceState({ page: currentPage }, '', getPageUrl(currentPage));
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentPage, onNavigate]);

  // Update URL when page changes
  useEffect(() => {
    const newUrl = getPageUrl(currentPage);
    const currentState = window.history.state;
    
    if (!currentState || currentState.page !== currentPage) {
      window.history.pushState({ page: currentPage }, '', newUrl);
    }
    
    // Update document title
    document.title = getPageTitle(currentPage);
  }, [currentPage]);

  return null; // This component doesn't render anything
}

function getPageUrl(page: PageType): string {
  const baseUrl = window.location.origin + window.location.pathname;
  
  switch (page) {
    case 'home':
      return baseUrl;
    case 'offers':
      return `${baseUrl}#offers`;
    case 'partners':
      return `${baseUrl}#partners`;
    case 'contact':
      return `${baseUrl}#contact`;
    case 'maintenance':
      return `${baseUrl}#maintenance`;
    case 'trade-in':
      return `${baseUrl}#trade-in`;
    case 'purchase':
      return `${baseUrl}#purchase`;
    case 'about':
      return `${baseUrl}#about`;
    case 'faq':
      return `${baseUrl}#faq`;
    case 'product':
      return `${baseUrl}#product`;
    case 'terms':
      return `${baseUrl}#terms`;
    case 'privacy':
      return `${baseUrl}#privacy`;
    case 'refund':
      return `${baseUrl}#refund`;
    case 'tracking':
      return `${baseUrl}#tracking`;
    default:
      return baseUrl;
  }
}

function getPageTitle(page: PageType): string {
  const baseTitle = 'procell';
  
  switch (page) {
    case 'home':
      return `${baseTitle} - أفضل أسعار الهواتف الذكية في فلسطين`;
    case 'offers':
      return `العروض والمتجر - ${baseTitle}`;
    case 'partners':
      return `برنامج شركاء النجاح - ${baseTitle}`;
    case 'contact':
      return `تواصل معنا - ${baseTitle}`;
    case 'maintenance':
      return `خدمات الصيانة - ${baseTitle}`;
    case 'trade-in':
      return `استبدال الهاتف - ${baseTitle}`;
    case 'purchase':
      return `خدمة الشراء - ${baseTitle}`;
    case 'about':
      return `من نحن - ${baseTitle}`;
    case 'faq':
      return `الأسئلة الشائعة - ${baseTitle}`;
    case 'product':
      return `تفاصيل المنتج - ${baseTitle}`;
    case 'terms':
      return `شروط الخدمة - ${baseTitle}`;
    case 'privacy':
      return `سياسة الخصوصية - ${baseTitle}`;
    case 'refund':
      return `سياسة الإرجاع - ${baseTitle}`;
    case 'tracking':
      return `تتبع الطلبات - ${baseTitle}`;
    default:
      return baseTitle;
  }
}