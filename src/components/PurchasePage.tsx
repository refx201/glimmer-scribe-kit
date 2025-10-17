import { useState } from 'react';
import { AdditionalServicesDialog, RepairServicesDialog } from './ServiceRequestDialogs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Smartphone, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Star, 
  Shield, 
  ArrowRight,
  Phone,
  MessageCircle,
  Calculator,
  Award,
  TrendingUp,
  Users,
  Zap,
  Eye,
  Upload,
  FileText,
  Gift,
  Crown,
  Verified,
  Heart,
  Target,
  Banknote,
  Headphones
} from 'lucide-react';

// ===================================
// DATA & TYPES
// ===================================

interface DeviceForm {
  brand: string;
  model: string;
  storage: string;
  condition: string;
  accessories: string[];
  description: string;
  contactInfo: {
    name: string;
    phone: string;
    email: string;
    location: string;
  };
}

const DEVICE_BRANDS = [
  'iPhone', 'Samsung Galaxy', 'Huawei', 'Xiaomi', 'OnePlus', 'Google Pixel', 'Oppo', 'Vivo', 'Honor', 'أخرى'
];

const DEVICE_CONDITIONS = [
  { value: 'excellent', label: 'ممتاز - كالجديد', priceMultiplier: 0.9 },
  { value: 'very-good', label: 'جيد جداً - خدوش بسيطة', priceMultiplier: 0.8 },
  { value: 'good', label: 'جيد - علامات استخدام', priceMultiplier: 0.7 },
  { value: 'fair', label: 'مقبول - تلف بسيط', priceMultiplier: 0.6 },
  { value: 'damaged', label: 'تالف - يحتاج إصلاح', priceMultiplier: 0.4 }
];

const STORAGE_OPTIONS = [
  '64GB', '128GB', '256GB', '512GB', '1TB'
];

const ACCESSORIES = [
  'العلبة الأصلية', 'الشاحن الأصلي', 'السماعات الأصلية', 'كابل البيانات', 'دليل الاستخدام'
];

const PURCHASE_FEATURES = [
  {
    icon: DollarSign,
    title: 'أفضل سعر مضمون',
    description: 'نقدم أعلى الأسعار في السوق للأجهزة المستعملة',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    icon: Clock,
    title: 'تقييم فوري',
    description: 'احصل على تقييم سعر الجهاز خلال دقائق',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Shield,
    title: 'معاملة آمنة',
    description: 'عملية شراء آمنة ومضمونة 100%',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    icon: CheckCircle,
    title: 'دفع فوري',
    description: 'استلم أموالك فور اتمام الصفقة',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  }
];

const PURCHASE_STATS = [
  {
    icon: Users,
    number: '5,000+',
    label: 'عميل راضي',
    color: 'text-green-500'
  },
  {
    icon: Smartphone,
    number: '15,000+',
    label: 'جهاز تم شراؤه',
    color: 'text-blue-500'
  },
  {
    icon: Award,
    number: '98%',
    label: 'رضا العملاء',
    color: 'text-purple-500'
  },
  {
    icon: TrendingUp,
    number: '24/7',
    label: 'دعم مستمر',
    color: 'text-orange-500'
  }
];

const POPULAR_DEVICES = [
  {
    brand: 'iPhone 15 Pro Max',
    image: 'https://images.unsplash.com/photo-1592286049617-3feb4da2681e?w=300&h=300&fit=crop&crop=center',
    priceRange: '3,500 - 4,200 ₪',
    demand: 'عالي جداً',
    demandColor: 'bg-red-500'
  },
  {
    brand: 'Samsung S24 Ultra',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=300&fit=crop&crop=center',
    priceRange: '3,000 - 3,800 ₪',
    demand: 'عالي',
    demandColor: 'bg-orange-500'
  },
  {
    brand: 'iPhone 14 Pro',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop&crop=center',
    priceRange: '2,500 - 3,200 ₪',
    demand: 'عالي',
    demandColor: 'bg-orange-500'
  },
  {
    brand: 'Xiaomi 14 Pro',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=300&fit=crop&crop=center',
    priceRange: '1,800 - 2,400 ₪',
    demand: 'متوسط',
    demandColor: 'bg-yellow-500'
  }
];

// ===================================
// COMPONENTS
// ===================================

function PurchaseHero() {
  const handleCallNow = () => {
    window.open('tel:+972598366822', '_self');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent('مرحباً، أرغب في بيع هاتفي لـ ProCell 📱');
    window.open(`https://wa.me/972598366822?text=${message}`, '_blank');
  };

  const scrollToEvaluationForm = () => {
    const evaluationForm = document.getElementById('device-evaluation-form');
    if (evaluationForm) {
      evaluationForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-12 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/3 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-15"></div>
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-green-400 rounded-full blur-3xl opacity-15"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-400 rounded-full blur-2xl opacity-10"></div>
      </div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-900/10 to-transparent"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="text-white">
            {/* Badge */}
            <div className="inline-flex items-center bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-green-400/30">
              <DollarSign className="h-4 w-4 ml-1" />
              خدمة الشراء المتخصصة
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              💰 نشتري هاتفك
              <br />
              <span className="text-green-400">بأفضل سعر</span>
            </h1>

            <p className="text-lg text-blue-100 mb-6 leading-relaxed">
              هل تريد بيع هاتفك القديم أو الجديد؟ في 
              <span className="text-white font-bold bg-blue-600/20 px-2 py-1 rounded-md border border-blue-400/30"> ProCell </span> 
              نقدم لك أفضل الأسعار في السوق الفلسطيني مع ضمان المعاملة الآمنة والدفع الفوري
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <div className="flex items-center text-blue-100 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                <CheckCircle className="h-4 w-4 text-green-400 ml-2 shrink-0" />
                <span className="text-sm">تقييم مجاني ودقيق</span>
              </div>
              <div className="flex items-center text-blue-100 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                <CheckCircle className="h-4 w-4 text-green-400 ml-2 shrink-0" />
                <span className="text-sm">دفع فوري بالكاش</span>
              </div>
              <div className="flex items-center text-blue-100 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                <CheckCircle className="h-4 w-4 text-green-400 ml-2 shrink-0" />
                <span className="text-sm">جميع أنواع الهواتف</span>
              </div>
              <div className="flex items-center text-blue-100 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                <CheckCircle className="h-4 w-4 text-green-400 ml-2 shrink-0" />
                <span className="text-sm">معاملة آمنة 100%</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleCallNow}
                className="bg-green-500 hover:bg-green-600 text-white font-bold text-base px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-green-400/30"
              >
                <Phone className="h-4 w-4 ml-2" />
                اتصل للتقييم الآن
              </Button>
              <Button 
                onClick={handleWhatsApp}
                className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 font-bold text-base px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/30"
              >
                <MessageCircle className="h-4 w-4 ml-2" />
                واتساب مباشر
              </Button>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative">
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <Smartphone className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  احصل على تقييم فوري
                </h3>
                <p className="text-blue-100 mb-4 text-sm">
                  أرسل تفاصيل هاتفك واحصل على السعر خلال دقائق
                </p>
                <Button 
                  onClick={scrollToEvaluationForm}
                  className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg border border-green-400/30"
                >
                  ⏱️ تقييم خلال 5 دقائق
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PurchaseFeatures() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🌟 لماذا تختار ProCell؟
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            نحن الخيار الأول لبيع الهواتف في فلسطين بفضل خدماتنا المتميزة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {PURCHASE_FEATURES.map((feature, index) => (
            <Card key={index} className={`${feature.bgColor} border-0 text-center p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
              <div className={`mx-auto w-16 h-16 bg-white ${feature.color} rounded-full flex items-center justify-center mb-4 shadow-sm`}>
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {PURCHASE_STATS.map((stat, index) => (
            <Card key={index} className="bg-white border-0 text-center p-6 shadow-sm">
              <div className={`mx-auto w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mb-3`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.number}
              </div>
              <p className="text-gray-600 text-sm font-medium">
                {stat.label}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function PopularDevices() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            📱 الأجهزة الأكثر طلباً
          </h2>
          <p className="text-xl text-gray-600">
            نشتري هذه الأجهزة بأفضل الأسعار
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_DEVICES.map((device, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="relative">
                <div className="aspect-square overflow-hidden">
                  <ImageWithFallback
                    src={device.image}
                    alt={device.brand}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute top-3 right-3">
                  <Badge className={`${device.demandColor} text-white text-xs`}>
                    <TrendingUp className="h-3 w-3 ml-1" />
                    {device.demand}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{device.brand}</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">نطاق السعر:</span>
                  <span className="font-bold text-green-600">{device.priceRange}</span>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Calculator className="h-4 w-4 ml-2" />
                  احصل على تقييم
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            لا تجد هاتفك في القائمة؟ لا مشكلة!
          </p>
          <Button className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3">
            <Smartphone className="h-5 w-5 ml-2" />
            قييم أي جهاز آخر
          </Button>
        </div>
      </div>
    </section>
  );
}

function DeviceEvaluationForm() {
  const [form, setForm] = useState<DeviceForm>({
    brand: '',
    model: '',
    storage: '',
    condition: '',
    accessories: [],
    description: '',
    contactInfo: {
      name: '',
      phone: '',
      email: '',
      location: ''
    }
  });

  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAccessoryChange = (accessory: string, checked: boolean) => {
    setForm(prev => ({
      ...prev,
      accessories: checked 
        ? [...prev.accessories, accessory]
        : prev.accessories.filter(a => a !== accessory)
    }));
  };

  const calculateEstimatedPrice = () => {
    // Simple price estimation logic
    const basePrices: { [key: string]: number } = {
      'iPhone': 3000,
      'Samsung Galaxy': 2500,
      'Huawei': 1800,
      'Xiaomi': 1500,
      'OnePlus': 2000,
      'Google Pixel': 2200
    };

    const storageMultipliers: { [key: string]: number } = {
      '64GB': 0.8,
      '128GB': 1.0,
      '256GB': 1.2,
      '512GB': 1.4,
      '1TB': 1.6
    };

    const basePrice = basePrices[form.brand] || 1000;
    const storageMultiplier = storageMultipliers[form.storage] || 1.0;
    const conditionMultiplier = DEVICE_CONDITIONS.find(c => c.value === form.condition)?.priceMultiplier || 0.7;
    const accessoryBonus = form.accessories.length * 50;

    const estimated = Math.round((basePrice * storageMultiplier * conditionMultiplier) + accessoryBonus);
    setEstimatedPrice(estimated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Save to database
      const { data: newRequest, error } = await supabase
        .from('device_evaluation_requests')
        .insert([{
          brand: form.brand,
          model: form.model,
          storage: form.storage,
          condition: form.condition,
          accessories: form.accessories,
          description: form.description,
          customer_name: form.contactInfo.name,
          customer_phone: form.contactInfo.phone,
          customer_email: form.contactInfo.email,
          customer_location: form.contactInfo.location,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Send Telegram notification
      try {
        await supabase.functions.invoke('send-telegram-notification', {
          body: {
            type: 'device_evaluation',
            data: newRequest
          }
        });
      } catch (notifError) {
        console.error('Failed to send Telegram notification:', notifError);
      }

      // Show success toast and reset form
      toast.success('تم إرسال طلبك بنجاح! سنتواصل معك قريباً');
      
      // Reset form to initial state
      setForm({
        brand: '',
        model: '',
        storage: '',
        condition: '',
        accessories: [],
        description: '',
        contactInfo: {
          name: '',
          phone: '',
          email: '',
          location: ''
        }
      });
      
      setEstimatedPrice(null);
      setIsSubmitted(false);
    } catch (error: any) {
      console.error('Error submitting evaluation:', error);
      toast.error('فشل إرسال الطلب. يرجى المحاولة مرة أخرى');
    }
  };

  if (isSubmitted && estimatedPrice) {
    return (
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6">
          <Card className="max-w-2xl mx-auto bg-white shadow-xl border-0">
            <CardHeader className="text-center bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-bold flex items-center justify-center">
                <CheckCircle className="h-8 w-8 ml-2" />
                تقييم جهازك مكتمل!
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {estimatedPrice.toLocaleString()} ₪
                </div>
                <p className="text-gray-600">السعر المقدر لجهازك</p>
              </div>

              <Alert className="mb-6 border-blue-200 bg-blue-50">
                <AlertDescription className="text-center">
                  🎉 تهانينا! هذا تقدير أولي. سيقوم فريقنا بالتواصل معك خلال ساعة لتأكيد السعر النهائي
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <Button 
                  onClick={() => window.open('tel:+972598366822', '_self')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3"
                >
                  <Phone className="h-5 w-5 ml-2" />
                  تأكيد البيع - اتصال فوري
                </Button>
                <Button 
                  onClick={() => {
                    const message = encodeURIComponent(`مرحباً، حصلت على تقييم ${estimatedPrice} ₪ لجهاز ${form.brand} ${form.model}. أرغب في تأكيد البيع.`);
                    window.open(`https://wa.me/972598366822?text=${message}`, '_blank');
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
                >
                  <MessageCircle className="h-5 w-5 ml-2" />
                  واتساب - تأكيد سريع
                </Button>
                <Button 
                  onClick={() => {
                    setIsSubmitted(false);
                    setEstimatedPrice(null);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  تقييم جهاز آخر
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="device-evaluation-form" className="py-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            📋 قييم جهازك مجاناً
          </h2>
          <p className="text-xl text-gray-600">
            أدخل تفاصيل جهازك واحصل على تقييم فوري
          </p>
        </div>

        <Card className="max-w-4xl mx-auto bg-white shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="text-xl font-bold text-center">
              نموذج تقييم الجهاز
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Device Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="brand" className="font-semibold">نوع الجهاز *</Label>
                  <Select value={form.brand} onValueChange={(value) => setForm(prev => ({ ...prev, brand: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الجهاز" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEVICE_BRANDS.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="model" className="font-semibold">موديل الجهاز *</Label>
                  <Input
                    id="model"
                    value={form.model}
                    onChange={(e) => setForm(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="مثال: iPhone 15 Pro Max"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="storage" className="font-semibold">مساحة التخزين *</Label>
                  <Select value={form.storage} onValueChange={(value) => setForm(prev => ({ ...prev, storage: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر مساحة التخزين" />
                    </SelectTrigger>
                    <SelectContent>
                      {STORAGE_OPTIONS.map(storage => (
                        <SelectItem key={storage} value={storage}>{storage}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="condition" className="font-semibold">حالة الجهاز *</Label>
                  <Select value={form.condition} onValueChange={(value) => setForm(prev => ({ ...prev, condition: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر حالة الجهاز" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEVICE_CONDITIONS.map(condition => (
                        <SelectItem key={condition.value} value={condition.value}>
                          {condition.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Accessories */}
              <div>
                <Label className="font-semibold mb-3 block">الإكسسوارات المتوفرة</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ACCESSORIES.map(accessory => (
                    <div key={accessory} className="flex items-center space-x-2 space-x-reverse">
                      <input
                        type="checkbox"
                        id={accessory}
                        checked={form.accessories.includes(accessory)}
                        onChange={(e) => handleAccessoryChange(accessory, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={accessory} className="text-sm">{accessory}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="font-semibold">وصف إضافي</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="أي ملاحظات إضافية حول الجهاز (اختياري)"
                  rows={3}
                />
              </div>

              {/* Contact Information */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-4">معلومات التواصل</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="font-semibold">الاسم الكامل *</Label>
                    <Input
                      id="name"
                      value={form.contactInfo.name}
                      onChange={(e) => setForm(prev => ({ 
                        ...prev, 
                        contactInfo: { ...prev.contactInfo, name: e.target.value }
                      }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="font-semibold">رقم الهاتف *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.contactInfo.phone}
                      onChange={(e) => setForm(prev => ({ 
                        ...prev, 
                        contactInfo: { ...prev.contactInfo, phone: e.target.value }
                      }))}
                      placeholder="05xxxxxxxx"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="font-semibold">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.contactInfo.email}
                      onChange={(e) => setForm(prev => ({ 
                        ...prev, 
                        contactInfo: { ...prev.contactInfo, email: e.target.value }
                      }))}
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location" className="font-semibold">المدينة *</Label>
                    <Input
                      id="location"
                      value={form.contactInfo.location}
                      onChange={(e) => setForm(prev => ({ 
                        ...prev, 
                        contactInfo: { ...prev.contactInfo, location: e.target.value }
                      }))}
                      placeholder="مثال: رام الله"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold text-lg px-12 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  disabled={!form.brand || !form.model || !form.storage || !form.condition || !form.contactInfo.name || !form.contactInfo.phone || !form.contactInfo.location}
                >
                  <Target className="h-5 w-5 ml-2" />
                  قييم هاتفك الآن
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function PurchaseProcess() {
  const steps = [
    {
      number: 1,
      title: 'أرسل تفاصيل جهازك',
      description: 'املأ النموذج أو اتصل بنا',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      number: 2,
      title: 'احصل على التقييم',
      description: 'تقييم فوري خلال دقائق',
      icon: Calculator,
      color: 'bg-green-500'
    },
    {
      number: 3,
      title: 'اتفق على السعر',
      description: 'تفاوض واتفق على السعر النهائي',
      icon: Banknote,
      color: 'bg-purple-500'
    },
    {
      number: 4,
      title: 'استلم أموالك',
      description: 'دفع فوري بالكاش أو تحويل',
      icon: CheckCircle,
      color: 'bg-orange-500'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🔄 كيف تعمل عملية الشراء؟
          </h2>
          <p className="text-xl text-gray-600">
            عملية بسيطة وسريعة في 4 خطوات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={step.number} className="text-center group">
              <div className="relative mb-6">
                <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center text-white mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="h-10 w-10" />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 font-bold text-sm px-3 py-1 rounded-full border-2 border-gray-200">
                  {step.number}
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full">
                  <ArrowRight className="h-6 w-6 text-gray-300 mx-auto" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Card className="max-w-md mx-auto bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-2xl mb-3">⏱️</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                العملية تستغرق أقل من ساعة!
              </h3>
              <p className="text-gray-600 text-sm">
                من التقييم إلى استلام الأموال
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const handleCallNow = () => {
    window.open('tel:+972598366822', '_self');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent('مرحباً، أرغب في الاستفسار عن خدمة شراء الهواتف 📱');
    window.open(`https://wa.me/972598366822?text=${message}`, '_blank');
  };

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            🤝 هل لديك استفسار؟
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            فريقنا المتخصص جاهز لمساعدتك في تقييم جهازك والإجابة على جميع استفساراتك
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleCallNow}
              className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-bold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <Phone className="h-5 w-5 ml-2" />
              972-598-366-822
            </Button>
            <Button 
              onClick={handleWhatsApp}
              className="bg-green-500 hover:bg-green-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="h-5 w-5 ml-2" />
              واتساب مباشر
            </Button>
          </div>

          <div className="mt-8 text-blue-100">
            <p className="text-sm">
              📍 متوفرون في جميع أنحاء فلسطين | ⏰ خدمة 24/7
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===================================
// MAIN PURCHASE PAGE COMPONENT
// ===================================

export function PurchasePage() {
  return (
    <div className="min-h-screen bg-background">
      <PurchaseHero />
      <PurchaseFeatures />
      
      {/* Service Buttons Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              خدماتنا المتخصصة
            </h2>
            <p className="text-xl text-gray-600">
              احصل على أفضل الخدمات لأجهزتك
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <AdditionalServicesDialog />
            <RepairServicesDialog />
          </div>
        </div>
      </section>
      
      <DeviceEvaluationForm />
      <ContactSection />
    </div>
  );
}