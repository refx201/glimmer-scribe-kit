import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { 
  RefreshCw, 
  Smartphone, 
  DollarSign, 
  Clock, 
  Shield, 
  CheckCircle, 
  TrendingUp,
  Zap,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner'
import { apiCall } from '../lib/supabase';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function TradeInSection() {
  const [loading, setLoading] = useState(false);
  const [requestData, setRequestData] = useState({
    brand: '',
    model: '',
    condition: '',
    storage: '',
    accessories: '',
    customer_name: '',
    customer_phone: ''
  });

  const benefits = [
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: 'أسعار عادلة',
      description: 'احصل على أفضل سعر لجهازك القديم في السوق',
      highlight: 'حتى 80% من السعر الأصلي'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'تقييم سريع',
      description: 'تقييم فوري لجهازك خلال دقائق',
      highlight: '5 دقائق فقط'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'ضمان آمن',
      description: 'حماية كاملة لبياناتك وخصوصيتك',
      highlight: 'محو آمن للبيانات'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'استبدال فوري',
      description: 'استبدل واحصل على جهاز جديد في نفس اليوم',
      highlight: 'نفس اليوم'
    }
  ];

  const popularModels = [
    { brand: 'iPhone', model: '15 Pro', estimatedValue: '₪2,800-3,200', image: 'https://images.unsplash.com/photo-1592286049617-3feb4da2681e?w=200&h=200&fit=crop' },
    { brand: 'Samsung', model: 'Galaxy S24', estimatedValue: '₪2,200-2,800', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&h=200&fit=crop' },
    { brand: 'iPhone', model: '14', estimatedValue: '₪2,000-2,400', image: 'https://images.unsplash.com/photo-1592286049617-3feb4da2681e?w=200&h=200&fit=crop' },
    { brand: 'Google', model: 'Pixel 8', estimatedValue: '₪1,800-2,200', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop' }
  ];

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requestData.brand || !requestData.model || !requestData.condition || !requestData.customer_name || !requestData.customer_phone) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    setLoading(true);
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase
        .from('trade_in_requests')
        .insert([{
          brand: requestData.brand,
          model: requestData.model,
          condition: requestData.condition,
          storage: requestData.storage,
          accessories: requestData.accessories,
          customer_name: requestData.customer_name,
          customer_phone: requestData.customer_phone,
          status: 'pending'
        } as any])
        .select()
        .single();
      
      if (error) throw error;
      
      await supabase.functions.invoke('send-telegram-notification', {
        body: {
          type: 'trade_in',
          data: data
        }
      });
      
      toast.success('تم إرسال طلبك بنجاح! سنتواصل معك قريباً.');
      
      setRequestData({
        brand: '',
        model: '',
        condition: '',
        storage: '',
        accessories: '',
        customer_name: '',
        customer_phone: ''
      });
    } catch (error: any) {
      console.error('Trade-in request error:', error);
      toast.error(error.message || 'حدث خطأ في إرسال الطلب. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setRequestData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="trade-in" className="py-16 md:py-20 bg-gradient-to-br from-procell-accent/5 to-procell-primary/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12 md:mb-16">
          <Badge className="w-fit mx-auto bg-procell-accent text-white">
            <RefreshCw className="h-4 w-4 ml-2" />
            استبدال الأجهزة
          </Badge>
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-procell-dark">
            استبدل هاتفك القديم بجديد
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            احصل على أفضل قيمة لهاتفك القديم واستبدله بأحدث الأجهزة بسعر مناسب
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Benefits & Popular Models */}
          <div className="space-y-8">
            {/* Benefits */}
            <div className="space-y-6">
              <h3 className="text-xl md:text-2xl text-procell-dark">لماذا تختار خدمة الاستبدال؟</h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-white/50 border border-procell-accent/20 hover:shadow-md transition-shadow">
                    <div className="text-procell-accent p-2 bg-procell-accent/10 rounded-lg shrink-0">
                      {benefit.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-procell-dark font-medium">{benefit.title}</h4>
                        <Badge variant="outline" className="border-procell-accent text-procell-accent text-xs">
                          {benefit.highlight}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Models */}
            <div className="space-y-6">
              <h3 className="text-xl md:text-2xl text-procell-dark">أسعار تقديرية للأجهزة الشائعة</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {popularModels.map((model, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow border-procell-primary/10">
                    <CardContent className="p-4 flex items-center space-x-4">
                      <ImageWithFallback
                        src={model.image}
                        alt={`${model.brand} ${model.model}`}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-procell-dark truncate">
                          {model.brand} {model.model}
                        </h4>
                        <p className="text-xs text-procell-accent font-medium">
                          {model.estimatedValue}
                        </p>
                      </div>
                      <TrendingUp className="h-4 w-4 text-procell-accent" />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                * الأسعار تقديرية وتعتمد على حالة الجهاز والإكسسوارات
              </p>
            </div>
          </div>

          {/* Estimate Form */}
          <Card className="border-procell-accent/20 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-xl md:text-2xl text-procell-dark flex items-center justify-center">
                <Smartphone className="h-6 w-6 ml-2" />
                📋 قييم جهازك مجاناً
              </CardTitle>
              <p className="text-muted-foreground">
                أدخل تفاصيل هاتفك ومعلومات التواصل وسنتواصل معك قريباً
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitRequest} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer_name">الاسم *</Label>
                    <Input
                      id="customer_name"
                      value={requestData.customer_name}
                      onChange={(e) => handleInputChange('customer_name', e.target.value)}
                      placeholder="أدخل اسمك"
                      required
                      className="border-procell-accent/20 focus:border-procell-accent"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer_phone">رقم الهاتف *</Label>
                    <Input
                      id="customer_phone"
                      value={requestData.customer_phone}
                      onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                      placeholder="أدخل رقم هاتفك"
                      required
                      className="border-procell-accent/20 focus:border-procell-accent"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">العلامة التجارية *</Label>
                    <Select onValueChange={(value) => handleInputChange('brand', value)} value={requestData.brand}>
                      <SelectTrigger className="border-procell-accent/20 focus:border-procell-accent">
                        <SelectValue placeholder="اختر العلامة التجارية" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="samsung">Samsung</SelectItem>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="oneplus">OnePlus</SelectItem>
                        <SelectItem value="xiaomi">Xiaomi</SelectItem>
                        <SelectItem value="huawei">Huawei</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">الموديل *</Label>
                    <Input
                      id="model"
                      value={requestData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      placeholder="مثل: iPhone 15, Galaxy S24"
                      required
                      className="border-procell-accent/20 focus:border-procell-accent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">حالة الجهاز *</Label>
                  <Select onValueChange={(value) => handleInputChange('condition', value)} value={requestData.condition}>
                    <SelectTrigger className="border-procell-accent/20 focus:border-procell-accent">
                      <SelectValue placeholder="اختر حالة الجهاز" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">ممتازة - كالجديد</SelectItem>
                      <SelectItem value="good">جيدة - خدوش بسيطة</SelectItem>
                      <SelectItem value="fair">متوسطة - خدوش واضحة</SelectItem>
                      <SelectItem value="poor">سيئة - تلفيات ظاهرة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="storage">مساحة التخزين</Label>
                    <Select onValueChange={(value) => handleInputChange('storage', value)} value={requestData.storage}>
                      <SelectTrigger className="border-procell-accent/20 focus:border-procell-accent">
                        <SelectValue placeholder="اختر المساحة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="64gb">64 جيجا</SelectItem>
                        <SelectItem value="128gb">128 جيجا</SelectItem>
                        <SelectItem value="256gb">256 جيجا</SelectItem>
                        <SelectItem value="512gb">512 جيجا</SelectItem>
                        <SelectItem value="1tb">1 تيرا</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accessories">الإكسسوارات</Label>
                    <Select onValueChange={(value) => handleInputChange('accessories', value)} value={requestData.accessories}>
                      <SelectTrigger className="border-procell-accent/20 focus:border-procell-accent">
                        <SelectValue placeholder="اختر الإكسسوارات" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="complete">كاملة (علبة + شاحن + سماعات)</SelectItem>
                        <SelectItem value="partial">جزئية (علبة + شاحن)</SelectItem>
                        <SelectItem value="box-only">العلبة فقط</SelectItem>
                        <SelectItem value="none">بدون إكسسوارات</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-procell-accent to-procell-accent-light hover:from-procell-accent/90 hover:to-procell-accent-light/90" 
                  size="lg" 
                  disabled={loading}
                >
                  <CheckCircle className="h-5 w-5 ml-2" />
                  {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
                  <ArrowRight className="h-5 w-5 mr-2" />
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    سنتواصل معك قريباً لتقييم جهازك
                  </p>
                  <div className="flex justify-center items-center space-x-4 text-xs text-procell-accent">
                    <div className="flex items-center">
                      <CheckCircle className="h-3 w-3 ml-1" />
                      <span>تقييم مجاني</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 ml-1" />
                      <span>رد سريع</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="h-3 w-3 ml-1" />
                      <span>بيانات آمنة</span>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Process Steps */}
        <div className="bg-white/50 rounded-2xl p-6 md:p-8 border border-procell-accent/20">
          <h3 className="text-xl md:text-2xl text-center text-procell-dark mb-8">كيف تعمل خدمة الاستبدال؟</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'قدم تفاصيل جهازك', desc: 'املأ النموذج بمعلومات الجهاز' },
              { step: '2', title: 'احصل على التقدير', desc: 'سنرسل لك السعر المقترح خلال دقائق' },
              { step: '3', title: 'أحضر الجهاز', desc: 'زر أقرب فرع لنا أو اطلب خدمة التوصيل' },
              { step: '4', title: 'استلم الجديد', desc: 'اختر جهازك الجديد واستلمه فوراً' }
            ].map((step, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="w-12 h-12 bg-procell-accent text-white rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                  {step.step}
                </div>
                <h4 className="text-sm font-medium text-procell-dark">{step.title}</h4>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}