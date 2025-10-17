import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { 
  HelpCircle,
  MessageSquare,
  Phone,
  Shield,
  Truck,
  CreditCard,
  Users,
  ArrowLeftRight,
  Settings,
  Search,
  Filter,
  Star,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Info,
  Heart,
  Zap,
  Gift,
  Building,
  Wallet,
  Package,
  RefreshCw
} from 'lucide-react';

export function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // FAQ Categories
  const categories = [
    { id: 'all', name: 'جميع الأسئلة', icon: HelpCircle, color: 'bg-blue-100 text-blue-700' },
    { id: 'general', name: 'خدمات عامة', icon: Info, color: 'bg-gray-100 text-gray-700' },
    { id: 'partnership', name: 'برنامج الشراكة', icon: Users, color: 'bg-purple-100 text-purple-700' },
    { id: 'trade-in', name: 'استبدال الهواتف', icon: ArrowLeftRight, color: 'bg-green-100 text-green-700' },
    { id: 'purchase', name: 'خدمة الشراء', icon: Wallet, color: 'bg-orange-100 text-orange-700' },
    { id: 'maintenance', name: 'الصيانة', icon: Settings, color: 'bg-red-100 text-red-700' },
    { id: 'shipping', name: 'الشحن والضمان', icon: Truck, color: 'bg-teal-100 text-teal-700' },
    { id: 'payment', name: 'طرق الدفع', icon: CreditCard, color: 'bg-indigo-100 text-indigo-700' }
  ];

  // FAQ Data
  const faqData = [
    // General Services
    {
      id: 1,
      category: 'general',
      question: 'ما هي خدمات ProCell الأساسية؟',
      answer: 'ProCell هي منصة شاملة للتجارة الإلكترونية في مجال الهواتف المحمولة تقدم: بيع أحدث الهواتف الذكية، حزم الإكسسوارات المتكاملة، خدمات الصيانة المتخصصة، برنامج استبدال الهواتف القديمة، وبرنامج شراكة النجاح للتسويق بالعمولة.',
      popular: true
    },
    {
      id: 2,
      category: 'general',
      question: 'في أي مناطق تقدم ProCell خدماتها؟',
      answer: 'نقدم خدماتنا في جميع أنحاء فلسطين مع التركيز على الضفة الغربية وقطاع غزة. نوفر توصيل سريع خلال 24-48 ساعة لمعظم المناطق، مع إمكانية التوصيل السريع خلال نفس اليوم في المدن الرئيسية.'
    },
    {
      id: 3,
      category: 'general',
      question: 'كيف يمكنني التواصل مع فريق الدعم؟',
      answer: 'يمكنك التواصل معنا عبر: الهاتف على الرقم 972-598-366-822، واتساب على نفس الرقم، البريد الإلكتروني، أو عبر نموذج التواصل في الموقع. فريق الدعم متاح 24/7 لمساعدتك.'
    },

    // Partnership Program
    {
      id: 4,
      category: 'partnership',
      question: 'ما هو برنامج شراكة النجاح وكيف يمكنني الانضمام؟',
      answer: 'برنامج شراكة النجاح هو نظام تسويق بالعمولة يتيح لك ربح عمولة تصل إلى 15% على كل عملية بيع تتم من خلالك. للانضمام، املأ نموذج الطلب في صفحة الشراكة وستتم مراجعة طلبك خلال 24 ساعة.',
      popular: true
    },
    {
      id: 5,
      category: 'partnership',
      question: 'كم تبلغ العمولة في برنامج الشراكة؟',
      answer: 'تتراوح العمولة من 5% إلى 15% حسب نوع المنتج وحجم المبيعات الشهرية. الهواتف الذكية: 8-12%، الإكسسوارات: 10-15%، الحزم المتكاملة: 12-15%. كلما زادت مبيعاتك، ارتفعت نسبة العمولة.'
    },
    {
      id: 6,
      category: 'partnership',
      question: 'متى وكيف أستلم أرباحي من البرنامج؟',
      answer: 'يتم احتساب الأرباح شهرياً وتحويلها في الأسبوع الأول من كل شهر. يمكن استلام الأرباح عبر التحويل البنكي، المحافظ الإلكترونية، أو الاستلام النقدي من فروعنا. الحد الأدنى للسحب هو 100 شيكل.'
    },

    // Trade-in
    {
      id: 7,
      category: 'trade-in',
      question: 'كيف يعمل برنامج استبدال الهواتف القديمة؟',
      answer: 'ببساطة! أرسل لنا صور ومعلومات هاتفك القديم عبر النموذج المخصص، نقدم لك تقييماً فورياً للسعر، إذا وافقت على السعر نأتي لاستلام الجهاز وندفع لك المبلغ فوراً. يمكنك استخدام المبلغ لشراء هاتف جديد أو استلامه نقداً.',
      popular: true
    },
    {
      id: 8,
      category: 'trade-in',
      question: 'ما هي أنواع الهواتف المقبولة في برنامج الاستبدال؟',
      answer: 'نقبل جميع أنواع الهواتف الذكية: iPhone (جميع الموديلات من iPhone 6 وما بعد)، Samsung Galaxy، Huawei، Xiaomi، OPPO، REALME، وجميع العلامات التجارية الأخرى. حتى الهواتف التالفة أو التي لا تعمل يمكن تقييمها.'
    },
    {
      id: 9,
      category: 'trade-in',
      question: 'كم يستغرق تقييم الهاتف القديم؟',
      answer: 'التقييم الأولي يتم خلال 30 دقيقة من إرسال البيانات والصور. التقييم النهائي يتم عند فحص الجهاز فعلياً من قبل فنيينا المختصين، ويستغرق 15-30 دقيقة. إذا كان التقييم النهائي مختلفاً عن الأولي، لك حق رفض البيع.'
    },

    // Purchase Service
    {
      id: 10,
      category: 'purchase',
      question: 'ما هي خدمة الشراء من ProCell؟',
      answer: 'خدمة الشراء تتيح لك بيع هاتفك المستعمل لنا مباشرة بأفضل الأسعار في السوق. نشتري جميع أنواع الهواتف حتى لو كانت تالفة أو لا تعمل. نوفر تقييماً عادلاً ودفعاً فورياً.',
      popular: true
    },
    {
      id: 11,
      category: 'purchase',
      question: 'هل تشترون الهواتف التالفة أو المكسورة؟',
      answer: 'نعم! نشتري الهواتف في جميع الحالات: التالفة، المكسورة، التي لا تعمل، أو حتى المبللة. سعر الشراء يعتمد على نوع الجهاز ومدى الضرر. حتى الهواتف الأقدم لها قيمة لدينا.'
    },
    {
      id: 12,
      category: 'purchase',
      question: 'كيف تحددون سعر شراء الهاتف؟',
      answer: 'نعتمد على عوامل متعددة: نوع وموديل الجهاز، السنة، حالة الشاشة والبطارية، وجود الإكسسوارات الأصلية، حالة الجهاز الخارجية، وأسعار السوق الحالية. نضمن أسعاراً عادلة وتنافسية.'
    },

    // Maintenance
    {
      id: 13,
      category: 'maintenance',
      question: 'ما هي خدمات الصيانة المتوفرة؟',
      answer: 'نوفر خدمات صيانة شاملة: إصلاح الشاشات، استبدال البطاريات، إصلاح مشاكل الشحن، استعادة البيانات، إصلاح مشاكل البرمجيات، تنظيف الأجهزة من الغبار والرطوبة، وصيانة وقائية شاملة.'
    },
    {
      id: 14,
      category: 'maintenance',
      question: 'كم تستغرق خدمات الصيانة؟',
      answer: 'أغلب الإصلاحات البسيطة (الشاشة، البطارية) تستغرق 2-4 ساعات. الإصلاحات المعقدة قد تستغرق 1-3 أيام. الصيانة الوقائية تستغرق ساعة واحدة. نوفر خدمة التشخيص المجاني خلال 30 دقيقة.'
    },
    {
      id: 15,
      category: 'maintenance',
      question: 'هل تقدمون ضماناً على خدمات الصيانة؟',
      answer: 'نعم! نوفر ضماناً لمدة 6 أشهر على جميع خدمات الصيانة والقطع المستبدلة. إذا حدثت نفس المشكلة خلال فترة الضمان، نصلحها مجاناً. ضماننا يشمل العمالة والقطع.'
    },

    // Shipping & Warranty
    {
      id: 16,
      category: 'shipping',
      question: 'ما هي أوقات التوصيل المتاحة؟',
      answer: 'التوصيل العادي: 24-48 ساعة، التوصيل السريع: نفس اليوم في المدن الرئيسية، التوصيل المجدول: يمكنك اختيار موعد محدد. أوقات التوصيل من 9 صباحاً حتى 8 مساءً، 6 أيام في الأسبوع.',
      popular: true
    },
    {
      id: 17,
      category: 'shipping',
      question: 'ما هي تكلفة الشحن؟',
      answer: 'الشحن مجاني للطلبات فوق 500 شيكل داخل المدن الرئيسية. تكلفة الشحن العادي 25 شيكل، الشحن السريع 45 شيكل. للمناطق النائية قد تكون هناك رسوم إضافية 10-20 شيكل.'
    },
    {
      id: 18,
      category: 'shipping',
      question: 'ما هي سياسة الضمان والإرجاع؟',
      answer: 'ضمان لمدة سنة كاملة على جميع الهواتف الجديدة. إمكانية إرجاع أو استبدال المنتج خلال 14 يوم من الشراء في حالة عدم الرضا. الإرجاع مجاني إذا كان المنتج معيباً، ورسوم بسيطة للإرجاع الاختياري.'
    },

    // Payment
    {
      id: 19,
      category: 'payment',
      question: 'ما هي طرق الدفع المتاحة؟',
      answer: 'نقبل جميع طرق الدفع: فيزا وماستركارد، PALPAY، التحويل البنكي، الدفع عند الاستلام، وأقساط مريحة تصل إلى 12 شهر بدون فوائد للمشتريات فوق 1000 شيكل.',
      popular: true
    },
    {
      id: 20,
      category: 'payment',
      question: 'هل يمكنني الدفع بالأقساط؟',
      answer: 'نعم! نوفر خطط دفع مرنة: 3 أقساط بدون فوائد، 6 أقساط بفائدة منخفضة، 12 قسط للمشتريات الكبيرة. يمكن التقديم عليها أونلاين أو في المتجر. الموافقة فورية في معظم الحالات.'
    },
    {
      id: 21,
      category: 'payment',
      question: 'هل معاملاتكم المالية آمنة؟',
      answer: 'أجل! جميع معاملاتنا محمية بتشفير SSL 256-bit ونتبع أعلى معايير الأمان الدولية. لا نحتفظ بمعلومات البطاقات الائتمانية على خوادمنا. شراكاتنا مع بنوك محلية موثوقة تضمن أماناً إضافياً.'
    }
  ];

  // Filter FAQs based on category and search
  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Popular FAQs
  const popularFAQs = faqData.filter(faq => faq.popular);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-white/20 text-white mb-4 text-sm px-4 py-2">
              <HelpCircle className="h-4 w-4 ml-1" />
              مركز المساعدة
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              🤔 الأسئلة الشائعة
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              إجابات على جميع أسئلتك حول خدمات ProCell وبرامجنا المتنوعة
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث في الأسئلة الشائعة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-xl bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-white/50 focus:outline-none shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular FAQs Quick Access */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <Badge className="bg-orange-100 text-orange-700 mb-4">
              <Star className="h-4 w-4 ml-1" />
              الأكثر طلباً
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              🔥 الأسئلة الأكثر شيوعاً
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              أهم الأسئلة التي يسألها عملاؤنا باستمرار
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {popularFAQs.map((faq) => (
              <Card key={faq.id} className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <HelpCircle className="h-4 w-4 text-white" />
                    </div>
                    <CardTitle className="text-lg text-gray-900 leading-tight">{faq.question}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed line-clamp-3">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 mb-6">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">تصفية حسب الفئة:</h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                className={`
                  flex items-center gap-2 transition-all duration-300
                  ${selectedCategory === category.id 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-blue-50 border-gray-200'
                  }
                `}
              >
                <category.icon className="h-4 w-4" />
                {category.name}
                <Badge className={selectedCategory === category.id ? 'bg-white/20 text-white' : category.color}>
                  {faqData.filter(faq => category.id === 'all' ? true : faq.category === category.id).length}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <AccordionItem 
                    key={faq.id} 
                    value={`item-${faq.id}`}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <AccordionTrigger className="px-6 py-4 text-right hover:no-underline group">
                      <div className="flex items-start gap-4 w-full">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                          <HelpCircle className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 text-right">
                          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                            {faq.question}
                          </h3>
                          {faq.popular && (
                            <Badge className="bg-orange-100 text-orange-700 mt-2 text-xs">
                              <Star className="h-3 w-3 ml-1" />
                              سؤال شائع
                            </Badge>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="bg-gray-50 rounded-lg p-4 mr-12">
                        <p className="text-gray-700 leading-relaxed text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  لم نجد نتائج
                </h3>
                <p className="text-gray-600 mb-6">
                  لم نجد أسئلة تطابق بحثك. جرب كلمات مختلفة أو تصفح الفئات المختلفة.
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  عرض جميع الأسئلة
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Support CTA */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4">
              لم تجد إجابة لسؤالك؟ 🤷‍♂️
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              فريق الدعم الفني متاح 24/7 لمساعدتك في أي استفسار
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/972598366822?text=مرحباً، لدي سؤال حول خدمات ProCell"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <MessageSquare className="h-5 w-5 ml-2" />
                واتساب فوري
              </a>
              
              <a 
                href="tel:+972598366822"
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Phone className="h-5 w-5 ml-2" />
                اتصال مباشر
              </a>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <Clock className="h-6 w-6 text-blue-400 mb-2" />
                  <h4 className="font-semibold text-white mb-1">متاح 24/7</h4>
                  <p className="text-gray-400 text-sm">دعم مستمر طوال الأسبوع</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <Zap className="h-6 w-6 text-yellow-400 mb-2" />
                  <h4 className="font-semibold text-white mb-1">رد سريع</h4>
                  <p className="text-gray-400 text-sm">متوسط الرد أقل من 5 دقائق</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <Heart className="h-6 w-6 text-red-400 mb-2" />
                  <h4 className="font-semibold text-white mb-1">فريق متخصص</h4>
                  <p className="text-gray-400 text-sm">خبراء في جميع منتجاتنا</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}