import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Star, 
  Users, 
  Award, 
  Target, 
  Heart, 
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Handshake,
  Shield,
  TrendingUp,
  Building,
  Truck,
  Headphones,
  Verified,
  Crown,
  Eye,
  Lightbulb,
  Rocket,
  Zap
} from 'lucide-react';

export function AboutPage() {
  const [activeTab, setActiveTab] = useState<'story' | 'partners'>('story');

  // Fetch suppliers from database
  const { data: suppliers = [], isLoading: suppliersLoading } = useQuery({
    queryKey: ['suppliers-about'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('is_active', true as any)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  // Company Journey Data - Without specific years
  const journeyMilestones = [
    {
      phase: 'المرحلة الأولى',
      title: 'البداية والرؤية',
      description: 'انطلقت فكرة ProCell برؤية توفير أفضل الهواتف الذكية بجودة عالية وأسعار منافسة في فلسطين',
      icon: <Lightbulb className="h-5 w-5" />,
      color: 'bg-blue-500',
      achievements: ['وضع الأسس', 'تحديد الرؤية', 'بناء الفريق الأساسي']
    },
    {
      phase: 'المرحلة الثانية',
      title: 'إرساء الأسس',
      description: 'بناء الثقة مع العملاء وإنشاء شبكة من الشراكات الموثوقة مع الموردين المحليين والعالميين',
      icon: <Building className="h-5 w-5" />,
      color: 'bg-green-500',
      achievements: ['افتتاح المتجر الأول', 'بناء قاعدة عملاء', 'تطوير الخدمات']
    },
    {
      phase: 'المرحلة الثالثة',
      title: 'التوسع والنمو',
      description: 'توسيع نطاق الخدمات والوصول إلى جميع المحافظات الفلسطينية مع إطلاق المنصة الرقمية',
      icon: <Globe className="h-5 w-5" />,
      color: 'bg-purple-500',
      achievements: ['المنصة الرقمية', 'خدمة التوصيل', 'تغطية شاملة']
    },
    {
      phase: 'المرحلة الرابعة',
      title: 'بناء الشراكات',
      description: 'تطوير شبكة قوية من الشراكات الاستراتيجية وإطلاق برنامج شركاء النجاح المبتكر',
      icon: <Handshake className="h-5 w-5" />,
      color: 'bg-orange-500',
      achievements: ['برنامج الشراكة', 'شبكة الموزعين', 'تعاون استراتيجي']
    },
    {
      phase: 'المرحلة الخامسة',
      title: 'الريادة والتميز',
      description: 'تحقيق مكانة الريادة في السوق الفلسطيني وحصول على ثقة آلاف العملاء المخلصين',
      icon: <Crown className="h-5 w-5" />,
      color: 'bg-yellow-500',
      achievements: ['مكانة رائدة', 'ثقة العملاء', 'جودة مميزة']
    },
    {
      phase: 'المرحلة الحالية',
      title: 'الابتكار المستمر',
      description: 'مواصلة التطوير وإضافة خدمات جديدة مثل الصيانة والاستبدال الذكي لتلبية احتياجات العملاء المتنوعة',
      icon: <Rocket className="h-5 w-5" />,
      color: 'bg-red-500',
      achievements: ['خدمات متطورة', 'حلول ذكية', 'نمو مستدام']
    }
  ];

  // Company Values
  const companyValues = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'الشغف',
      description: 'نحن متحمسون لتقديم أفضل التقنيات للعملاء الفلسطينيين',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'الثقة',
      description: 'نبني علاقات طويلة الأمد مع عملائنا على أساس الثقة والشفافية',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: 'التميز',
      description: 'نسعى للتميز في كل ما نقدمه من منتجات وخدمات',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'النمو',
      description: 'نؤمن بالنمو المستمر والتطوير لخدمة عملائنا بشكل أفضل',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  // Statistics
  const stats = [
    {
      icon: <Users className="h-6 w-6" />,
      number: '50,000+',
      label: 'عميل سعيد',
      color: 'text-blue-500'
    },
    {
      icon: <Award className="h-6 w-6" />,
      number: '6',
      label: 'سنوات خبرة',
      color: 'text-green-500'
    },
    {
      icon: <Star className="h-6 w-6" />,
      number: '4.9',
      label: 'تقييم العملاء',
      color: 'text-yellow-500'
    },
    {
      icon: <CheckCircle2 className="h-6 w-6" />,
      number: '99%',
      label: 'رضا العملاء',
      color: 'text-emerald-500'
    }
  ];

  // Team Mission
  const missionPoints = [
    'توفير أحدث وأفضل الهواتف الذكية بأسعار تنافسية',
    'تقديم خدمة عملاء متميزة تتجاوز التوقعات',
    'ضمان جودة المنتجات والخدمات المقدمة',
    'دعم الاقتصاد المحلي والتنمية المستدامة في فلسطين',
    'بناء شراكات قوية مع الموردين العالميين',
    'الابتكار المستمر في الخدمات والحلول التقنية'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-procell-primary via-procell-primary to-procell-secondary text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-300 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center">
            {/* Company Badge */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
              <Building className="h-4 w-4 ml-1" />
              procell
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              من نحن
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
              قصة نجاح فلسطينية في عالم التكنولوجيا، نبني جسور الثقة مع عملائنا منذ 2018
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`mx-auto w-12 h-12 ${stat.color} bg-white/10 rounded-full flex items-center justify-center mb-3`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold mb-1">{stat.number}</div>
                  <div className="text-blue-100 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-16 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-center py-4">
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('story')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'story'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Eye className="h-4 w-4" />
                قصة ProCell
              </button>
              <button
                onClick={() => setActiveTab('partners')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'partners'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Handshake className="h-4 w-4" />
                الموردين والوكلاء
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Story Tab Content */}
      {activeTab === 'story' && (
        <>
          {/* Company Mission */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="text-center mb-12">
                <Badge className="bg-blue-100 text-blue-700 mb-4">
                  <Target className="h-3 w-3 ml-1" />
                  رسالتنا
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  نحو مستقبل تقني أفضل لفلسطين
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  نؤمن في ProCell بأن التكنولوجيا هي مفتاح التقدم، ونسعى لتوفير أفضل الحلول التقنية للشعب الفلسطيني بجودة عالية وأسعار منافسة
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {missionPoints.map((point, index) => (
                  <Card key={index} className="bg-gradient-to-br from-blue-50 to-white border-blue-100 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </div>
                        <p className="text-gray-700 leading-relaxed">{point}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Company Values */}
          <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="text-center mb-12">
                <Badge className="bg-green-100 text-green-700 mb-4">
                  <Heart className="h-3 w-3 ml-1" />
                  قيمنا
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  القيم التي تحركنا
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  هذه هي المبادئ الأساسية التي توجه عملنا وتشكل هويتنا كشركة
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {companyValues.map((value, index) => (
                  <Card key={index} className={`${value.bgColor} border-0 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}>
                    <CardContent className="p-8">
                      <div className={`mx-auto w-16 h-16 bg-white ${value.color} rounded-full flex items-center justify-center mb-6 shadow-lg`}>
                        {value.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Journey Timeline */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="text-center mb-12">
                <Badge className="bg-purple-100 text-purple-700 mb-4">
                  <Rocket className="h-3 w-3 ml-1" />
                  مسيرتنا
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  رحلة النجاح والتطور
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  مراحل نموّنا وتطورنا من فكرة بسيطة إلى شركة رائدة في السوق الفلسطيني
                </p>
              </div>

              <div className="max-w-5xl mx-auto">
                <div className="relative">
                  {/* Journey Line */}
                  <div className="absolute right-4 md:right-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-purple-400 via-green-400 via-orange-400 via-yellow-400 to-red-400 rounded-full shadow-sm"></div>

                  {journeyMilestones.map((milestone, index) => (
                    <div key={index} className={`relative flex items-center mb-16 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      {/* Journey Milestone Icon */}
                      <div className={`absolute right-1.5 md:right-1/2 md:transform md:-translate-x-1/2 w-10 h-10 ${milestone.color} rounded-full flex items-center justify-center text-white shadow-xl z-10 border-4 border-white`}>
                        {milestone.icon}
                      </div>

                      {/* Content Card */}
                      <div className={`w-full md:w-5/12 mr-16 md:mr-0 ${index % 2 === 0 ? 'md:ml-12' : 'md:mr-12'}`}>
                        <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <Badge className={`${milestone.color} text-white font-medium px-3 py-1.5 text-sm`}>
                                {milestone.phase}
                              </Badge>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">{milestone.description}</p>
                            
                            {/* Achievements */}
                            <div className="border-t border-gray-100 pt-4">
                              <div className="text-sm text-gray-500 mb-2 font-medium">الإنجازات الرئيسية:</div>
                              <div className="flex flex-wrap gap-2">
                                {milestone.achievements.map((achievement, achIndex) => (
                                  <span key={achIndex} className="inline-flex items-center bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs">
                                    <CheckCircle2 className="h-3 w-3 ml-1 text-green-500" />
                                    {achievement}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Card */}
              <div className="max-w-3xl mx-auto mt-12">
                <Card className="bg-gradient-to-br from-procell-primary to-procell-secondary text-white border-0 shadow-2xl">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">استمرار المسيرة</h3>
                    <p className="text-blue-100 leading-relaxed text-lg">
                      نواصل رحلتنا في تقديم أفضل الخدمات والمنتجات، مع التركيز على الابتكار والجودة 
                      لخدمة عملائنا الكرام في جميع أنحاء فلسطين
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-4 text-sm text-blue-200">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>50,000+ عميل</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        <span>6 سنوات خبرة</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>تقييم 4.9</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Suppliers Tab Content */}
      {activeTab === 'partners' && (
        <>
          {/* Suppliers Header */}
          <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="text-center mb-12">
                <Badge className="bg-blue-100 text-blue-700 mb-4">
                  <Handshake className="h-3 w-3 ml-1" />
                  شبكة الموردين
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  موردونا الموثوقون
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  نتعاون مع أكبر الموردين والوكلاء المعتمدين للعلامات التجارية العالمية لضمان توفير أفضل المنتجات وأحدث التقنيات بأسعار تنافسية لعملائنا
                </p>
              </div>

              {/* Supply Chain Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[
                  { icon: <Verified className="h-6 w-6" />, title: 'ضمان الأصالة', desc: 'نشتري من الوكلاء المعتمدين فقط لضمان أصالة المنتجات', color: 'text-green-500' },
                  { icon: <Zap className="h-6 w-6" />, title: 'أحدث المنتجات', desc: 'نحصل على أحدث الموديلات من موردينا', color: 'text-blue-500' },
                  { icon: <Truck className="h-6 w-6" />, title: 'أسعار الجملة', desc: 'نشتري بكميات كبيرة للحصول على أفضل الأسعار', color: 'text-purple-500' },
                  { icon: <Headphones className="h-6 w-6" />, title: 'دعم الموردين', desc: 'دعم مستمر من موردينا المعتمدين', color: 'text-orange-500' }
                ].map((benefit, index) => (
                  <Card key={index} className="text-center bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className={`mx-auto w-12 h-12 ${benefit.color} bg-gray-50 rounded-full flex items-center justify-center mb-4`}>
                        {benefit.icon}
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">{benefit.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Dynamic Suppliers Display */}
          {suppliersLoading ? (
            <section className="py-12">
              <div className="container mx-auto px-4 text-center">
                جاري تحميل الموردين...
              </div>
            </section>
          ) : suppliers.length === 0 ? (
            <section className="py-12">
              <div className="container mx-auto px-4 text-center text-muted-foreground">
                لا توجد موردين حالياً
              </div>
            </section>
          ) : (
            <>
              {suppliers.map((supplier: any, index) => {
                const brands = Array.isArray(supplier.brands) ? supplier.brands as string[] : [];
                const bgColors = [
                  'from-purple-50 to-indigo-50',
                  'from-orange-50 to-red-50',
                  'from-teal-50 to-cyan-50',
                  'from-blue-50 to-sky-50',
                  'from-green-50 to-emerald-50',
                ];
                const borderColors = [
                  'border-purple-200',
                  'border-orange-200',
                  'border-teal-200',
                  'border-blue-200',
                  'border-green-200',
                ];

                return (
                  <section
                    key={supplier.id}
                    className={`py-12 bg-gradient-to-br ${bgColors[index % bgColors.length]}`}
                  >
                    <div className="container mx-auto px-4 sm:px-6">
                      <div className="text-center mb-8">
                        <Badge className="bg-primary/10 text-primary mb-4">
                          <Building className="h-3 w-3 ml-1" />
                          {supplier.category}
                        </Badge>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                          {supplier.logo_url ? (
                            <img
                              src={supplier.logo_url}
                              alt={supplier.name}
                              className="inline-block h-8 w-auto mr-2"
                            />
                          ) : (
                            '🏢 '
                          )}
                          {supplier.name}
                          {supplier.name_en && ` - ${supplier.name_en}`}
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                          {supplier.description}
                        </p>
                      </div>

                      {brands.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                          {brands.map((brand: any, brandIndex: number) => {
                            const brandName = typeof brand === 'string' ? brand : (brand?.name || '');
                            const brandLogo = typeof brand === 'object' && brand ? brand.logo_url : undefined;
                            
                            return (
                              <Card
                                key={`${brandName}-${brandIndex}`}
                                className={`bg-white border-2 ${borderColors[index % borderColors.length]} shadow-lg hover:shadow-xl transition-all duration-300`}
                              >
                                <CardContent className="p-4 text-center">
                                  <div
                                    className={`w-12 h-12 ${supplier.logo_color} rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-xs overflow-hidden`}
                                  >
                                    {brandLogo ? (
                                      <img 
                                        src={brandLogo} 
                                        alt={brandName}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      brandName.substring(0, 6)
                                    )}
                                  </div>
                                  <h3 className="font-bold text-sm text-gray-900 mb-1">{brandName}</h3>
                                  <p className="text-gray-600 text-xs">
                                    نشتري من {supplier.name}
                                  </p>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
            </>
          )}
        </>
      )}
    </div>
  );
}