import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
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
  MapPin,
  RefreshCw,
  HeartHandshake
} from 'lucide-react';

export function EnhancedTrustBar() {
  const [activeTab, setActiveTab] = useState(0);

  const trustMetrics = [
    {
      icon: <Users className="h-5 w-5 sm:h-6 sm:w-6 text-procell-primary" />,
      number: "25,000+",
      label: "عميل راضٍ",
      subLabel: "منذ 2016",
      color: "text-procell-primary",
      bgColor: "bg-procell-primary/10"
    },
    {
      icon: <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />,
      number: "4.9/5",
      label: "تقييم العملاء",
      subLabel: "+1,200 مراجعة",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      icon: <Award className="h-5 w-5 sm:h-6 sm:w-6 text-procell-secondary" />,
      number: "100%",
      label: "منتجات أصلية",
      subLabel: "مضمونة وموثقة",
      color: "text-procell-secondary",
      bgColor: "bg-procell-secondary/10"
    },
    {
      icon: <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-procell-accent" />,
      number: "24 ساعة",
      label: "توصيل سريع",
      subLabel: "لجميع المدن",
      color: "text-procell-accent",
      bgColor: "bg-procell-accent/10"
    }
  ];

  const guaranteeFeatures = [
    {
      icon: <Shield className="h-4 w-4 text-white" />,
      title: "ضمان شامل سنتين",
      description: "على جميع الهواتف الذكية",
      bgColor: "bg-procell-primary"
    },
    {
      icon: <RefreshCw className="h-4 w-4 text-white" />,
      title: "استبدال خلال 14 يوم",
      description: "بدون أسئلة أو شروط معقدة",
      bgColor: "bg-procell-secondary"
    },
    {
      icon: <Lock className="h-4 w-4 text-white" />,
      title: "دفع آمن 100%",
      description: "تشفير SSL وحماية كاملة",
      bgColor: "bg-procell-accent"
    },
    {
      icon: <HeartHandshake className="h-4 w-4 text-white" />,
      title: "دعم مدى الحياة",
      description: "فريق خبراء متاح 24/7",
      bgColor: "bg-purple-600"
    }
  ];

  const paymentMethods = [
    { name: "فيزا", icon: "💳", color: "bg-blue-50 border-blue-200" },
    { name: "ماستركارد", icon: "💳", color: "bg-red-50 border-red-200" },
    { name: "PayPal", icon: "💰", color: "bg-blue-50 border-blue-200" },
    { name: "تحويل بنكي", icon: "🏦", color: "bg-green-50 border-green-200" },
    { name: "الدفع عند التسليم", icon: "💵", color: "bg-orange-50 border-orange-200" },
    { name: "تقسيط بدون فوائد", icon: "📊", color: "bg-purple-50 border-purple-200" }
  ];

  return (
    <section className="py-6 sm:py-8 bg-gradient-to-br from-gray-50 via-white to-blue-50 border-y border-gray-200/50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Trust metrics - Mobile optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          {trustMetrics.map((metric, index) => (
            <div key={index} className={`text-center p-3 sm:p-4 md:p-6 ${metric.bgColor} rounded-xl border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}>
              <div className="mx-auto w-fit p-2 sm:p-3 rounded-full bg-white shadow-sm mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                {metric.icon}
              </div>
              <div className={`text-xl sm:text-2xl md:text-3xl font-bold ${metric.color} mb-1`}>
                {metric.number}
              </div>
              <div className="text-xs sm:text-sm font-medium text-procell-dark mb-1">
                {metric.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {metric.subLabel}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced guarantee section */}
        <div className="mb-6 sm:mb-8">
          <div className="text-center mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-procell-dark mb-2">
              🛡️ <span className="text-procell-primary">ضماناتك معنا محمية 100%</span>
            </h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              نحن نقدم أقوى الضمانات في السوق الفلسطيني لراحة بالك الكاملة
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {guaranteeFeatures.map((feature, index) => (
              <div key={index} className={`${feature.bgColor} text-white p-4 sm:p-5 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-white">
                      {feature.title}
                    </h4>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment methods - Enhanced */}
        <div className="mb-6 sm:mb-8">
          <div className="text-center mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-procell-dark mb-2">
              💳 <span className="text-procell-secondary">طرق الدفع الآمنة والمريحة</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              ادفع بالطريقة التي تناسبك - جميع المعاملات محمية بأعلى معايير الأمان
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {paymentMethods.map((method, index) => (
              <div key={index} className={`${method.color} border p-3 sm:p-4 rounded-xl text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}>
                <div className="text-xl sm:text-2xl mb-2 group-hover:scale-110 transition-transform">
                  {method.icon}
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-700">
                  {method.name}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 px-3 sm:px-4 py-2 rounded-full">
              <Lock className="h-4 w-4 text-green-600" />
              <span className="text-xs sm:text-sm font-medium text-green-700">
                🔒 جميع المعاملات محمية بتشفير SSL 256-bit
              </span>
            </div>
          </div>
        </div>

        {/* Contact support - Prominent */}
        <div className="bg-gradient-to-r from-procell-primary via-procell-primary to-procell-secondary p-4 sm:p-6 md:p-8 rounded-2xl text-white text-center shadow-xl">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-3 sm:mb-4">
              <div className="p-2 bg-white/20 rounded-full">
                <HeartHandshake className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold">
                🎯 خدمة عملاء استثنائية - متاحة الآن!
              </h3>
            </div>
            
            <p className="text-sm sm:text-base mb-4 sm:mb-6 opacity-90 max-w-2xl mx-auto">
              فريق خبراء متخصص في الهواتف الذكية لمساعدتك في اختيار المنتج المثالي وتقديم الدعم الفني المطلوب
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto">
              <Button
                onClick={() => {
                  const message = encodeURIComponent('مرحباً، أحتاج مساعدة في اختيار أفضل هاتف يناسب احتياجي وميزانيتي 📱🤔');
                  window.open(`https://wa.me/972598366822?text=${message}`, '_blank');
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-bold py-3"
              >
                <MessageCircle className="h-4 w-4 ml-2" />
                واتساب فوري
              </Button>
              <Button
                onClick={() => window.location.href = 'tel:+972598366822'}
                variant="outline"
                className="w-full border-2 border-white text-white hover:bg-white hover:text-procell-primary transition-all duration-300 font-bold py-3"
              >
                <Phone className="h-4 w-4 ml-2" />
                اتصال مباشر
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-6 mt-4 text-xs sm:text-sm opacity-90">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>متاح 24/7</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>استجابة فورية</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span>خبراء معتمدون</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}