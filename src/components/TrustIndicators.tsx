import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Shield, 
  Award, 
  Clock, 
  Users, 
  Star, 
  CheckCircle, 
  Phone, 
  MessageCircle,
  Truck,
  CreditCard,
  Lock,
  Verified,
  ThumbsUp,
  MapPin
} from 'lucide-react';

// Trust indicators component for building credibility
export function TrustIndicators() {
  const [isWhatsAppHovered, setIsWhatsAppHovered] = useState(false);

  const trustStats = [
    {
      icon: <Users className="h-6 w-6 text-procell-primary" />,
      number: "25,000+",
      label: "عميل راضٍ",
      color: "text-procell-primary"
    },
    {
      icon: <Clock className="h-6 w-6 text-procell-accent" />,
      number: "8+",
      label: "سنوات خبرة",
      color: "text-procell-accent"
    },
    {
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      number: "4.9/5",
      label: "تقييم العملاء",
      color: "text-yellow-600"
    },
    {
      icon: <Truck className="h-6 w-6 text-procell-secondary" />,
      number: "24 ساعة",
      label: "توصيل سريع",
      color: "text-procell-secondary"
    }
  ];

  const securityBadges = [
    {
      icon: <Shield className="h-5 w-5" />,
      text: "ضمان أصالة المنتج",
      color: "bg-procell-primary"
    },
    {
      icon: <Lock className="h-5 w-5" />,
      text: "دفع آمن 100%",
      color: "bg-procell-secondary"
    },
    {
      icon: <Award className="h-5 w-5" />,
      text: "معتمد رسمياً",
      color: "bg-procell-accent"
    },
    {
      icon: <Verified className="h-5 w-5" />,
      text: "ضمان سنتين",
      color: "bg-purple-600"
    }
  ];

  const paymentMethods = [
    { name: "فيزا", icon: "💳" },
    { name: "ماستركارد", icon: "💳" },
    { name: "PayPal", icon: "💰" },
    { name: "تحويل بنكي", icon: "🏦" },
    { name: "الدفع عند التسليم", icon: "💵" }
  ];

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-br from-procell-light/50 to-white border-t border-procell-gray/30">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Trust Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {trustStats.map((stat, index) => (
            <Card key={index} className="text-center p-4 sm:p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="mx-auto w-fit p-3 rounded-full bg-gray-50 mb-3">
                  {stat.icon}
                </div>
                <div className={`text-2xl sm:text-3xl font-bold ${stat.color} mb-1`}>
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Badges */}
        <div className="text-center mb-8 sm:mb-12">
          <h3 className="text-lg sm:text-xl font-semibold text-procell-dark mb-4 sm:mb-6">
            🛡️ ضمانات الأمان والجودة
          </h3>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
            {securityBadges.map((badge, index) => (
              <Badge key={index} className={`${badge.color} text-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                {badge.icon}
                <span className="mr-2">{badge.text}</span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Quick Contact & Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {/* WhatsApp Support */}
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-500 rounded-full">
                    <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 text-sm sm:text-base">دعم فوري عبر واتساب</h4>
                    <p className="text-xs sm:text-sm text-green-600">متاح 24/7 للإجابة على استفساراتك</p>
                  </div>
                </div>
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-3 sm:px-4 py-2"
                  onMouseEnter={() => setIsWhatsAppHovered(true)}
                  onMouseLeave={() => setIsWhatsAppHovered(false)}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {isWhatsAppHovered ? "ابدأ المحادثة" : "واتساب"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Phone Support */}
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-procell-secondary rounded-full">
                    <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-procell-secondary text-sm sm:text-base">اتصل بنا مباشرة</h4>
                    <p className="text-xs sm:text-sm text-procell-secondary/80">للطلبات والاستفسارات العاجلة</p>
                  </div>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-procell-secondary text-sm sm:text-base">0599-123-456</div>
                  <div className="text-xs text-procell-secondary/70">من 8 ص - 10 م</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <div className="text-center">
          <h3 className="text-lg sm:text-xl font-semibold text-procell-dark mb-4 sm:mb-6">
            💳 طرق الدفع الآمنة المتاحة
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6">
            {paymentMethods.map((method, index) => (
              <div key={index} className="flex items-center space-x-2 bg-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                <span className="text-lg sm:text-xl">{method.icon}</span>
                <span className="text-xs sm:text-sm font-medium text-gray-700">{method.name}</span>
              </div>
            ))}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
            🔒 جميع المعاملات محمية بتشفير SSL 256-bit
          </p>
        </div>
      </div>
    </section>
  );
}