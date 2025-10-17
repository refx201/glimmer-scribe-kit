import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';

// Core Components  
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DatabaseHeroCarousel } from './components/DatabaseHeroCarousel';
import { CustomerTestimonials } from './components/CustomerTestimonials';
import { SEOHead } from './components/SEOHead';
import { NavigationManager } from './components/NavigationManager';
import { NetworkStatus, ServerStatusIndicator } from './components/NetworkStatus';

// UI Components
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './components/ui/carousel';

// Utilities & Context
import { AuthProvider } from './lib/auth-context';
import { CartProvider } from './lib/cart-context';
import { apiCall } from './lib/supabase';
import { CartSidebar } from './components/CartSidebar';
import { ErrorBoundary } from './components/ErrorBoundary';

// Optimized Components
import { CompactProductCard } from './components/CompactProductCard';
import { SecurePaymentMethods } from './components/SecurePaymentMethods';
import { CompactFeatures } from './components/CompactFeatures';
import { FloatingWhatsAppButton } from './components/FloatingWhatsApp';

// Data
import { DETAILED_PRODUCT } from './lib/data';

// Hooks
import { useProducts } from './hooks/use-products';

// Icons - Only import what we need
import { ArrowRight } from 'lucide-react';

// Lazy load pages for better performance
const OffersPage = lazy(() => import('./components/OffersPage').then(module => ({ default: module.OffersPage })));
const PartnersPage = lazy(() => import('./components/PartnersPage').then(module => ({ default: module.PartnersPage })));
const ContactPage = lazy(() => import('./components/ContactPage').then(module => ({ default: module.ContactPage })));
const MaintenancePage = lazy(() => import('./components/MaintenancePage').then(module => ({ default: module.MaintenancePage })));
const TradeInPage = lazy(() => import('./components/TradeInPage').then(module => ({ default: module.TradeInPage })));
const PurchasePage = lazy(() => import('./components/PurchasePage').then(module => ({ default: module.PurchasePage })));
const AboutPage = lazy(() => import('./components/AboutPage').then(module => ({ default: module.AboutPage })));
const FAQPage = lazy(() => import('./components/FAQPage').then(module => ({ default: module.FAQPage })));
const CompactProductPage = lazy(() => import('./components/CompactProductPage').then(module => ({ default: module.CompactProductPage })));
const TabbedProductPage = lazy(() => import('./components/TabbedProductPage').then(module => ({ default: module.TabbedProductPage })));
const CompactDynamicProductPage = lazy(() => import('./components/CompactDynamicProductPage').then(module => ({ default: module.CompactDynamicProductPage })));
const TermsOfService = lazy(() => import('./components/TermsOfService').then(module => ({ default: module.TermsOfService })));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy').then(module => ({ default: module.PrivacyPolicy })));
const RefundPolicy = lazy(() => import('./components/RefundPolicy').then(module => ({ default: module.RefundPolicy })));
const OrderTrackingPage = lazy(() => import('./components/OrderTrackingPage').then(module => ({ default: module.OrderTrackingPage })));
const AdminPage = lazy(() => import('./components/admin/Admin').then(module => ({ default: module.default })));
const PromoCodeOrdersPage = lazy(() => import('./components/PromoCodeOrdersPage').then(module => ({ default: module.default })));
const RepairCodeRedeemPage = lazy(() => import('./components/RepairCodeRedeemPage').then(module => ({ default: module.default })));
const PackageDetailPage = lazy(() => import('./components/PackageDetailPage').then(module => ({ default: module.default })));

// Lazy load complex sections
const CompactLightningDeals = lazy(() => import('./components/CompactLightningDeals').then(module => ({ default: module.CompactLightningDeals })));
const PartnershipSuccessProgram = lazy(() => import('./components/PartnershipSuccessProgram').then(module => ({ default: module.PartnershipSuccessProgram })));
const CustomOrderForm = lazy(() => import('./components/CustomOrderForm').then(module => ({ default: module.CustomOrderForm })));

// ===================================
// TYPE DEFINITIONS
// ===================================

export type PageType = 'home' | 'offers' | 'partners' | 'contact' | 'maintenance' | 'trade-in' | 'purchase' | 'about' | 'faq' | 'product' | 'terms' | 'privacy' | 'refund' | 'tracking' | 'admin';

// ===================================
// LOADING FALLBACK COMPONENT
// ===================================

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-procell-primary"></div>
  </div>
);

// ===================================
// PRODUCT PAGE WRAPPER
// ===================================

function ProductPageWrapper({ onNavigate }: { onNavigate: (page: PageType, productId?: string) => void }) {
  const { id } = useParams<{ id: string }>();
  
  if (id) {
    return <TabbedProductPage productId={id} onNavigate={onNavigate} />;
  }
  
  return <CompactProductPage onNavigate={onNavigate} />;
}

// ===================================
// OPTIMIZED HOMEPAGE
// ===================================

function HomePage({ onNavigate }: { onNavigate: (page: PageType, productId?: string) => void }) {
  const { products, loading, error } = useProducts();

  return (
    <main className="overflow-x-hidden">
      {/* Hero Carousel */}
      <DatabaseHeroCarousel onNavigate={(path) => onNavigate(path as any)} />
      
      {/* Compact Features */}
      <CompactFeatures />
      
      {/* All Products Section */}
      <section className="py-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              📱 جميع المنتجات المتاحة
            </h2>
            <p className="text-gray-600">
              تسوق من مجموعتنا الكاملة - أجهزة، إكسسوارات، وأدوات تقنية
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">خطأ في تحميل المنتجات: {error}</p>
            </div>
          ) : (
            <div className="relative mb-6">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                  slidesToScroll: 1,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4 md:-ml-5">
                  {products.map((product) => (
                    <CarouselItem key={product.id} className="pl-4 md:pl-5 basis-[55%] md:basis-[38%] lg:basis-1/3">
                      <div className="h-full">
                        <CompactProductCard 
                          product={product} 
                          onNavigate={onNavigate}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>
          )}

          <div className="text-center">
            <Button 
              onClick={() => onNavigate('offers')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2 font-semibold"
            >
              عرض جميع المنتجات
              <ArrowRight className="h-4 w-4 mr-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Lazy loaded sections */}
      <Suspense fallback={<PageLoader />}>
        <CompactLightningDeals onNavigate={onNavigate} />
      </Suspense>

      {/* Secure Payment Methods */}
      <SecurePaymentMethods />

      {/* Custom Order Form */}
      <Suspense fallback={<PageLoader />}>
        <CustomOrderForm />
      </Suspense>

      {/* Customer Testimonials */}
      <CustomerTestimonials />

      <Suspense fallback={<PageLoader />}>
        <PartnershipSuccessProgram onNavigate={onNavigate} />
      </Suspense>

      {/* Floating WhatsApp Button */}
      <FloatingWhatsAppButton />
    </main>
  );
}

// ===================================
// MAIN APP COMPONENT
// ===================================

function ProCellApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  // Determine current page from location
  const currentPage = useMemo(() => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/admin') return 'admin';
    if (path === '/offers') return 'offers';
    if (path === '/partners') return 'partners';
    if (path === '/contact') return 'contact';
    if (path === '/maintenance') return 'maintenance';
    if (path === '/trade-in') return 'trade-in';
    if (path === '/purchase') return 'purchase';
    if (path === '/about') return 'about';
    if (path === '/faq') return 'faq';
    if (path.startsWith('/product/')) return 'product';
    if (path === '/terms') return 'terms';
    if (path === '/privacy') return 'privacy';
    if (path === '/refund') return 'refund';
    if (path === '/tracking') return 'tracking';
    return 'home';
  }, [location.pathname]);

  // Memoized initialization
  const initializeData = useMemo(() => {
    return async () => {
      try {
        await apiCall('/init-data', { method: 'POST' });
        console.log('✅ Sample data initialized successfully');
      } catch (error) {
        console.warn('⚠️ Data initialization failed. This is normal if data already exists or server is not running.', error);
        
        // Check if it's a network error
        if (error.message.includes('Failed to fetch')) {
          console.info('💡 Make sure the Express server is running on port 3001');
          console.info('📝 Run these commands to start the server:');
          console.info('   cd server');
          console.info('   npm install');
          console.info('   npm run dev');
        }
      }
    };
  }, []);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useEffect(() => {
    const handleHeroNavigation = (event: CustomEvent) => {
      const page = event.detail as PageType;
      navigateToPage(page);
    };

    window.addEventListener('heroNavigation', handleHeroNavigation as EventListener);
    return () => window.removeEventListener('heroNavigation', handleHeroNavigation as EventListener);
  }, []);

  const navigateToPage = async (page: PageType, productId?: string) => {
    let path = '/';
    
    switch (page) {
      case 'home': path = '/'; break;
      case 'offers': path = '/offers'; break;
      case 'partners': path = '/partners'; break;
      case 'contact': path = '/contact'; break;
      case 'maintenance': path = '/maintenance'; break;
      case 'trade-in': path = '/trade-in'; break;
      case 'purchase': path = '/purchase'; break;
      case 'about': path = '/about'; break;
      case 'faq': path = '/faq'; break;
      case 'product': path = productId ? `/product/${productId}` : '/'; break;
      case 'terms': path = '/terms'; break;
      case 'privacy': path = '/privacy'; break;
      case 'refund': path = '/refund'; break;
      case 'tracking': path = '/tracking'; break;
      case 'admin': path = '/admin'; break;
      default: path = '/';
    }

    if (productId && page === 'product') {
      setCurrentProductId(productId);
    } else {
      setCurrentProductId(null);
    }

    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const seoData = useMemo(() => {
    const baseData = {
      'tracking': {
        title: 'تتبع الطلبات - procell | تابع طلبيتك لحظة بلحظة',
        description: 'تتبع طلبيتك من procell بسهولة. اعرف وين وصلت طلبيتك ومتى ستوصل. نظام تتبع متطور مع تحديثات فورية وخدمة عملاء 24/7.',
        keywords: 'تتبع الطلبات، تتبع الشحن، procell، متابعة الطلبية، خدمة التوصيل، تتبع فوري'
      }
    };

    if (currentPage === 'product') {
      return {
        title: DETAILED_PRODUCT.name + ' - بأفضل سعر في فلسطين - procell',
        description: `اشتري ${DETAILED_PRODUCT.name} بأفضل سعر ${DETAILED_PRODUCT.price} شيكل في فلسطين. ${DETAILED_PRODUCT.description} - ضمان سنة، توصيل مجاني، خدمة عملاء ممتازة.`,
        keywords: `${DETAILED_PRODUCT.name}, ${DETAILED_PRODUCT.brand}, هاتف ذكي فلسطين, ${DETAILED_PRODUCT.category}, procell`,
        image: DETAILED_PRODUCT.images[0],
        price: DETAILED_PRODUCT.price,
        originalPrice: DETAILED_PRODUCT.originalPrice,
        rating: DETAILED_PRODUCT.rating,
        reviewCount: DETAILED_PRODUCT.reviewsCount,
        availability: DETAILED_PRODUCT.availability === 'متوفر' ? 'InStock' as const : 'OutOfStock' as const,
        productId: DETAILED_PRODUCT.sku,
        category: DETAILED_PRODUCT.category,
        brand: DETAILED_PRODUCT.brand
      };
    }

    return baseData[currentPage] || {};
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead page={currentPage} {...seoData} />
      <NavigationManager currentPage={currentPage} onNavigate={navigateToPage} />
      <Header currentPage={currentPage} onNavigate={navigateToPage} />
      <main className="custom-scrollbar">
        <Routes>
          <Route path="/" element={<HomePage onNavigate={navigateToPage} />} />
          <Route path="/admin" element={
            <Suspense fallback={<PageLoader />}>
              <AdminPage />
            </Suspense>
          } />
          <Route path="/offers" element={
            <Suspense fallback={<PageLoader />}>
              <OffersPage onNavigate={navigateToPage} />
            </Suspense>
          } />
          <Route path="/partners" element={
            <Suspense fallback={<PageLoader />}>
              <PartnersPage />
            </Suspense>
          } />
          <Route path="/contact" element={
            <Suspense fallback={<PageLoader />}>
              <ContactPage />
            </Suspense>
          } />
          <Route path="/maintenance" element={
            <Suspense fallback={<PageLoader />}>
              <MaintenancePage />
            </Suspense>
          } />
          <Route path="/trade-in" element={
            <Suspense fallback={<PageLoader />}>
              <TradeInPage />
            </Suspense>
          } />
          <Route path="/purchase" element={
            <Suspense fallback={<PageLoader />}>
              <PurchasePage />
            </Suspense>
          } />
          <Route path="/about" element={
            <Suspense fallback={<PageLoader />}>
              <AboutPage />
            </Suspense>
          } />
          <Route path="/faq" element={
            <Suspense fallback={<PageLoader />}>
              <FAQPage />
            </Suspense>
          } />
          <Route path="/product/:id" element={
            <Suspense fallback={<PageLoader />}>
              <ProductPageWrapper onNavigate={navigateToPage} />
            </Suspense>
          } />
          <Route path="/terms" element={
            <Suspense fallback={<PageLoader />}>
              <TermsOfService onNavigate={navigateToPage} />
            </Suspense>
          } />
          <Route path="/privacy" element={
            <Suspense fallback={<PageLoader />}>
              <PrivacyPolicy onNavigate={navigateToPage} />
            </Suspense>
          } />
          <Route path="/refund" element={
            <Suspense fallback={<PageLoader />}>
              <RefundPolicy onNavigate={navigateToPage} />
            </Suspense>
          } />
          <Route path="/tracking" element={
            <Suspense fallback={<PageLoader />}>
              <OrderTrackingPage />
            </Suspense>
          } />
          <Route path="/promo-code-orders/:code" element={
            <Suspense fallback={<PageLoader />}>
              <PromoCodeOrdersPage />
            </Suspense>
          } />
          <Route path="/repair-code" element={
            <Suspense fallback={<PageLoader />}>
              <RepairCodeRedeemPage />
            </Suspense>
          } />
          <Route path="/package/:id" element={
            <Suspense fallback={<PageLoader />}>
              <PackageDetailPage />
            </Suspense>
          } />
          <Route path="*" element={<HomePage onNavigate={navigateToPage} />} />
        </Routes>
      </main>
      <Footer onNavigate={navigateToPage} />
      <NetworkStatus showServerStatus={true} />
      <ServerStatusIndicator />
      <Toaster position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <ProCellApp />
            <CartSidebar />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}