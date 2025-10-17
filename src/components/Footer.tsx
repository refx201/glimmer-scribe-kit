import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare,
  Facebook,
  Instagram,
  Youtube,
  Shield,
  Award,
  Clock,
  Users,
  Gift,
  Settings,
  ArrowLeftRight,
  Wallet,
  Info,
  HelpCircle,
  Heart,
  ChevronUp
} from 'lucide-react';
import { TikTokIcon } from './TikTokIcon';
import type { PageType } from '../App';

// Import Procell logo
import procellLogo from '../assets/procell-logo-white.png';

interface FooterProps {
  onNavigate: (page: PageType) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { 
      id: 'offers', 
      label: 'العروض والمتجر', 
      icon: Gift,
      badge: 'جديد'
    },
    { 
      id: 'partners', 
      label: 'شراكة النجاح', 
      icon: Users,
      badge: '15%'
    },
    { 
      id: 'maintenance', 
      label: 'خدمات الصيانة', 
      icon: Settings
    },
    { 
      id: 'trade-in', 
      label: 'استبدال الهاتف', 
      icon: ArrowLeftRight
    },
    { 
      id: 'purchase', 
      label: 'خدمة الشراء', 
      icon: Wallet,
      badge: 'مميز'
    }
  ];

  const supportLinks = [
    { 
      id: 'about', 
      label: 'من نحن', 
      icon: Info
    },
    { 
      id: 'faq', 
      label: 'الأسئلة الشائعة', 
      icon: HelpCircle,
      badge: 'جديد'
    },
    { 
      id: 'contact', 
      label: 'التواصل معنا', 
      icon: MessageSquare
    }
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/procellpalestine',
      color: 'hover:text-blue-600'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/procellpalestine',
      color: 'hover:text-pink-600'
    },
    {
      name: 'TikTok',
      icon: TikTokIcon,
      url: 'https://tiktok.com/@procellpalestine',
      color: 'hover:text-rose-500'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://youtube.com/@procellpalestine',
      color: 'hover:text-red-600'
    }
  ];

  const trustIndicators = [
    {
      icon: Shield,
      title: 'آمن ومشفر',
      description: 'SSL 256-bit'
    },
    {
      icon: Award,
      title: 'موثوق',
      description: '1000+ عميل راض'
    },
    {
      icon: Clock,
      title: 'دعم 24/7',
      description: 'خدمة مستمرة'
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-300 rounded-full blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10">
        {/* Links & Information Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="lg:col-span-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 md:h-12">
                    <ImageWithFallback
                      src={procellLogo}
                      alt="procell"
                      className="h-full w-auto object-contain"
                    />
                  </div>
                </div>
                
                <p className="text-gray-300 leading-relaxed mb-6">
                  منصة ProCell هي وجهتك الأولى للهواتف الذكية والخدمات المتقدمة في فلسطين. نحن نقدم أفضل المنتجات بأسعار تنافسية مع خدمة عملاء استثنائية.
                </p>

                {/* Trust Indicators */}
                <div className="grid grid-cols-1 gap-3">
                  {trustIndicators.map((indicator, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <indicator.icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-white">{indicator.title}</h4>
                        <p className="text-xs text-gray-400">{indicator.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Gift className="h-5 w-5 text-blue-400" />
                  روابط سريعة
                </h3>
                <div className="space-y-3">
                  {quickLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => onNavigate(link.id as PageType)}
                      className="w-full flex items-center gap-3 p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 group"
                    >
                      {link.badge && (
                        <Badge className="bg-blue-600 text-white text-xs px-2 py-1">
                          {link.badge}
                        </Badge>
                      )}
                      <span className="flex-1 text-right">{link.label}</span>
                      <link.icon className="h-4 w-4 text-blue-400 group-hover:text-blue-300" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Support & Help */}
              <div>
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-400" />
                  المساعدة والدعم
                </h3>
                <div className="space-y-3">
                  {supportLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => onNavigate(link.id as PageType)}
                      className="w-full flex items-center gap-3 p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 group"
                    >
                      {link.badge && (
                        <Badge className="bg-green-600 text-white text-xs px-2 py-1">
                          {link.badge}
                        </Badge>
                      )}
                      <span className="flex-1 text-right">{link.label}</span>
                      <link.icon className="h-4 w-4 text-blue-400 group-hover:text-blue-300" />
                    </button>
                  ))}
                </div>

                {/* Featured FAQ */}
                <Card className="mt-6 bg-white/5 backdrop-blur-sm border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <HelpCircle className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm mb-1">
                          لديك سؤال؟
                        </h4>
                        <p className="text-gray-300 text-xs mb-3">
                          تصفح الأسئلة الشائعة للحصول على إجابات سريعة
                        </p>
                        <Button
                          onClick={() => onNavigate('faq')}
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600 text-white text-xs"
                        >
                          <HelpCircle className="h-3 w-3 ml-1" />
                          الأسئلة الشائعة
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-400" />
                  معلومات التواصل
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <Phone className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">هاتف / واتساب</h4>
                      <a 
                        href="tel:+972598366822"
                        className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                      >
                        +972-598-366-822
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Mail className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">البريد الإلكتروني</h4>
                      <a 
                        href="mailto:info@procell.app"
                        className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                      >
                        info@procell.app
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">الموقع</h4>
                      <p className="text-gray-300 text-sm">فلسطين - الضفة الغربية</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h4 className="font-semibold text-white text-sm mb-3">تابعنا على</h4>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                          w-10 h-10 bg-white/10 rounded-full flex items-center justify-center
                          text-gray-300 transition-all duration-300 hover:scale-110 hover:bg-white/20
                          ${social.color}
                        `}
                        title={social.name}
                      >
                        <social.icon className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Bottom Footer */}
        <section className="py-6 border-t border-white/10">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-right">
                <p className="text-gray-300 text-sm">
                  © 2024 procell. جميع الحقوق محفوظة.
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  تم التطوير بـ <Heart className="h-3 w-3 inline text-red-400" /> في فلسطين
                </p>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <button 
                    onClick={() => onNavigate('privacy')}
                    className="hover:text-white transition-colors"
                  >
                    سياسة الخصوصية
                  </button>
                  <button 
                    onClick={() => onNavigate('terms')}
                    className="hover:text-white transition-colors"
                  >
                    شروط الخدمة
                  </button>
                  <button 
                    onClick={() => onNavigate('refund')}
                    className="hover:text-white transition-colors"
                  >
                    سياسة الإرجاع
                  </button>
                </div>
                
                <Button
                  onClick={scrollToTop}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </footer>
  );
}