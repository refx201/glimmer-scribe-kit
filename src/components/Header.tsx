import { useState, useEffect } from 'react';
import { UserPointsBadge } from './UserPointsBadge';
import { PhoneNumberDialog } from './PhoneNumberDialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from '../lib/cart-context';
import { useAuth } from '../lib/auth-context';
import { EnhancedAuthModal } from './EnhancedAuthModal';
import { useProducts } from '../hooks/use-products';
import { SearchBar } from './ui/search-bar';
import { 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  ShoppingCart, 
  User,
  Search,
  Gift,
  Users,
  MessageSquare,
  Settings,
  ArrowLeftRight,
  Wallet,
  Info,
  HelpCircle,
  ChevronDown,
  Star,
  Shield,
  Zap,
  Building,
  LogOut
} from 'lucide-react';
import type { PageType } from '../App';

// Import ProCell logo
import procellLogo from '../assets/procell-logo.png';

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <>
      <HeaderContent currentPage={currentPage} onNavigate={onNavigate} />
    </>
  );
}

function HeaderContent({ currentPage, onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const { state, toggleCart } = useCart();
  const { user, signOut, loading } = useAuth();
  const { products } = useProducts();

  // Check if Google user needs to provide phone number
  useEffect(() => {
    const checkPhoneNumber = async () => {
      if (user && user.app_metadata?.provider === 'google') {
        const phone = user.user_metadata?.phone;
        if (!phone) {
          setShowPhoneDialog(true);
        }
      }
    };
    checkPhoneNumber();
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const handleNavigation = (page: PageType) => {
    onNavigate(page);
    closeMenu();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      closeMenu();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const filteredProducts = searchQuery.trim() 
    ? products
        .filter(product => 
          product.name.toLowerCase().startsWith(searchQuery.toLowerCase().trim())
        )
        .slice(0, 4)
    : [];

  const handleProductClick = (productId: string) => {
    onNavigate('product');
    setIsSearchOpen(false);
    setSearchQuery('');
    // Store the selected product ID for the product page
    sessionStorage.setItem('selectedProductId', productId);
  };

  const mainNavItems = [
    { 
      id: 'home', 
      label: 'الرئيسية', 
      icon: null,
      isActive: currentPage === 'home'
    },
    { 
      id: 'offers', 
      label: 'العروض والمتجر', 
      icon: Gift,
      badge: 'جديد',
      isActive: currentPage === 'offers'
    },
    { 
      id: 'partners', 
      label: 'شراكة النجاح', 
      icon: Users,
      badge: '15%',
      isActive: currentPage === 'partners'
    }
  ];

  const servicesNavItems = [
    { 
      id: 'maintenance', 
      label: 'الصيانة', 
      icon: Settings,
      description: 'خدمات صيانة متخصصة',
      isActive: currentPage === 'maintenance'
    },
    { 
      id: 'trade-in', 
      label: 'استبدال الهاتف', 
      icon: ArrowLeftRight,
      description: 'استبدل هاتفك القديم',
      isActive: currentPage === 'trade-in'
    },
    { 
      id: 'purchase', 
      label: 'خدمة الشراء', 
      icon: Wallet,
      description: 'نشتري هاتفك بأفضل سعر',
      badge: 'مميز',
      isActive: currentPage === 'purchase'
    }
  ];

  const supportNavItems = [
    { 
      id: 'about', 
      label: 'من نحن', 
      icon: Info,
      isActive: currentPage === 'about'
    },
    { 
      id: 'faq', 
      label: 'الأسئلة الشائعة', 
      icon: HelpCircle,
      description: 'مركز المساعدة',
      isActive: currentPage === 'faq'
    },
    { 
      id: 'contact', 
      label: 'التواصل', 
      icon: MessageSquare,
      isActive: currentPage === 'contact'
    }
  ];

  return (
    <header className={`
      sticky top-0 z-50 w-full transition-all duration-300
      ${isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
        : 'bg-white shadow-sm'
      }
    `}>
      {/* Main Header */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 md:h-28 lg:h-32">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleNavigation('home')}
          >
            <div className="h-14 md:h-20 lg:h-24">
              <ImageWithFallback
                src={procellLogo}
                alt="procell"
                className="h-full w-auto object-contain"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
              <div className="flex items-center gap-6 ml-8">
                {/* Main Navigation */}
                {mainNavItems.map((item) => (
                <Button
                  key={item.id}
                  variant={item.isActive ? "default" : "ghost"}
                  className={`
                    relative flex items-center gap-2 px-5 py-2.5 font-medium transition-all duration-300
                    ${item.isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }
                  `}
                  onClick={() => handleNavigation(item.id as PageType)}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                  {item.badge && (
                    <Badge className={`
                      text-xs px-1.5 py-0.5 ml-1
                      ${item.isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}
                    `}>
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              ))}

              {/* Services Dropdown */}
              <div className="relative group">
                <Button
                  variant="ghost"
                  className={`
                    flex items-center gap-2 px-5 py-2.5 font-medium transition-all duration-300
                    ${['maintenance', 'trade-in', 'purchase'].includes(currentPage)
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }
                  `}
                >
                  <Settings className="h-4 w-4" />
                  الخدمات
                  <ChevronDown className="h-3 w-3" />
                </Button>
                
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="p-2">
                    {servicesNavItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.id as PageType)}
                        className={`
                          w-full flex items-start gap-3 p-3 rounded-lg transition-all duration-300
                          ${item.isActive 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                            : 'hover:bg-gray-50 text-gray-700'
                          }
                        `}
                      >
                        <item.icon className={`h-5 w-5 mt-0.5 ${item.isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                        <div className="text-right flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm">{item.label}</h4>
                            {item.badge && (
                              <Badge className="bg-orange-500 text-white text-xs px-1.5 py-0.5">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Support Dropdown */}
              <div className="relative group">
                <Button
                  variant="ghost"
                  className={`
                    flex items-center gap-2 px-5 py-2.5 font-medium transition-all duration-300
                    ${['about', 'faq', 'contact'].includes(currentPage)
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }
                  `}
                >
                  <HelpCircle className="h-4 w-4" />
                  المساعدة
                  <ChevronDown className="h-3 w-3" />
                </Button>
                
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="p-2">
                    {supportNavItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.id as PageType)}
                        className={`
                          w-full flex items-start gap-3 p-3 rounded-lg transition-all duration-300
                          ${item.isActive 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                            : 'hover:bg-gray-50 text-gray-700'
                          }
                        `}
                      >
                        <item.icon className={`h-5 w-5 mt-0.5 ${item.isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                        <div className="text-right flex-1">
                          <h4 className="font-semibold text-sm">{item.label}</h4>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Search Dropdown - Hidden on small screens */}
            <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[500px] p-4 bg-white z-[100]" align="end">
                <div className="space-y-3">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="ابحث عن منتج..."
                    className="w-full"
                  />
                  
                  {searchQuery.trim() && (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className="w-full flex items-center gap-4 p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-right"
                          >
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{product.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-lg font-bold text-blue-600">
                                  ₪{product.sale_price}
                                </span>
                                {product.discount > 0 && (
                                  <span className="text-sm text-gray-500 line-through">
                                    ₪{product.original_price}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-6 text-gray-500 text-sm">
                          لا توجد منتجات تطابق بحثك
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCart}
              className="relative text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            >
              <ShoppingCart className="h-4 w-4" />
              {state.totalItems > 0 && (
                <Badge className="absolute -top-1 -left-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {state.totalItems}
                </Badge>
              )}
            </Button>

            {/* User Account */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <UserPointsBadge />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg hover:bg-blue-100"
                    >
                      <User className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700 max-w-20 truncate">
                        {user.user_metadata?.name || user.email?.split('@')[0]}
                      </span>
                      <ChevronDown className="h-3 w-3 text-blue-600" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2" align="end">
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleNavigation('profile')}
                        className="w-full justify-start gap-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <User className="h-4 w-4" />
                        الملف الشخصي
                      </Button>
                      <div className="border-t my-1" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                        className="w-full justify-start gap-2 text-gray-700 hover:text-red-600 hover:bg-red-50"
                        disabled={loading}
                      >
                        <LogOut className="h-4 w-4" />
                        تسجيل الخروج
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden sm:flex text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                data-auth-trigger
              >
                <User className="h-4 w-4 mr-2" />
                تسجيل الدخول
              </Button>
            )}

            {/* Mobile Menu Trigger */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden text-gray-600 hover:text-blue-600"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              
              <SheetContent side="right" className="w-80 p-0 bg-white">
                {/* Hidden accessibility elements */}
                <SheetTitle className="sr-only">قائمة التنقل الرئيسية</SheetTitle>
                <SheetDescription className="sr-only">
                  قائمة التنقل الرئيسية لموقع procell تحتوي على الصفحات والخدمات المتاحة
                </SheetDescription>
                
                <div className="flex flex-col h-full relative">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="absolute top-1/4 right-0 w-32 h-32 bg-blue-600 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-1/4 left-0 w-40 h-40 bg-blue-400 rounded-full blur-2xl"></div>
                  </div>
                  
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="h-8">
                        <ImageWithFallback
                          src={procellLogo}
                          alt="ProCell"
                          className="h-full w-auto object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mobile Search Bar */}
                  <div className="px-6 py-4 border-b border-gray-200 relative z-10">
                    <SearchBar
                      value={searchQuery}
                      onChange={setSearchQuery}
                      placeholder="ابحث عن منتج..."
                      className="w-full"
                    />
                    
                    {searchQuery.trim() && (
                      <div className="mt-3 space-y-2 max-h-[300px] overflow-y-auto">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <button
                              key={product.id}
                              onClick={() => {
                                handleProductClick(product.id);
                                closeMenu();
                              }}
                              className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-right"
                            >
                              {product.image && (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                              )}
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 text-sm">{product.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-sm font-bold text-blue-600">
                                    ₪{product.sale_price}
                                  </span>
                                  {product.discount > 0 && (
                                    <span className="text-xs text-gray-500 line-through">
                                      ₪{product.original_price}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500 text-sm">
                            لا توجد منتجات تطابق بحثك
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Mobile Navigation */}
                  <div className="flex-1 overflow-y-auto py-4 relative z-10">
                    {/* Main Navigation */}
                    <div className="px-6 mb-6">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        التنقل الرئيسي
                      </h3>
                      <div className="space-y-1">
                        {mainNavItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleNavigation(item.id as PageType)}
                            className={`
                              w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300
                              ${item.isActive 
                                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                                : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                              }
                            `}
                          >
                            {item.icon && <item.icon className="h-5 w-5" />}
                            <span className="font-medium flex-1 text-right">{item.label}</span>
                            {item.badge && (
                              <Badge className={`
                                text-xs px-1.5 py-0.5
                                ${item.isActive ? 'bg-blue-600 text-white' : 'bg-red-500 text-white'}
                              `}>
                                {item.badge}
                              </Badge>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Services */}
                    <div className="px-6 mb-6">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        الخدمات
                      </h3>
                      <div className="space-y-1">
                        {servicesNavItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleNavigation(item.id as PageType)}
                            className={`
                              w-full flex items-start gap-3 p-3 rounded-lg transition-all duration-300
                              ${item.isActive 
                                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                                : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                              }
                            `}
                          >
                            <item.icon className="h-5 w-5 mt-0.5" />
                            <div className="flex-1 text-right">
                              <div className="flex items-center justify-between">
                                <div className="font-medium">{item.label}</div>
                                {item.badge && (
                                  <Badge className="bg-orange-500 text-white text-xs px-1.5 py-0.5">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Support */}
                    <div className="px-6 mb-6">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        المساعدة والدعم
                      </h3>
                      <div className="space-y-1">
                        {supportNavItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleNavigation(item.id as PageType)}
                            className={`
                              w-full flex items-start gap-3 p-3 rounded-lg transition-all duration-300
                              ${item.isActive 
                                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                                : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                              }
                            `}
                          >
                            <item.icon className="h-5 w-5 mt-0.5" />
                            <div className="flex-1 text-right">
                              <div className="font-medium">{item.label}</div>
                              {item.description && (
                                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                   {/* Mobile Footer */}
                   <div className="border-t border-gray-200 p-6 relative z-10">
                     <div className="space-y-3"> 
                       {/* Authentication Section */}
                       {user ? (
                         <div className="space-y-3">
                           <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                             <User className="h-5 w-5 text-blue-600" />
                             <div className="flex-1 text-right">
                               <div className="font-medium text-gray-900">
                                 {user.user_metadata?.name || user.email?.split('@')[0]}
                               </div>
                               <div className="text-xs text-gray-500">{user.email}</div>
                             </div>
                           </div>
                           <Button
                             onClick={() => handleNavigation('profile')}
                             variant="outline"
                             className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                           >
                             <User className="h-4 w-4 ml-2" />
                             الملف الشخصي
                           </Button>
                           <Button
                             onClick={handleSignOut}
                             variant="outline"
                             className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                             disabled={loading}
                           >
                             <LogOut className="h-4 w-4 ml-2" />
                             {loading ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}
                           </Button>
                         </div>
                         ) : (
                           <Button
                             onClick={() => {
                               setIsAuthModalOpen(true);
                               closeMenu();
                             }}
                             className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                           >
                             <User className="h-4 w-4 ml-2" />
                             تسجيل الدخول
                           </Button>
                        )}
                        
                        <div className="text-center text-xs text-gray-500">
                         <div className="flex items-center justify-center gap-1 mb-1">
                           <Shield className="h-3 w-3" />
                           <span>اتصال آمن ومشفر</span>
                         </div>
                         <p>procell © 2024</p>
                       </div>
                     </div>
                   </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
         </div>
       </div>

        {/* Enhanced Auth Modal */}
        <EnhancedAuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />

        {/* Phone Number Dialog for Google Users */}
        <PhoneNumberDialog 
          open={showPhoneDialog} 
          onOpenChange={setShowPhoneDialog}
          userId={user?.id || ''}
        />
     </header>
   );
 }