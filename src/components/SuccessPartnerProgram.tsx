import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PartnerStoriesCarousel } from './PartnerStoriesCarousel';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Award, 
  ExternalLink, 
  Mail, 
  MessageCircle,
  Target,
  Percent,
  Clock,
  CheckCircle,
  ArrowRight,
  Bell,
  Store,
  Smartphone,
  UserCheck,
  GraduationCap,
  Settings,
  BarChart3,
  Calendar,
  Shield,
  Gift,
  Zap,
  HeadphonesIcon,
  Star
} from 'lucide-react';

export function SuccessPartnerProgram() {
  // Fetch partner success stories from database
  const { data: successStories = [], isLoading: storiesLoading } = useQuery({
    queryKey: ['partner-success-stories-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_success_stories')
        .select('*')
        .eq('is_active', true as any)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching partner stories:', error);
        throw error;
      }
      console.log('✅ Partner stories loaded:', data?.length || 0);
      return data || [];
    },
  });

  // Fetch commission levels from database
  const { data: commissionStructure = [], isLoading: commissionsLoading } = useQuery({
    queryKey: ['commission-levels-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commission_levels')
        .select('*')
        .eq('is_active', true as any)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching commission levels:', error);
        throw error;
      }
      console.log('✅ Commission levels loaded:', data?.length || 0);
      return data || [];
    },
  });

  // Target categories based on the plan
  const targetCategories = [
    {
      icon: <Store className="h-6 w-6" />,
      title: 'أصحاب المحلات',
      description: 'أصحاب المحلات الصغيرة والمتوسطة في الضفة والداخل',
      highlight: 'محلات مرخصة'
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: 'فنيي الصيانة',
      description: 'فنيي الهواتف والصيانة المستقلة',
      highlight: 'خبرة تقنية'
    },
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: 'المؤثرين الرقميين',
      description: 'المؤثرين أو المسوقين الرقميين',
      highlight: 'شبكة واسعة'
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: 'الطلاب والشباب',
      description: 'الطلاب أو الشباب الباحثين عن دخل إضافي',
      highlight: 'مرونة في العمل'
    }
  ];

  // Tools and support provided
  const toolsAndSupport = [
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: 'صور إعلانية ومنشورات',
      description: 'مواد جاهزة لوسائل التواصل الاجتماعي'
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: 'فيديوهات قصيرة',
      description: 'Reels و TikToks مخصصة للمنتجات'
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: 'نماذج رسائل جاهزة',
      description: 'قوالب رسائل احترافية للزبائن'
    },
    {
      icon: <Settings className="h-5 w-5" />,
      title: 'دليل استخدام الرابط والكود',
      description: 'شرح مفصل لآلية التتبع'
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: 'تتبع الأداء',
      description: 'ملف Excel/لوحة تحكم (في المرحلة المتقدمة)'
    },
    {
      icon: <HeadphonesIcon className="h-5 w-5" />,
      title: 'دعم مخصص',
      description: 'فريق دعم مخصص للشركاء على مدار الساعة'
    }
  ];

  // Working mechanism steps
  const workingSteps = [
    {
      step: '1',
      title: 'التسجيل',
      description: 'تعبئة نموذج Google Form للاشتراك في البرنامج',
      details: 'البيانات ترسل تلقائياً للبريد الإلكتروني وقناة Telegram الداخلية'
    },
    {
      step: '2',
      title: 'تخصيص الأدوات',
      description: 'الحصول على رابط تتبع خاص وكود خصم',
      details: 'رابط تتبع فريد + كود خصم مثل: PC-ABUOMAR10'
    },
    {
      step: '3',
      title: 'البدء في التسويق',
      description: 'استخدام الأدوات المقدمة للترويج',
      details: 'مشاركة المنتجات عبر الشبكة والوسائل الاجتماعية'
    },
    {
      step: '4',
      title: 'تتبع وصرف الأرباح',
      description: 'متابعة العمولات واستلام الدفعات',
      details: 'تقارير شهرية ودفع في الأسبوع الأول من كل شهر'
    }
  ];

  // Fetch stat boxes from database
  const { data: stats = [], isLoading: statsLoading } = useQuery({
    queryKey: ['stat-boxes-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stat_boxes')
        .select('*')
        .eq('is_active', true as any)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching stat boxes:', error);
        throw error;
      }
      console.log('✅ Stat boxes loaded:', data?.length || 0);
      
      // Map the data to include icon components
      return (data || []).map((box: any) => ({
        number: box.number,
        label: box.label,
        icon: getIconComponent(box.icon, box.color)
      }));
    },
  });

  // Helper function to get icon component dynamically
  const getIconComponent = (iconName: string, color: string) => {
    const iconProps = { className: `h-5 w-5 ${color}` };
    const icons: Record<string, JSX.Element> = {
      'Users': <Users {...iconProps} />,
      'Percent': <Percent {...iconProps} />,
      'TrendingUp': <TrendingUp {...iconProps} />,
      'HeadphonesIcon': <HeadphonesIcon {...iconProps} />,
      'DollarSign': <DollarSign {...iconProps} />,
      'Target': <Target {...iconProps} />,
      'Clock': <Clock {...iconProps} />,
      'Star': <Star {...iconProps} />,
      'Award': <Award {...iconProps} />,
      'CheckCircle': <CheckCircle {...iconProps} />
    };
    return icons[iconName] || <Users {...iconProps} />;
  };

  const handleJoinProgram = () => {
    // Replace with your actual Google Form URL
    const googleFormUrl = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform';
    window.open(googleFormUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-procell-secondary/5 to-procell-accent/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12 md:mb-16">
          <Badge className="w-fit mx-auto bg-procell-secondary text-white px-4 py-2">
            <Users className="h-4 w-4 ml-2" />
            برنامج شركاء النجاح
          </Badge>
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-procell-dark">
            كن شريكاً في نجاح ProCell
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            ابدأ بتحقيق دخل من كل عملية بيع أو خدمة تتم عن طريقك! انضم لأكبر برنامج تسويق بالعمولة في فلسطين
          </p>
        </div>

        {/* Stats */}
        {statsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="text-center border-procell-primary/20">
                <CardContent className="p-4 md:p-6">
                  <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-procell-primary/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 md:p-6">
                  <div className="mx-auto w-fit mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-procell-primary mb-2">{stat.number}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Target Categories */}
        <div className="mb-16">
          <h3 className="text-xl md:text-2xl text-procell-dark text-center mb-8">
            الفئات المستهدفة للبرنامج
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {targetCategories.map((category, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-procell-primary/10">
                <CardContent className="p-6 space-y-4">
                  <div className="text-procell-primary mx-auto w-fit p-3 bg-procell-primary/10 rounded-full">
                    {category.icon}
                  </div>
                  <h4 className="text-procell-dark font-medium">{category.title}</h4>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                  <Badge variant="outline" className="border-procell-accent text-procell-accent text-xs">
                    {category.highlight}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Commission Structure */}
        {commissionsLoading ? (
          <div className="mb-16">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-procell-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">جاري تحميل مستويات العمولة...</p>
            </div>
          </div>
        ) : commissionStructure.length > 0 ? (
          <div className="mb-16">
            <h3 className="text-xl md:text-2xl text-procell-dark text-center mb-8">
              📈 مستويات البرنامج والعمولات
            </h3>
            <div className="grid gap-4 md:gap-6">
              {commissionStructure.map((item: any, index) => (
                <Card key={item.id || index} className="hover:shadow-lg transition-all duration-300 border-procell-primary/10">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 space-x-reverse">
                      <div className={`w-4 h-4 ${item.color} rounded-full shrink-0 mt-1`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                          <h4 className="text-procell-dark font-medium">{item.category}</h4>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-procell-secondary text-white">
                              {item.commission}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{item.calculation}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.examples}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-6">
              <Badge variant="outline" className="border-procell-accent text-procell-accent">
                <Gift className="h-4 w-4 ml-2" />
                حد أدنى للصرف: 100 شيكل
              </Badge>
            </div>
          </div>
        ) : (
          <div className="mb-16 text-center py-8">
            <p className="text-muted-foreground">لا توجد مستويات عمولة متاحة حالياً</p>
          </div>
        )}

        {/* Working Mechanism */}
        <div className="mb-16">
          <h3 className="text-xl md:text-2xl text-procell-dark text-center mb-8">
            آلية العمل خطوة بخطوة
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workingSteps.map((step, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-procell-primary/10">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-procell-primary text-white rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                    {step.step}
                  </div>
                  <h4 className="text-procell-dark font-medium">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  <p className="text-xs text-procell-primary">{step.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tools and Support */}
        <div className="mb-16">
          <h3 className="text-xl md:text-2xl text-procell-dark text-center mb-8">
            الأدوات والدعم المقدم للشركاء
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolsAndSupport.map((tool, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-procell-primary/10">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-procell-accent p-2 bg-procell-accent/10 rounded-lg">
                      {tool.icon}
                    </div>
                    <div>
                      <h4 className="text-procell-dark font-medium text-sm">{tool.title}</h4>
                      <p className="text-xs text-muted-foreground">{tool.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment and Reporting */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-procell-primary/20">
              <CardHeader>
                <CardTitle className="text-procell-dark flex items-center">
                  <Calendar className="h-5 w-5 ml-2 text-procell-primary" />
                  المتابعة والتقارير
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3 p-3 bg-procell-light/50 rounded-lg">
                    <BarChart3 className="h-4 w-4 text-procell-primary shrink-0" />
                    <span>تتبع شهري: عدد النقرات والمبيعات</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-procell-light/50 rounded-lg">
                    <DollarSign className="h-4 w-4 text-procell-primary shrink-0" />
                    <span>قيمة العمولة المستحقة</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-procell-light/50 rounded-lg">
                    <Mail className="h-4 w-4 text-procell-primary shrink-0" />
                    <span>تقرير شهري عبر الإيميل/الواتساب</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-procell-secondary/20">
              <CardHeader>
                <CardTitle className="text-procell-dark flex items-center">
                  <Clock className="h-5 w-5 ml-2 text-procell-secondary" />
                  مواعيد ووسائل الدفع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3 p-3 bg-procell-secondary/5 rounded-lg">
                    <Calendar className="h-4 w-4 text-procell-secondary shrink-0" />
                    <span>الدفع في الأسبوع الأول من كل شهر</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-procell-secondary/5 rounded-lg">
                    <Smartphone className="h-4 w-4 text-procell-secondary shrink-0" />
                    <span>محفظة Jawwal Pay</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-procell-secondary/5 rounded-lg">
                    <DollarSign className="h-4 w-4 text-procell-secondary shrink-0" />
                    <span>تحويل بنكي أو نقداً حسب الاتفاق</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mb-16">
          <Card className="border-procell-accent/20 bg-procell-accent/5">
            <CardHeader>
              <CardTitle className="text-procell-dark flex items-center">
                <Shield className="h-5 w-5 ml-2 text-procell-accent" />
                الشروط والأحكام
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-procell-accent shrink-0 mt-0.5" />
                    <span>ممنوع استخدام روابط مضللة أو إعلانات كاذبة</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-procell-accent shrink-0 mt-0.5" />
                    <span>ممنوع التلاعب بعمليات البيع أو التسجيلات</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-procell-accent shrink-0 mt-0.5" />
                    <span>العمولة تُحسب بعد إتمام البيع أو الخدمة فعلياً</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-procell-accent shrink-0 mt-0.5" />
                    <span>يمكن إنهاء المشاركة في حالة النشاط غير النزيه</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="relative overflow-hidden border-procell-primary/20 shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-procell-secondary/20 to-transparent rounded-bl-full"></div>
          <CardHeader className="text-center pb-4 relative z-10">
            <CardTitle className="text-xl md:text-2xl text-procell-dark">ابدأ رحلتك اليوم</CardTitle>
            <p className="text-muted-foreground">
              انضم لأكثر من 200 شريك نجاح وابدأ في تحقيق دخل إضافي فوراً
            </p>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            {/* Main CTA Button */}
            <Button 
              onClick={handleJoinProgram}
              className="w-full bg-gradient-to-r from-procell-primary to-procell-primary-light hover:from-procell-primary/90 hover:to-procell-primary-light/90 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
              size="lg"
            >
              <ExternalLink className="h-5 w-5 ml-2" />
              انضم لبرنامج شركاء النجاح
              <ArrowRight className="h-5 w-5 mr-2" />
            </Button>

            {/* Enhanced Submission Info */}
            <div className="bg-gradient-to-r from-procell-light to-white p-4 md:p-6 rounded-lg border border-procell-primary/10 space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <Bell className="h-5 w-5 text-procell-primary" />
                <p className="text-sm font-medium text-procell-dark">
                  معلومات التسجيل والمراجعة:
                </p>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center space-x-3 p-2 bg-white/50 rounded">
                  <Mail className="h-4 w-4 text-procell-primary shrink-0" />
                  <span>الطلبات ترسل مباشرة لبريدنا الإلكتروني للمراجعة السريعة</span>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-white/50 rounded">
                  <MessageCircle className="h-4 w-4 text-procell-primary shrink-0" />
                  <span>إشعارات فورية عبر قناة التليجرام الخاصة بإدارة الشركاء</span>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-white/50 rounded">
                  <CheckCircle className="h-4 w-4 text-procell-accent shrink-0" />
                  <span>نقوم بمراجعة الطلبات خلال 24 ساعة ويتم الرد عبر الإيميل أو الواتساب</span>
                </div>
              </div>
            </div>

            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-procell-primary/10">
              <div className="text-center p-3 bg-procell-secondary/5 rounded-lg">
                <div className="text-2xl font-bold text-procell-secondary">24h</div>
                <div className="text-xs text-muted-foreground">مراجعة الطلب</div>
              </div>
              <div className="text-center p-3 bg-procell-accent/5 rounded-lg">
                <div className="text-2xl font-bold text-procell-accent">100%</div>
                <div className="text-xs text-muted-foreground">مجاني</div>
              </div>
            </div>

            {/* Additional Benefits */}
            <div className="space-y-2 text-xs text-center text-muted-foreground">
              <p className="font-medium">✓ لا توجد رسوم اشتراك أو التزامات مالية</p>
              <p>✓ مواد تسويقية مجانية وتدريب شامل</p>
              <p>✓ دعم مخصص لشركاء النجاح على مدار الساعة</p>
            </div>

            {/* Contact for Questions */}
            <div className="text-center pt-4 border-t border-procell-primary/10">
              <p className="text-xs text-muted-foreground mb-2">
                لديك أسئلة حول البرنامج؟
              </p>
              <Button variant="ghost" size="sm" className="text-procell-primary hover:text-procell-primary/80">
                <MessageCircle className="h-4 w-4 ml-1" />
                تواصل معنا عبر التليجرام
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Success Stories Preview */}
        {storiesLoading ? (
          <div className="mt-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-procell-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">جاري تحميل قصص النجاح...</p>
          </div>
        ) : successStories.length > 0 ? (
          <PartnerStoriesCarousel stories={successStories as any} />
        ) : (
          <div className="mt-16 text-center py-8">
            <p className="text-muted-foreground">لا توجد قصص نجاح متاحة حالياً</p>
          </div>
        )}
      </div>
    </section>
  );
}