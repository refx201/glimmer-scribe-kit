import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AdditionalServicesDialog, RepairServicesDialog } from './ServiceRequestDialogs';
import { 
  Wrench, 
  Shield, 
  Zap, 
  Smartphone,
  Headphones,
  Monitor,
  Battery,
  Wifi,
  Camera,
  Speaker,
  Clock,
  CheckCircle,
  Star,
  Calendar,
  Phone,
  MapPin,
  Award,
  TrendingUp,
  Users,
  DollarSign,
  ArrowRight,
  Sparkles,
  Heart,
  RefreshCw,
  HelpCircle,
  Settings,
  FileText,
  AlertCircle,
  Edit3
} from 'lucide-react';

export function MaintenancePage() {
  const [selectedService, setSelectedService] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [showAdditionalDialog, setShowAdditionalDialog] = useState(false);
  const [showRepairDialog, setShowRepairDialog] = useState(false);

  // Fetch maintenance services from database
  const { data: dbServices = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['maintenance-services-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_services')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Transform database services to match the component format
  const repairServices = dbServices.map(service => ({
    id: service.id,
    icon: <Monitor className="h-8 w-8" />,
    title: service.title,
    description: service.description,
    price: service.price,
    time: service.time || '',
    features: Array.isArray(service.features) ? service.features as string[] : [],
    image: service.image,
    rating: Number(service.rating) || 4.5,
    reviews: service.reviews || 0,
    isPopular: service.is_popular || false,
  }));

  // Fallback services if database is empty (for backwards compatibility)
  const fallbackServices = [
    {
      id: 'screen',
      icon: <Monitor className="h-8 w-8" />,
      title: 'إصلاح الشاشة',
      description: 'استبدال شاشات أصلية مع ضمان سنة كاملة',
      price: 'من 150 ₪',
      time: '30-45 دقيقة',
      features: ['شاشات أصلية 100%', 'ضمان سنة كاملة', 'اختبار شامل', 'حماية إضافية'],
      image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=300&fit=crop&crop=center',
      rating: 4.9,
      reviews: 234,
      isPopular: true
    },
    {
      id: 'battery',
      icon: <Battery className="h-8 w-8" />,
      title: 'استبدال البطارية',
      description: 'بطاريات أصلية عالية الجودة مع أداء محسن',
      price: 'من 120 ₪',
      time: '25-35 دقيقة',
      features: ['بطاريات أصلية', 'أداء محسن 20%', 'اختبار الصحة', 'ضمان 18 شهر'],
      image: 'https://images.unsplash.com/photo-1609592820917-2a4e3d5c6e90?w=400&h=300&fit=crop&crop=center',
      rating: 4.8,
      reviews: 189,
      isPopular: false
    },
    {
      id: 'camera',
      icon: <Camera className="h-8 w-8" />,
      title: 'إصلاح الكاميرا',
      description: 'حلول شاملة لمشاكل الكاميرا الأمامية والخلفية',
      price: 'من 180 ₪',
      time: '40-60 دقيقة',
      features: ['إصلاح دقيق', 'اختبار الجودة', 'معايرة احترافية', 'ضمان 6 أشهر'],
      image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=300&fit=crop&crop=center',
      rating: 4.7,
      reviews: 156,
      isPopular: false
    },
    {
      id: 'charging',
      icon: <Zap className="h-8 w-8" />,
      title: 'إصلاح منفذ الشحن',
      description: 'حل مشاكل الشحن وتنظيف المنافذ',
      price: 'من 80 ₪',
      time: '20-30 دقيقة',
      features: ['تنظيف عميق', 'استبدال المنفذ', 'اختبار الشحن', 'ضمان 3 أشهر'],
      image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=400&h=300&fit=crop&crop=center',
      rating: 4.6,
      reviews: 143,
      isPopular: false
    },
    {
      id: 'speaker',
      icon: <Speaker className="h-8 w-8" />,
      title: 'إصلاح السماعات',
      description: 'استعادة جودة الصوت الأصلية',
      price: 'من 100 ₪',
      time: '30-40 دقيقة',
      features: ['سماعات عالية الجودة', 'اختبار الصوت', 'معايرة دقيقة', 'ضمان 4 أشهر'],
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop&crop=center',
      rating: 4.5,
      reviews: 98,
      isPopular: false
    },
    {
      id: 'software',
      icon: <Settings className="h-8 w-8" />,
      title: 'حلول البرمجيات',
      description: 'إصلاح مشاكل النظام والتطبيقات',
      price: 'من 70 ₪',
      time: '15-25 دقيقة',
      features: ['إعادة تثبيت النظام', 'إزالة الفيروسات', 'تحسين الأداء', 'نسخ احتياطي'],
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop&crop=center',
      rating: 4.8,
      reviews: 201,
      isPopular: true
    }
  ];

  // Additional services
  const additionalServices = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'حماية الجهاز',
      description: 'تركيب واقيات شاشة وأكفف حماية',
      price: 'من 25 ₪'
    },
    {
      icon: <RefreshCw className="h-6 w-6" />,
      title: 'تنظيف شامل',
      description: 'تنظيف داخلي وخارجي احترافي',
      price: 'من 40 ₪'
    },
    {
      icon: <Wifi className="h-6 w-6" />,
      title: 'إصلاح الواي فاي',
      description: 'حل مشاكل الاتصال اللاسلكي',
      price: 'من 90 ₪'
    },
    {
      icon: <HelpCircle className="h-6 w-6" />,
      title: 'تشخيص مجاني',
      description: 'فحص شامل لتحديد المشاكل',
      price: 'مجاني'
    }
  ];

  // Device brands
  const supportedBrands = [
    { name: 'iPhone', logo: '🍎', models: ['iPhone 15', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'iPhone 11'] },
    { name: 'Samsung', logo: '📱', models: ['Galaxy S24', 'Galaxy S23', 'Galaxy A54', 'Galaxy Note'] },
    { name: 'Xiaomi', logo: '📲', models: ['Redmi Note', 'Mi Series', 'POCO'] },
    { name: 'Huawei', logo: '📳', models: ['P Series', 'Mate Series', 'Nova'] },
    { name: 'OnePlus', logo: '⚡', models: ['OnePlus 12', 'OnePlus 11', 'OnePlus Nord'] },
    { name: 'Google', logo: '🔍', models: ['Pixel 8', 'Pixel 7', 'Pixel 6'] }
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'أحمد محمد',
      location: 'رام الله',
      service: 'إصلاح شاشة iPhone 14',
      rating: 5,
      review: 'خدمة ممتازة وسريعة، تم إصلاح الشاشة في 30 دقيقة بجودة عالية جداً. أنصح بشدة!',
      date: 'منذ أسبوع'
    },
    {
      name: 'فاطمة أحمد',
      location: 'نابلس',
      service: 'استبدال بطارية Samsung',
      rating: 5,
      review: 'البطارية الجديدة تعمل بشكل رائع، والفريق محترف جداً. خدمة عملاء ممتازة.',
      date: 'منذ 3 أيام'
    },
    {
      name: 'محمد عبدالله',
      location: 'الخليل',
      service: 'حلول برمجيات',
      rating: 5,
      review: 'حلوا مشكلة النظام بسرعة وكفاءة، والجهاز الآن يعمل أفضل من قبل. شكراً لكم!',
      date: 'منذ يومين'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', {
      selectedService,
      deviceModel,
      appointmentDate,
      customerName,
      customerPhone,
      problemDescription
    });
    
    // Reset form
    setSelectedService('');
    setDeviceModel('');
    setAppointmentDate('');
    setCustomerName('');
    setCustomerPhone('');
    setProblemDescription('');
    
    alert('تم إرسال طلب الحجز بنجاح! سنتواصل معك قريباً لتأكيد الموعد.');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-procell-light/20 to-white">
      {/* Hero Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-r from-procell-accent via-procell-accent to-procell-accent-light text-white relative overflow-hidden pt-20 md:pt-24">
        <div className="absolute inset-0 bg-gradient-to-r from-procell-accent/98 to-procell-accent-light/98"></div>
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-procell-primary rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Badge className="bg-white text-blue-600 px-4 py-2 text-sm font-semibold shadow-lg">
                خدمات الصيانة المتخصصة
              </Badge>
              <Wrench className="h-6 w-6 text-white animate-pulse" />
            </div>
            
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 text-white drop-shadow-lg">
              <span className="block mb-3">🔧 خدمات الصيانة الاحترافية</span>
              <span className="block text-white/95">لجميع أنواع الهواتف الذكية</span>
            </h1>
            
            <p className="text-base md:text-lg lg:text-xl text-white/95 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              خبراء معتمدون في إصلاح وصيانة الهواتف الذكية بأحدث التقنيات وقطع الغيار الأصلية
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">98%</div>
                <div className="text-sm md:text-base text-white font-medium">نسبة النجاح</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">30 دقيقة</div>
                <div className="text-sm md:text-base text-white font-medium">متوسط الإصلاح</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">5000+</div>
                <div className="text-sm md:text-base text-white font-medium">عميل راضي</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Services Tabs */}
        <Tabs defaultValue="repair-services" className="mb-12">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl p-1">
            <TabsTrigger 
              value="repair-services" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-procell-accent data-[state=active]:to-procell-accent-light data-[state=active]:text-white rounded-lg py-3"
            >
              <Wrench className="h-4 w-4 ml-2" />
              خدمات الإصلاح
            </TabsTrigger>
            <TabsTrigger 
              value="additional-services"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-procell-secondary data-[state=active]:to-procell-secondary-light data-[state=active]:text-white rounded-lg py-3"
            >
              <Settings className="h-4 w-4 ml-2" />
              خدمات إضافية
            </TabsTrigger>
            <TabsTrigger 
              value="booking"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-procell-primary data-[state=active]:to-procell-primary-light data-[state=active]:text-white rounded-lg py-3"
            >
              <Calendar className="h-4 w-4 ml-2" />
              احجز موعد
            </TabsTrigger>
          </TabsList>

          {/* Main Repair Services */}
          <TabsContent value="repair-services" className="mt-8">
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-procell-dark mb-2 flex items-center justify-center">
                <Wrench className="h-6 w-6 text-procell-accent ml-2" />
                🔧 خدمات الإصلاح الرئيسية
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                حلول شاملة لجميع مشاكل الهواتف الذكية بأيدي خبراء معتمدين
              </p>
            </div>
            
            {servicesLoading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4 text-muted-foreground">جاري تحميل الخدمات...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {(repairServices.length > 0 ? repairServices : fallbackServices).map((service) => (
                <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                  <div className="relative">
                    <div className="aspect-video overflow-hidden">
                      <ImageWithFallback
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    
                    {service.isPopular && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-red-500 text-white text-xs animate-pulse">
                          الأكثر طلباً
                        </Badge>
                      </div>
                    )}
                    
                    <div className="absolute top-3 left-3">
                      <div className="p-3 rounded-full bg-procell-accent text-white shadow-lg group-hover:scale-110 transition-transform">
                        {service.icon}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-procell-dark group-hover:text-procell-accent transition-colors">
                        {service.title}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">{service.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {service.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-procell-accent ml-2 shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-procell-accent">
                        {service.price} ₪
                      </span>
                      {service.time && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 ml-1" />
                          {service.time}
                        </div>
                      )}
                    </div>

                    <RepairServicesDialog />
                  </CardContent>
                </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Additional Services */}
          <TabsContent value="additional-services" className="mt-8">
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-procell-dark mb-2 flex items-center justify-center">
                <Settings className="h-6 w-6 text-procell-secondary ml-2" />
                🔧 خدمات إضافية مميزة
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                خدمات متنوعة للحفاظ على جهازك في أفضل حالة
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
              {additionalServices.map((service, index) => (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-procell-secondary/20 bg-white/90 backdrop-blur-sm group">
                  <CardContent className="p-6">
                    <div className="mx-auto w-fit p-6 rounded-full bg-gradient-to-r from-procell-secondary to-procell-secondary-light text-white mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      {service.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-procell-dark mb-3 group-hover:text-procell-secondary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {service.description}
                    </p>
                    <div className="text-lg font-bold text-procell-secondary mb-4">
                      {service.price} ₪
                    </div>
                    <AdditionalServicesDialog />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Supported Brands */}
            <div className="bg-gradient-to-r from-procell-light/50 to-white rounded-2xl p-8 md:p-10">
              <h3 className="text-xl md:text-2xl font-bold text-procell-dark mb-6 text-center flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-procell-secondary ml-2" />
                📱 العلامات التجارية المدعومة
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {supportedBrands.map((brand, index) => (
                  <div key={index} className="text-center group">
                    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border border-gray-200/50">
                      <div className="text-3xl mb-3">{brand.logo}</div>
                      <h4 className="font-semibold text-procell-dark mb-2">{brand.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {brand.models.length} موديل
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Booking Form */}
          <TabsContent value="booking" className="mt-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-procell-dark mb-2 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-procell-primary ml-2" />
                  📅 احجز موعد الصيانة
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  املأ النموذج وسنتواصل معك لتأكيد الموعد
                </p>
              </div>

              <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-procell-dark mb-2">
                          نوع الخدمة *
                        </label>
                        <Select value={selectedService} onValueChange={setSelectedService} required>
                          <SelectTrigger className="border-procell-primary/20 focus:border-procell-primary">
                            <SelectValue placeholder="اختر نوع الخدمة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="screen">إصلاح الشاشة</SelectItem>
                            <SelectItem value="battery">استبدال البطارية</SelectItem>
                            <SelectItem value="camera">إصلاح الكاميرا</SelectItem>
                            <SelectItem value="charging">إصلاح منفذ الشحن</SelectItem>
                            <SelectItem value="speaker">إصلاح السماعات</SelectItem>
                            <SelectItem value="software">حلول البرمجيات</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-procell-dark mb-2">
                          موديل الجهاز *
                        </label>
                        <Input
                          value={deviceModel}
                          onChange={(e) => setDeviceModel(e.target.value)}
                          placeholder="مثال: iPhone 15 Pro"
                          className="border-procell-primary/20 focus:border-procell-primary"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-procell-dark mb-2">
                          الاسم الكامل *
                        </label>
                        <Input
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="أدخل اسمك الكامل"
                          className="border-procell-primary/20 focus:border-procell-primary"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-procell-dark mb-2">
                          رقم الهاتف *
                        </label>
                        <Input
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="05xxxxxxxx"
                          className="border-procell-primary/20 focus:border-procell-primary direction-ltr"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-procell-dark mb-2">
                        التاريخ المفضل
                      </label>
                      <Input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        className="border-procell-primary/20 focus:border-procell-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-procell-dark mb-2">
                        وصف المشكلة
                      </label>
                      <Textarea
                        value={problemDescription}
                        onChange={(e) => setProblemDescription(e.target.value)}
                        placeholder="صف المشكلة بالتفصيل..."
                        className="border-procell-primary/20 focus:border-procell-primary min-h-[100px]"
                        rows={4}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg"
                      className="w-full bg-gradient-to-r from-procell-primary to-procell-primary-light hover:from-procell-primary/90 hover:to-procell-primary-light/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Calendar className="h-5 w-5 ml-2" />
                      إرسال طلب الحجز
                      <ArrowRight className="h-5 w-5 mr-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Customer Testimonials */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-procell-dark mb-2 flex items-center justify-center">
              <Star className="h-6 w-6 text-yellow-500 ml-2" />
              💬 آراء عملائنا
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              شهادات حقيقية من عملاء راضين عن خدماتنا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-procell-dark">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 ml-1" />
                        {testimonial.location}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 italic">
                    "{testimonial.review}"
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="bg-procell-accent/10 text-procell-accent px-2 py-1 rounded">
                      {testimonial.service}
                    </span>
                    <span>{testimonial.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Maintenance Centers Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-procell-dark mb-4">
              🔧 مراكز الصيانة المعتمدة
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              شبكة متنامية من مراكز الصيانة في جميع أنحاء فلسطين
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { city: 'نابلس', partner: 'العودة للالكترونيات', status: 'متاح' },
              { city: 'جنين', partner: 'عتابة للهواتف', status: 'متاح' },
              { city: 'رام الله', partner: 'قريباً', status: 'قريباً' },
              { city: 'الخليل', partner: 'قريباً', status: 'قريباً' }
            ].map((center, index) => {
              const isAvailable = center.status === 'متاح';
              return (
                <Card 
                  key={index} 
                  className={`text-center transition-all duration-300 hover:shadow-md ${
                    isAvailable 
                      ? 'bg-white border-green-200' 
                      : 'bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200 border-dashed'
                  }`}
                >
                  <CardContent className="p-4 md:p-6 space-y-3">
                    <MapPin className={`h-6 w-6 mx-auto ${isAvailable ? 'text-procell-primary' : 'text-orange-500'}`} />
                    <h4 className="font-semibold">{center.city}</h4>
                    <p className={`text-sm ${isAvailable ? 'text-muted-foreground' : 'text-orange-600 font-medium'}`}>
                      {center.partner}
                    </p>
                    <Badge 
                      variant={isAvailable ? 'default' : 'secondary'}
                      className={`${
                        isAvailable 
                          ? 'bg-green-600 text-white' 
                          : 'bg-orange-500 text-white'
                      }`}
                    >
                      {center.status}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Contact Info */}
        <div className="bg-gradient-to-r from-procell-primary/5 to-procell-secondary/5 rounded-2xl p-8 md:p-10 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-procell-dark mb-6 flex items-center justify-center">
            <Phone className="h-6 w-6 text-procell-accent ml-2" />
            📞 تواصل معنا مباشرة
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
            <div className="flex items-center justify-center space-x-3 text-lg">
              <Phone className="h-5 w-5 text-procell-accent" />
              <span className="direction-ltr">+970-59-xxx-xxxx</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-lg">
              <MapPin className="h-5 w-5 text-procell-secondary" />
              <span>رام الله - فلسطين</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-lg">
              <Clock className="h-5 w-5 text-procell-primary" />
              <span>يومياً 9:00 - 21:00</span>
            </div>
          </div>

          <Button 
            size="lg"
            className="bg-gradient-to-r from-procell-accent to-procell-accent-light hover:from-procell-accent/90 hover:to-procell-accent-light/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-8 py-4"
          >
            <Phone className="h-5 w-5 ml-2" />
            اتصل بنا الآن
          </Button>
        </div>
      </div>
    </main>
  );
}