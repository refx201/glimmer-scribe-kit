import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { 
  Shield, 
  RotateCcw, 
  Truck, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Award,
  HeartHandshake,
  PhoneCall,
  MapPin
} from 'lucide-react';

export function WarrantyPolicies() {
  const [openSections, setOpenSections] = useState<string[]>(['warranty']);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const warrantyFeatures = [
    {
      icon: <Shield className="h-5 w-5 text-procell-primary" />,
      title: "ضمان رسمي شامل",
      description: "جميع الأجهزة مرفقة بضمان رسمي معتمد من الوكلاء",
      period: "سنتين"
    },
    {
      icon: <RotateCcw className="h-5 w-5 text-procell-secondary" />,
      title: "استبدال فوري",
      description: "ضمان استبدال خلال 14 يومًا في حال وجود عيب مصنعي",
      period: "14 يوم"
    },
    {
      icon: <Award className="h-5 w-5 text-procell-accent" />,
      title: "صيانة معتمدة",
      description: "خدمة صيانة عبر وكلاء معتمدين في جميع المدن",
      period: "مدى الحياة"
    },
    {
      icon: <HeartHandshake className="h-5 w-5 text-purple-600" />,
      title: "دعم ما بعد البيع",
      description: "فريق دعم متخصص لحل جميع المشاكل والاستفسارات",
      period: "24/7"
    }
  ];

  const deliveryPolicies = [
    {
      icon: <Truck className="h-5 w-5 text-procell-secondary" />,
      title: "توصيل سريع",
      description: "توصيل خلال 24-48 ساعة لجميع مدن الضفة الغربية"
    },
    {
      icon: <MapPin className="h-5 w-5 text-procell-accent" />,
      title: "تغطية شاملة",
      description: "نصل إلى جميع المدن والقرى في فلسطين"
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      title: "توصيل مجاني",
      description: "خدمة التوصيل مجانية للطلبات أكثر من 200 شيكل"
    }
  ];

  const returnPolicy = [
    {
      title: "إرجاع خلال 14 يوم",
      description: "يمكنك إرجاع المنتج خلال 14 يوم من تاريخ الاستلام",
      icon: <Clock className="h-5 w-5 text-blue-600" />
    },
    {
      title: "فحص مجاني",
      description: "نقوم بفحص المنتج مجاناً قبل قبول الإرجاع",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />
    },
    {
      title: "استرداد كامل",
      description: "استرداد كامل للمبلغ في حالة العيب المصنعي",
      icon: <Shield className="h-5 w-5 text-procell-primary" />
    }
  ];

  const faqItems = [
    {
      question: "هل الأجهزة أصلية؟",
      answer: "نعم، جميع الأجهزة أصلية ومستوردة من الوكلاء المعتمدين مع ضمان رسمي. نحن نضمن أصالة كل منتج نبيعه."
    },
    {
      question: "هل يوجد توصيل لجميع المناطق؟",
      answer: "نعم، نوفر خدمة التوصيل السريع إلى جميع مدن وقرى الضفة الغربية خلال 24-48 ساعة. التوصيل مجاني للطلبات أكثر من 200 شيكل."
    },
    {
      question: "كيف يعمل التقسيط؟",
      answer: "نوفر خدمة التقسيط المريح بدون فوائد لفترات تصل إلى 12 شهر. يمكنك التقديم عبر التطبيق أو الاتصال بنا مباشرة."
    },
    {
      question: "ماذا لو كان هناك عيب في الجهاز؟",
      answer: "في حالة وجود عيب مصنعي، نوفر استبدال فوري خلال 14 يوم أو إصلاح مجاني عبر مراكز الصيانة المعتمدة."
    }
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-procell-dark mb-3 sm:mb-4">
            🛡️ <span className="text-procell-primary">ضماناتنا وسياساتنا</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            نحن نؤمن بأهمية ثقة عملائنا، لذلك نوفر أفضل الضمانات والسياسات الواضحة
          </p>
        </div>

        {/* Warranty Section */}
        <div className="mb-8 sm:mb-12">
          <Collapsible open={openSections.includes('warranty')} onOpenChange={() => toggleSection('warranty')}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full p-0 h-auto justify-between hover:bg-transparent group">
                <div className="flex items-center space-x-3 text-left">
                  <div className="p-2 bg-procell-primary/10 rounded-full">
                    <Shield className="h-6 w-6 text-procell-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-procell-dark">ضمانات المنتجات</h3>
                    <p className="text-sm text-muted-foreground">تفاصيل شاملة حول الضمان والحماية</p>
                  </div>
                </div>
                {openSections.includes('warranty') ? 
                  <ChevronUp className="h-5 w-5 text-procell-primary group-hover:scale-110 transition-transform" /> : 
                  <ChevronDown className="h-5 w-5 text-procell-primary group-hover:scale-110 transition-transform" />
                }
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {warrantyFeatures.map((feature, index) => (
                  <Card key={index} className="border-procell-primary/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="p-2 bg-gray-50 rounded-full shrink-0">
                          {feature.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-procell-dark text-sm sm:text-base">{feature.title}</h4>
                            <Badge className="bg-procell-primary/10 text-procell-primary text-xs">
                              {feature.period}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Delivery Policies */}
        <div className="mb-8 sm:mb-12">
          <Collapsible open={openSections.includes('delivery')} onOpenChange={() => toggleSection('delivery')}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full p-0 h-auto justify-between hover:bg-transparent group">
                <div className="flex items-center space-x-3 text-left">
                  <div className="p-2 bg-procell-secondary/10 rounded-full">
                    <Truck className="h-6 w-6 text-procell-secondary" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-procell-dark">سياسة التوصيل</h3>
                    <p className="text-sm text-muted-foreground">معلومات مفصلة حول التوصيل والشحن</p>
                  </div>
                </div>
                {openSections.includes('delivery') ? 
                  <ChevronUp className="h-5 w-5 text-procell-secondary group-hover:scale-110 transition-transform" /> : 
                  <ChevronDown className="h-5 w-5 text-procell-secondary group-hover:scale-110 transition-transform" />
                }
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {deliveryPolicies.map((policy, index) => (
                  <Card key={index} className="border-procell-secondary/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <div className="mx-auto w-fit p-3 bg-gray-50 rounded-full mb-3">
                        {policy.icon}
                      </div>
                      <h4 className="font-semibold text-procell-dark mb-2 text-sm sm:text-base">{policy.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">{policy.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Return Policy */}
        <div className="mb-8 sm:mb-12">
          <Collapsible open={openSections.includes('return')} onOpenChange={() => toggleSection('return')}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full p-0 h-auto justify-between hover:bg-transparent group">
                <div className="flex items-center space-x-3 text-left">
                  <div className="p-2 bg-procell-accent/10 rounded-full">
                    <RotateCcw className="h-6 w-6 text-procell-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-procell-dark">سياسة الإرجاع</h3>
                    <p className="text-sm text-muted-foreground">كيفية إرجاع المنتجات واستحقاق الاستبدال</p>
                  </div>
                </div>
                {openSections.includes('return') ? 
                  <ChevronUp className="h-5 w-5 text-procell-accent group-hover:scale-110 transition-transform" /> : 
                  <ChevronDown className="h-5 w-5 text-procell-accent group-hover:scale-110 transition-transform" />
                }
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
                {returnPolicy.map((policy, index) => (
                  <Card key={index} className="border-procell-accent/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <div className="mx-auto w-fit p-3 bg-gray-50 rounded-full mb-3">
                        {policy.icon}
                      </div>
                      <h4 className="font-semibold text-procell-dark mb-2 text-sm sm:text-base">{policy.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">{policy.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">شروط الإرجاع</h4>
                    <p className="text-sm text-yellow-700">
                      يجب أن يكون المنتج في حالته الأصلية مع العلبة وجميع الملحقات. 
                      لا يُقبل الإرجاع للمنتجات المستعملة أو التالفة بسبب سوء الاستخدام.
                    </p>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* FAQ Section */}
        <div>
          <Collapsible open={openSections.includes('faq')} onOpenChange={() => toggleSection('faq')}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full p-0 h-auto justify-between hover:bg-transparent group">
                <div className="flex items-center space-x-3 text-left">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <AlertCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-procell-dark">الأسئلة الشائعة</h3>
                    <p className="text-sm text-muted-foreground">إجابات على أكثر الأسئلة شيوعاً</p>
                  </div>
                </div>
                {openSections.includes('faq') ? 
                  <ChevronUp className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" /> : 
                  <ChevronDown className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
                }
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-6">
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <Card key={index} className="border-purple-200/50 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 sm:p-6">
                      <h4 className="font-semibold text-procell-dark mb-2 text-sm sm:text-base flex items-center">
                        <CheckCircle className="h-4 w-4 text-procell-accent ml-2 shrink-0" />
                        {item.question}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground pl-6">{item.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-6">
                <Button className="bg-procell-primary hover:bg-procell-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <PhoneCall className="h-4 w-4 ml-2" />
                  تواصل معنا لأسئلة أخرى
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </section>
  );
}