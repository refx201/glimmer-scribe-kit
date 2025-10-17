import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { 
  Store, 
  Users, 
  TrendingUp, 
  HeadphonesIcon, 
  CheckCircle, 
  Star,
  Award,
  MapPin,
  Phone,
  Mail,
  Clock,
  Shield,
  DollarSign,
  Target,
  Zap
} from 'lucide-react';
import { toast } from 'sonner'
import { apiCall } from '../lib/supabase';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function BusinessPartnershipPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    storeType: '',
    experience: '',
    notes: ''
  });

  const benefits = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'أسعار تنافسية',
      description: 'احصل على أفضل أسعار الجملة في السوق مع هوامش ربح ممتازة',
      highlight: 'حتى 25% هامش ربح'
    },
    {
      icon: <Store className="h-6 w-6" />,
      title: 'دعم تسويقي شامل',
      description: 'مواد تسويقية مجانية ودعم في الحملات الإعلانية والعروض الترويجية',
      highlight: 'مواد مجانية'
    },
    {
      icon: <HeadphonesIcon className="h-6 w-6" />,
      title: 'دعم فني متخصص',
      description: 'فريق دعم مخصص للشركاء على مدار الساعة لحل أي مشكلة تقنية',
      highlight: 'دعم 24/7'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'شبكة شركاء قوية',
      description: 'انضم إلى شبكة من أكثر من 500 شريك ناجح في فلسطين',
      highlight: '+500 شريك'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'ضمان شامل',
      description: 'ضمان كامل على جميع المنتجات مع خدمة ما بعد البيع',
      highlight: 'ضمان شامل'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'توصيل سريع',
      description: 'خدمة توصيل سريعة وموثوقة لجميع المحافظات الفلسطينية',
      highlight: 'توصيل مجاني'
    }
  ];

  const partnerStats = [
    { number: '500+', label: 'شريك معتمد', icon: <Store className="h-5 w-5" /> },
    { number: '300-500', label: 'وحدة شهرياً', icon: <TrendingUp className="h-5 w-5" /> },
    { number: '15-25%', label: 'هامش ربح متوسط', icon: <DollarSign className="h-5 w-5" /> },
    { number: '24/7', label: 'دعم فني', icon: <HeadphonesIcon className="h-5 w-5" /> }
  ];

  const successStories = [
    {
      name: 'أحمد محمد',
      storeName: 'متجر الأمل للهواتف',
      location: 'نابلس',
      story: 'منذ انضمامي لشبكة ProCell، زادت مبيعاتي بنسبة 40% وحصلت على دعم ممتاز من الفريق.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      growth: '+40%'
    },
    {
      name: 'فاطمة أحمد',
      storeName: 'محل التقنيات الحديثة',
      location: 'طولكرم',
      story: 'الشراكة مع ProCell وفرت لي مجموعة متنوعة من المنتجات عالية الجودة والأرباح ممتازة.',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      growth: '+60%'
    },
    {
      name: 'خالد عبدالله',
      storeName: 'مركز التقنيات المتطورة',
      location: 'سلفيت',
      story: 'أفضل شريك تجاري تعاملت معه. الدعم التسويقي والتدريب ساعدني كثيراً في زيادة المبيعات.',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
      growth: '+35%'
    }
  ];

  const requirements = [
    'متجر أو مركز مرخص للأجهزة الإلكترونية',
    'خبرة لا تقل عن سنة في مجال الهواتف',
    'موقع تجاري مناسب في منطقة حيوية',
    'الالتزام بمعايير الجودة والخدمة'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.storeName || !formData.ownerName || !formData.phone || !formData.city || !formData.address || !formData.storeType) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    setLoading(true);
    
    try {
      await apiCall('/partners/apply', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      toast.success('تم إرسال طلب الشراكة بنجاح! سنتواصل معك خلال 24 ساعة.');
      
      // Reset form
      setFormData({
        storeName: '',
        ownerName: '',
        phone: '',
        email: '',
        city: '',
        address: '',
        storeType: '',
        experience: '',
        notes: ''
      });
    } catch (error: any) {
      console.error('Partner application error:', error);
      toast.error(error.message || 'حدث خطأ في إرسال الطلب. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-procell-primary/5 to-procell-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 mb-12">
            <Badge className="w-fit mx-auto bg-procell-primary text-white px-4 py-2">
              <Store className="h-4 w-4 ml-2" />
              الشراكة التجارية
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl text-procell-dark">
              انضم إلى شبكة شركاء النجاح التجاري
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              كن جزءاً من أكبر شبكة لتجارة الهواتف في فلسطين واحصل على دعم شامل لنمو أعمالك مع أفضل الأسعار والخدمات
            </p>
            <div className="flex justify-center space-x-4 pt-4">
              <Badge variant="outline" className="border-procell-primary text-procell-primary">
                <Award className="h-4 w-4 ml-2" />
                شريك معتمد
              </Badge>
              <Badge variant="outline" className="border-procell-secondary text-procell-secondary">
                <Target className="h-4 w-4 ml-2" />
                نمو مضمون
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {partnerStats.map((stat, index) => (
              <Card key={index} className="text-center border-procell-primary/20 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <div className="text-procell-primary mx-auto w-fit">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-procell-primary">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Benefits & Requirements */}
            <div className="space-y-8">
              {/* Benefits */}
              <div className="space-y-6">
                <h3 className="text-xl md:text-2xl text-procell-dark">مزايا الشراكة التجارية مع ProCell</h3>
                <p className="text-muted-foreground">
                  نقدم لشركائنا التجاريين حلولاً متكاملة لنمو أعمالهم وزيادة أرباحهم بشكل مستدام
                </p>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-white/50 border border-procell-primary/20 hover:shadow-md transition-shadow group">
                      <div className="text-procell-primary p-3 bg-procell-primary/10 rounded-xl shrink-0 group-hover:bg-procell-primary/20 transition-colors">
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

              {/* Requirements */}
              <div className="space-y-6">
                <h3 className="text-xl md:text-2xl text-procell-dark">متطلبات الانضمام</h3>
                <div className="space-y-3">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-procell-light/50 rounded-lg border border-procell-primary/10">
                      <CheckCircle className="h-5 w-5 text-procell-accent shrink-0" />
                      <span className="text-sm text-procell-dark">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Application Form */}
            <Card className="border-procell-primary/20 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-xl md:text-2xl text-procell-dark">طلب شراكة تجارية</CardTitle>
                <p className="text-muted-foreground">
                  للمتاجر ومراكز الصيانة الراغبة في الانضمام لشبكتنا
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="storeName">اسم المتجر *</Label>
                      <Input
                        id="storeName"
                        value={formData.storeName}
                        onChange={(e) => handleInputChange('storeName', e.target.value)}
                        placeholder="متجر الإلكترونيات"
                        required
                        className="border-procell-primary/20 focus:border-procell-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownerName">اسم المالك *</Label>
                      <Input
                        id="ownerName"
                        value={formData.ownerName}
                        onChange={(e) => handleInputChange('ownerName', e.target.value)}
                        placeholder="محمد أحمد"
                        required
                        className="border-procell-primary/20 focus:border-procell-primary"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="059-XXX-XXXX"
                        required
                        className="border-procell-primary/20 focus:border-procell-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="example@email.com"
                        className="border-procell-primary/20 focus:border-procell-primary"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">المدينة *</Label>
                      <Select onValueChange={(value) => handleInputChange('city', value)} value={formData.city}>
                        <SelectTrigger className="border-procell-primary/20 focus:border-procell-primary">
                          <SelectValue placeholder="اختر المدينة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nablus">نابلس</SelectItem>
                          <SelectItem value="jenin">جنين</SelectItem>
                          <SelectItem value="ramallah">رام الله</SelectItem>
                          <SelectItem value="hebron">الخليل</SelectItem>
                          <SelectItem value="bethlehem">بيت لحم</SelectItem>
                          <SelectItem value="tulkarm">طولكرم</SelectItem>
                          <SelectItem value="qalqilya">قلقيلية</SelectItem>
                          <SelectItem value="salfit">سلفيت</SelectItem>
                          <SelectItem value="jerusalem">القدس</SelectItem>
                          <SelectItem value="gaza">غزة</SelectItem>
                          <SelectItem value="other">أخرى</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storeType">نوع المتجر *</Label>
                      <Select onValueChange={(value) => handleInputChange('storeType', value)} value={formData.storeType}>
                        <SelectTrigger className="border-procell-primary/20 focus:border-procell-primary">
                          <SelectValue placeholder="اختر نوع المتجر" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mobile-shop">متجر هواتف</SelectItem>
                          <SelectItem value="electronics">متجر إلكترونيات</SelectItem>
                          <SelectItem value="repair-center">مركز صيانة</SelectItem>
                          <SelectItem value="wholesale">تاجر جملة</SelectItem>
                          <SelectItem value="accessories">متجر إكسسوارات</SelectItem>
                          <SelectItem value="mixed">متجر مختلط</SelectItem>
                          <SelectItem value="other">أخرى</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان التفصيلي *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="الشارع، الحي، المدينة"
                      required
                      className="border-procell-primary/20 focus:border-procell-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">سنوات الخبرة</Label>
                    <Select onValueChange={(value) => handleInputChange('experience', value)} value={formData.experience}>
                      <SelectTrigger className="border-procell-primary/20 focus:border-procell-primary">
                        <SelectValue placeholder="اختر سنوات الخبرة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="less-than-1">أقل من سنة</SelectItem>
                        <SelectItem value="1-3">1-3 سنوات</SelectItem>
                        <SelectItem value="3-5">3-5 سنوات</SelectItem>
                        <SelectItem value="5-10">5-10 سنوات</SelectItem>
                        <SelectItem value="more-than-10">أكثر من 10 سنوات</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">ملاحظات إضافية</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="أي معلومات إضافية عن متجرك أو خططك المستقبلية..."
                      rows={3}
                      className="border-procell-primary/20 focus:border-procell-primary"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-procell-primary to-procell-primary-light hover:from-procell-primary/90 hover:to-procell-primary-light/90" 
                    size="lg" 
                    disabled={loading}
                  >
                    <CheckCircle className="h-5 w-5 ml-2" />
                    {loading ? 'جاري الإرسال...' : 'إرسال طلب الشراكة'}
                  </Button>

                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      سنتواصل معك خلال 24 ساعة لمراجعة طلبك وتحديد موعد لقاء
                    </p>
                    <div className="flex justify-center items-center space-x-4 text-xs text-procell-primary">
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 ml-1" />
                        <span>مكالمة تأكيد</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 ml-1" />
                        <span>تأكيد بالإيميل</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 ml-1" />
                        <span>رد سريع</span>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Success Stories */}
          <div className="space-y-8 mb-16">
            <h3 className="text-xl md:text-2xl text-center text-procell-dark">قصص نجاح شركائنا</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {successStories.map((story, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-procell-primary/10">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start space-x-4">
                      <ImageWithFallback
                        src={story.avatar}
                        alt={story.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-procell-primary/20"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-procell-dark truncate">
                            {story.name}
                          </h4>
                          <Badge className="bg-procell-accent text-white text-xs">
                            {story.growth}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{story.storeName}</p>
                        <div className="flex items-center text-xs text-procell-primary mt-1">
                          <MapPin className="h-3 w-3 ml-1" />
                          {story.location}
                        </div>
                      </div>
                    </div>
                    <blockquote className="text-sm text-procell-dark leading-relaxed">
                      "{story.story}"
                    </blockquote>
                    <div className="flex text-procell-secondary">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <Card className="bg-gradient-to-r from-procell-primary/5 to-procell-secondary/5 border-procell-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl md:text-2xl text-procell-dark mb-6">
                لديك أسئلة حول الشراكة؟
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                فريقنا مستعد للإجابة على جميع استفساراتك ومساعدتك في اتخاذ القرار المناسب
              </p>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center justify-center space-x-2 p-3 bg-white/50 rounded-lg">
                  <Phone className="h-4 w-4 text-procell-primary" />
                  <span className="text-sm">+970 59 XXX XXXX</span>
                </div>
                <div className="flex items-center justify-center space-x-2 p-3 bg-white/50 rounded-lg">
                  <Mail className="h-4 w-4 text-procell-primary" />
                  <span className="text-sm">partners@procell.app</span>
                </div>
                <div className="flex items-center justify-center space-x-2 p-3 bg-white/50 rounded-lg">
                  <Clock className="h-4 w-4 text-procell-primary" />
                  <span className="text-sm">الأحد - الخميس 9-18</span>
                </div>
              </div>
              <Button className="bg-procell-primary hover:bg-procell-primary/90">
                تواصل مع فريق الشراكات
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}