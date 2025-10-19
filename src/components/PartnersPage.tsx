import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { PartnerStoriesCarousel } from './PartnerStoriesCarousel';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Award, 
  Target, 
  Clock, 
  CheckCircle, 
  Star, 
  ArrowRight,
  Smartphone,
  Share2,
  BarChart3,
  Wallet,
  Heart,
  MessageCircle,
  Phone,
  Mail,
  Globe,
  Send,
  Calculator,
  Zap,
  Shield,
  Gift,
  Percent,
  Headphones
} from 'lucide-react';
import { toast } from 'sonner'

export function PartnersPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: '',
    experience: '',
    expectedSales: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch commission levels from database
  const { data: commissionLevels = [] } = useQuery({
    queryKey: ['commission-levels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commission_levels')
        .select('*')
        .eq('is_active', true as any)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch partner success stories from database
  const { data: partnerStories = [] } = useQuery({
    queryKey: ['partner-success-stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_success_stories')
        .select('*')
        .eq('is_active', true as any)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch stat boxes for hero quick benefits (from home page only)
  const { data: partnerStats = [], isLoading: statsLoading } = useQuery({
    queryKey: ['partner-stat-boxes-hero'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stat_boxes')
        .select('*')
        .eq('is_active', true as any)
        .eq('page', 'home')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const iconMap: Record<string, any> = { Users, Percent, TrendingUp, Headphones, DollarSign, Target, Clock, Star, Award, CheckCircle };

  const partnershipBenefits = [
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: 'عمولات مرتفعة',
      description: 'احصل على عمولة تصل إلى 15% من كل عملية بيع',
      highlight: 'حتى 15%',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'نمو مستمر',
      description: 'زيادة العمولة مع نمو مبيعاتك الشهرية',
      highlight: 'نمو تلقائي',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Wallet className="h-8 w-8" />,
      title: 'دفع سريع',
      description: 'استلم أرباحك كل أسبوع مباشرة في حسابك',
      highlight: 'أسبوعياً',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: 'منتجات متنوعة',
      description: 'أكثر من 1000 منتج من أفضل العلامات التجارية',
      highlight: '1000+ منتج',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Insert join request
      const { data, error } = await supabase
        .from('join_requests')
        .insert([{
          full_name: formData.name,
          phone_number: formData.phone,
          experience: `${formData.businessType} - ${formData.experience}`,
          help_description: `Expected Sales: ${formData.expectedSales}\n\n${formData.message}`
        } as any])
        .select()
        .single();

      if (error) throw error;

      // Send Telegram notification
      await supabase.functions.invoke('send-telegram-notification', {
        body: {
          type: 'join_request',
          data: data
        }
      });
      
      toast.success('تم إرسال طلبك بنجاح! 🎉', {
        description: 'سيتواصل معك فريقنا خلال 24 ساعة لبدء رحلتك معنا.',
        duration: 5000,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        businessType: '',
        experience: '',
        expectedSales: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Error submitting join request:', error);
      toast.error('حدث خطأ في إرسال الطلب', {
        description: 'يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-procell-light/20 to-white">
      {/* Hero Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-r from-procell-primary to-procell-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-procell-accent rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Badge className="bg-white/20 text-white px-4 py-2 text-sm">
                برنامج شركاء النجاح
              </Badge>
              <Users className="h-6 w-6 animate-bounce" />
            </div>
            
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6">
              <span className="block mb-2">💰 انضم لشبكة</span>
              <span className="block text-procell-accent">شركاء النجاح</span>
              <span className="block text-white/90 text-lg md:text-xl mt-2">واربح حتى 15% عمولة</span>
            </h1>
            
            <p className="text-sm md:text-base lg:text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              ابدأ رحلتك في عالم التسويق بالعمولة مع ProCell واحصل على دخل إضافي ممتاز من خلال بيع أفضل الهواتف الذكية
            </p>

            {/* Quick Benefits - from DB stat_boxes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
              {statsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="h-6 bg-white/20 animate-pulse rounded mb-2" />
                    <div className="h-4 bg-white/10 animate-pulse rounded" />
                  </div>
                ))
              ) : (
                partnerStats.map((stat: any, index: number) => {
                  const IconComponent = iconMap[stat.icon] || Users;
                  const colorClass = stat.color || 'text-white';
                  return (
                    <div key={index} className="text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <div className={`text-2xl font-bold ${colorClass}`}>{stat.number}</div>
                      <div className="text-xs text-white/80 flex items-center gap-1 justify-center mt-1">
                        <IconComponent className={`h-4 w-4 ${colorClass}`} />
                        <span>{stat.label}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <Button 
              onClick={() => document.getElementById('partnership-form')?.scrollIntoView({ behavior: 'smooth' })}
              size="lg" 
              className="bg-gradient-to-r from-gradient-blue-start to-gradient-blue-end text-white hover:from-gradient-deep-start hover:to-gradient-blue-mid transform hover:scale-105 transition-all shadow-lg hover:shadow-xl px-8 py-4 font-semibold"
            >
              <ArrowRight className="h-5 w-5 mr-2" />
              ابدأ رحلتك الآن
              <Gift className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Partnership Benefits */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-procell-dark mb-4">
              🎯 لماذا تختار برنامج شركاء النجاح؟
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              انضم لأكثر من 500 شريك نجح في تحقيق دخل إضافي ممتاز معنا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {partnershipBenefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm overflow-hidden group">
                <CardContent className="p-6 md:p-8">
                  <div className={`mx-auto w-fit p-4 rounded-full bg-gradient-to-r ${benefit.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-procell-dark mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{benefit.description}</p>
                  <Badge className="bg-procell-secondary/10 text-procell-secondary">
                    {benefit.highlight}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Program Levels */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-procell-dark mb-4">
              📈 مستويات البرنامج والعمولات
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              كلما زادت مبيعاتك، زادت عمولتك. نظام عادل ومربح للجميع
            </p>
          </div>

          {commissionLevels.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              جاري التحميل...
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {commissionLevels.map((level: any, index) => (
                <Card key={level.id} className={`text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 overflow-hidden ${index === commissionLevels.length - 1 ? 'ring-2 ring-yellow-400 transform scale-105' : ''}`}>
                  <CardHeader className={`${level.color} text-white relative`}>
                    {index === commissionLevels.length - 1 && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-yellow-500 text-yellow-900 animate-bounce">
                          ⭐ الأكثر ربحاً
                        </Badge>
                      </div>
                    )}
                    <CardTitle className="text-xl font-bold">{level.category}</CardTitle>
                    <div className="text-3xl font-bold">{level.commission}</div>
                    <div className="text-sm opacity-90">عمولة</div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">المبيعات الشهرية</p>
                      <p className="font-semibold text-procell-dark">{level.calculation}</p>
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-3">
                      <h4 className="font-semibold text-procell-dark text-sm">المزايا المتاحة:</h4>
                      {level.examples.split('\n').map((benefit: string, idx: number) => (
                        benefit.trim() && (
                          <div key={idx} className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-procell-accent ml-2 shrink-0" />
                            <span>{benefit.trim()}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Success Stories */}
        <section className="mb-16">
          {partnerStories.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              جاري التحميل...
            </div>
          ) : (
            <PartnerStoriesCarousel stories={partnerStories as any} />
          )}
        </section>

        {/* Partnership Form */}
        <section id="partnership-form" className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-procell-dark mb-4">
                🚀 اطلب انضمامك للبرنامج الآن
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                املأ النموذج وسيتواصل معك فريقنا خلال 24 ساعة لبدء رحلة النجاح معاً
              </p>
            </div>

            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-procell-dark mb-2">
                        الاسم الكامل *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="اكتب اسمك الكامل"
                        className="border-procell-primary/20 focus:border-procell-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-procell-dark mb-2">
                        رقم الهاتف *
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+970 5X XXX XXXX"
                        className="border-procell-primary/20 focus:border-procell-primary direction-ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-procell-dark mb-2">
                      البريد الإلكتروني *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@email.com"
                      className="border-procell-primary/20 focus:border-procell-primary direction-ltr"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="businessType" className="block text-sm font-medium text-procell-dark mb-2">
                        نوع العمل/التخصص
                      </label>
                      <Select value={formData.businessType} onValueChange={(value) => setFormData(prev => ({ ...prev, businessType: value }))}>
                        <SelectTrigger className="border-procell-primary/20 focus:border-procell-primary">
                          <SelectValue placeholder="اختر نوع عملك" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retail">متجر تجزئة</SelectItem>
                          <SelectItem value="online">تجارة إلكترونية</SelectItem>
                          <SelectItem value="social">تسويق عبر وسائل التواصل</SelectItem>
                          <SelectItem value="individual">فرد/مستقل</SelectItem>
                          <SelectItem value="wholesale">تجارة جملة</SelectItem>
                          <SelectItem value="other">أخرى</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-procell-dark mb-2">
                        الخبرة في التسويق
                      </label>
                      <Select value={formData.experience} onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
                        <SelectTrigger className="border-procell-primary/20 focus:border-procell-primary">
                          <SelectValue placeholder="مستوى خبرتك" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">مبتدئ (أقل من سنة)</SelectItem>
                          <SelectItem value="intermediate">متوسط (1-3 سنوات)</SelectItem>
                          <SelectItem value="advanced">متقدم (3+ سنوات)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="expectedSales" className="block text-sm font-medium text-procell-dark mb-2">
                      المبيعات المتوقعة شهرياً
                    </label>
                    <Select value={formData.expectedSales} onValueChange={(value) => setFormData(prev => ({ ...prev, expectedSales: value }))}>
                      <SelectTrigger className="border-procell-primary/20 focus:border-procell-primary">
                        <SelectValue placeholder="كم تتوقع أن تبيع شهرياً؟" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5000">5,000 ₪ أو أقل</SelectItem>
                        <SelectItem value="15000">5,000 - 15,000 ₪</SelectItem>
                        <SelectItem value="30000">15,000 - 30,000 ₪</SelectItem>
                        <SelectItem value="50000">30,000 - 50,000 ₪</SelectItem>
                        <SelectItem value="50000+">أكثر من 50,000 ₪</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-procell-dark mb-2">
                      رسالة إضافية (اختيارية)
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="أخبرنا عن خططك أو أي استفسارات لديك..."
                      rows={4}
                      className="border-procell-primary/20 focus:border-procell-primary resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-procell-primary to-procell-secondary hover:from-procell-primary/90 hover:to-procell-secondary/90 text-white shadow-lg transform hover:scale-105 transition-all duration-200 py-4"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                        جاري المعالجة...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="h-5 w-5 ml-2" />
                        طلب الانضمام للبرنامج
                        <ArrowRight className="h-5 w-5 mr-2" />
                      </div>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    بإرسال هذا الطلب، أنت توافق على شروط وأحكام برنامج شركاء النجاح
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-procell-accent/10 to-procell-secondary/10 border-procell-accent/20">
            <CardContent className="p-6 md:p-8 text-center">
              <h3 className="text-xl md:text-2xl font-bold text-procell-dark mb-4 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-procell-accent ml-2" />
                💬 هل لديك أسئلة؟
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6">
                فريق دعم الشركاء متاح لمساعدتك في أي وقت
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-black border-2 border-black hover:bg-gray-50">
                  <Phone className="h-4 w-4 ml-2" />
                  اتصل بنا: +970 59 XXX XXXX
                </Button>
                <Button variant="outline" className="border-procell-secondary text-procell-secondary hover:bg-procell-secondary hover:text-white">
                  <Mail className="h-4 w-4 ml-2" />
                  partners@procell.app
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}